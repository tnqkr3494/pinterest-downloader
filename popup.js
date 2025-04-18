document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("download-btn")
    .addEventListener("click", async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      // 로딩 표시 시작
      document.getElementById("loading").style.display = "block";
      document.getElementById("progress-container").style.display = "block";
      document.getElementById("download-btn").style.display = "none"; // 버튼 숨기기

      chrome.tabs.sendMessage(
        tab.id,
        { type: "START_SCROLLING" },
        async (response) => {
          const images = response?.images || [];

          if (images.length === 0) {
            alert("다운로드할 이미지가 없습니다!");
            document.getElementById("loading").style.display = "none"; // 로딩 종료
            document.getElementById("progress-container").style.display =
              "none"; // 진행 바 숨기기
            document.getElementById("download-btn").style.display = "block"; // 버튼 다시 보이기
            return;
          }

          const zip = new JSZip();

          for (let i = 0; i < images.length; i++) {
            const img = images[i];
            const ext = img.url.split(".").pop().split("?")[0];
            zip.file(`image_${i + 1}.${ext}`, img.base64.split(",")[1], {
              base64: true,
            });

            // 진행 상태 업데이트 (이미지마다 진행상태 갱신)
            const progress = ((i + 1) / images.length) * 100;
            document.getElementById("progress-bar").value = progress;
            document.getElementById(
              "progress-text"
            ).textContent = `${Math.round(progress)}%`;
          }

          const content = await zip.generateAsync({ type: "blob" });

          // 다운로드 링크 생성
          const a = document.createElement("a");
          a.href = URL.createObjectURL(content);
          a.download = `pinterest_images_${Date.now()}.zip`;
          a.click();

          // 로딩 종료
          URL.revokeObjectURL(a.href);
          document.getElementById("loading").style.display = "none"; // 로딩 종료
          document.getElementById("progress-container").style.display = "none"; // 진행 바 숨기기
          document.getElementById("download-btn").style.display = "block"; // 버튼 다시 보이기
        }
      );
    });
});
