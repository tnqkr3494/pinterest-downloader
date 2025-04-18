chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "START_SCROLLING") {
    console.log("스크롤을 시작합니다...");

    let lastScrollTop = 0;
    const allImages = new Set(); // 중복 방지용 Set

    // 스크롤을 일정량만 내리는 함수
    const scrollStep = () => {
      window.scrollBy(0, 500); // 500px만큼 아래로 스크롤
    };

    // 이미지를 추출하는 함수
    const extractImages = () => {
      const images = Array.from(document.querySelectorAll("img[srcset]"))
        .map((img) => {
          // srcset에서 가장 고해상도 이미지 선택
          const srcset = img.srcset;
          const urls = srcset
            .split(",")
            .map((entry) => entry.trim().split(" ")[0])
            .filter((url) => url.includes("pinimg"));
          return urls.length > 0 ? urls[urls.length - 1] : null; // 가장 높은 해상도 선택
        })
        .filter((url) => url !== null);

      images.forEach((src) => allImages.add(src));
    };

    // 스크롤을 반복하면서 이미지 로딩
    const scrollPage = () => {
      const interval = setInterval(() => {
        scrollStep();
        extractImages(); // 스크롤할 때마다 이미지 수집

        const currentScroll = window.scrollY;
        if (currentScroll === lastScrollTop) {
          clearInterval(interval);
          console.log("스크롤 완료, 이미지 추출 끝.");
          sendResponse({ images: Array.from(allImages) });
        }
        lastScrollTop = currentScroll;
      }, 1000); // 1초마다 500px씩 내려감
    };

    scrollPage();

    return true; // 비동기 응답 처리를 위해 true 반환
  }
});
