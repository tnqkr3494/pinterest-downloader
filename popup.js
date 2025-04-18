document.getElementById("download-btn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log("스크롤 시작");

  // 페이지에서 스크롤을 내리고 이미지를 추출하도록 메시지 전송
  chrome.tabs.sendMessage(tab.id, { type: "START_SCROLLING" }, (response) => {
    if (response?.images) {
      console.log(response.images); // 추출된 이미지들 확인
      response.images.forEach((url, index) => {
        chrome.downloads.download({
          url,
          filename: `pinterest/${Date.now()}_image_${index}.jpg`,
        });
      });
    }
  });
});
