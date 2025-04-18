document.addEventListener("DOMContentLoaded", () => {
  // 📌 다운로드 버튼 클릭 시 동작
  document
    .getElementById("download-btn")
    .addEventListener("click", async () => {
      // 1️⃣ 현재 활성화된 탭 정보 가져오기
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      // 2️⃣ JSZip 인스턴스 생성 (이미지 압축용)
      const zip = new JSZip();

      // 3️⃣ 이미지 및 배치 카운터 초기화
      let imageCount = 0;
      let batchCount = 1;

      // 4️⃣ UI 요소 가져오기
      const loading = document.getElementById("loading");
      const progressContainer = document.getElementById("progress-container");
      const downloadBtn = document.getElementById("download-btn");
      const progressBar = document.getElementById("progress-bar");
      const progressText = document.getElementById("progress-text");

      // 5️⃣ 다운로드 시작 시 UI 전환
      loading.style.display = "block";
      progressContainer.style.display = "block";
      downloadBtn.style.display = "none";

      // 📦 6️⃣ 이미지 배치 수집 및 다운로드 처리
      const fetchNextBatch = () => {
        chrome.tabs.sendMessage(
          tab.id,
          { type: "GET_NEXT_IMAGE_BATCH" },
          async (response) => {
            const images = response.images || [];

            // 🔄 스크롤 기반 진행률 UI 업데이트
            progressBar.value = response.progress;
            progressText.textContent = `${Math.round(response.progress)}%`;

            // 💾 이미지가 있다면 ZIP에 추가
            if (images.length > 0) {
              for (let i = 0; i < images.length; i++) {
                const img = images[i];
                // 확장자
                const ext = img.url.split(".").pop().split("?")[0];
                zip.file(
                  `image_${imageCount + 1}.${ext}`,
                  img.base64.split(",")[1],
                  {
                    base64: true,
                  }
                );
                imageCount++;
              }

              // 📁 ZIP 압축 완료 후 자동 다운로드
              const content = await zip.generateAsync({ type: "blob" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(content);
              a.download = `pinterest_batch_${batchCount}.zip`;
              a.click();
              URL.revokeObjectURL(a.href);

              // 🧹 ZIP 인스턴스 초기화 (다음 배치를 위해)
              zip.files = {};
              batchCount++;
            }

            // 🔁 아직 스크롤 끝이 아니면 다음 배치 요청
            if (!response.done) {
              fetchNextBatch();
            } else {
              // ✅ 완료 시 UI 복구 및 알림
              loading.style.display = "none";
              progressContainer.style.display = "none";
              downloadBtn.style.display = "block";
              alert("이미지 다운로드 완료!");
            }
          }
        );
      };

      fetchNextBatch();
    });
});
