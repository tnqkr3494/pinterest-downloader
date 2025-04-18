function getImageAsBase64(url) {
  return fetch(url)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result); // base64 string
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "START_SCROLLING") {
    let lastScrollTop = 0;
    const allImages = new Set();

    const scrollStep = () => window.scrollBy(0, 500);

    const extractImages = () => {
      const images = Array.from(document.querySelectorAll("img[srcset]"))
        .map((img) => {
          const srcset = img.srcset;
          const urls = srcset
            .split(",")
            .map((entry) => entry.trim().split(" ")[0])
            .filter((url) => url.includes("pinimg"));
          return urls.length > 0 ? urls[urls.length - 1] : null;
        })
        .filter((url) => url !== null);
      images.forEach((url) => allImages.add(url));
    };

    const scrollPage = () => {
      const interval = setInterval(() => {
        scrollStep();
        extractImages();

        const currentScroll = window.scrollY;
        if (currentScroll === lastScrollTop) {
          clearInterval(interval);
          console.log("스크롤 완료. 이미지 fetch 시작");

          const urls = Array.from(allImages);

          Promise.all(
            urls.map(async (url) => {
              try {
                const base64 = await getImageAsBase64(url);
                return { base64, url };
              } catch {
                return null;
              }
            })
          ).then((results) => {
            const validImages = results.filter((r) => r !== null);
            sendResponse({ images: validImages });
          });
        }

        lastScrollTop = currentScroll;
      }, 1000);
    };

    scrollPage();
    return true;
  }
});
