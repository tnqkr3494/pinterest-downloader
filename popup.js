document.getElementById("download-btn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(
    tab.id,
    { type: "START_SCROLLING" },
    async (response) => {
      const images = response?.images || [];

      if (images.length === 0) {
        alert("다운로드할 이미지가 없습니다!");
        return;
      }

      const zip = new JSZip();

      images.forEach((img, index) => {
        const ext = img.url.split(".").pop().split("?")[0];
        zip.file(`image_${index + 1}.${ext}`, img.base64.split(",")[1], {
          base64: true,
        });
      });

      const content = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(content);
      a.download = `pinterest_images_${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
    }
  );
});
