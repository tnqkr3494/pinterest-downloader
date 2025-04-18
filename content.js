// ✅ 중복 이미지를 방지하기 위한 Set 선언 (스크롤 시 동일 이미지가 반복됨)
let seenImages = new Set();

/**
 * ✅ 이미지 URL을 받아 base64 문자열로 변환하는 함수
 * - fetch로 blob 데이터를 요청하고 FileReader로 base64 인코딩
 */
function getImageAsBase64(url) {
  return fetch(url)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );
}

/**
 * ✅ 현재 화면에서 새롭게 나타난 이미지들의 URL을 추출하는 함수
 * - Pinterest의 img 태그 구조를 기반으로 src 또는 srcset에서 pinimg 도메인 필터링
 * - 이미 seenImages에 있는 URL은 제외
 */
function extractNewImageUrls() {
  const urls = Array.from(document.querySelectorAll("div.Yl- img"))
    .map((img) => {
      if (img.srcset) {
        const parsed = img.srcset
          .split(",")
          .map((entry) => entry.trim().split(" ")[0])
          .filter((url) => url.includes("pinimg"));
        return parsed.length > 0 ? parsed[parsed.length - 1] : null;
      } else if (img.src && img.src.includes("pinimg")) {
        return img.src;
      } else {
        return null;
      }
    })
    .filter((url) => url !== null && !seenImages.has(url));

  // 📌 새로 추출한 이미지 URL을 seenImages에 추가 (중복 방지)
  // 여기서 이미지 몇몇개가 다운안되는 문제 발생.
  // popup으로 넘겨주는 최종 collectedUrls에서 확인해주어야함.

  return urls;
}

/**
 * ✅ 일정 시간 간격으로 자동 스크롤하며 이미지 URL을 수집하고 base64로 변환
 *
 * @param {number} limit - 수집할 이미지 개수 제한 (기본 100개)
 * @param {number} timeout - 스크롤 간격 (ms)
 * @param {number} maxAttempts - 최대 스크롤 시도 횟수 (무한 루프 방지)
 * @returns {Promise<{images, done, progress}>}
 */
async function scrollAndCollect(limit = 100, timeout = 500, maxAttempts = 500) {
  let collectedUrls = [];
  let attempts = 0;
  let lastHeight = -1;

  while (collectedUrls.length < limit && attempts < maxAttempts) {
    // ⏱️ 지정된 시간 대기 후 이미지 추출 시도(이미지 로딩 시간으로 인한 추가 처리)
    await new Promise((r) => setTimeout(r, timeout));

    const newUrls = extractNewImageUrls();

    // 📦 아직 수집하지 않은 URL만 추가
    collectedUrls.push(...newUrls.slice(0, limit - collectedUrls.length));
    collectedUrls.forEach((url) => seenImages.add(url));

    // 🔻 500px 아래로 스크롤 => 스크롤이 얼마나 내려가는지에 따라 스킵되버리는 이미지도 생겨서 주의 필요.
    window.scrollBy(0, 500);

    const currentHeight = window.scrollY;

    // 🔁 스크롤이 더 이상 내려가지 않으면 반복 종료
    if (currentHeight === lastHeight) break;
    lastHeight = currentHeight;
    attempts++;
  }

  // 📸 수집한 이미지 URL들을 base64로 변환
  const results = await Promise.all(
    collectedUrls.map(async (url) => {
      try {
        const base64 = await getImageAsBase64(url);
        return { base64, url };
      } catch {
        return null;
      }
    })
  );

  const validImages = results.filter((r) => r !== null);

  // 📊 스크롤 진행률 계산 (0~100%)
  const scrollProgress = Math.min(
    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100,
    100
  );

  // ✅ 수집 완료 여부 판단 (수집 제한 미달 or 끝까지 스크롤)
  const done =
    validImages.length < limit || window.scrollY >= document.body.scrollHeight;

  return { images: validImages, done, progress: scrollProgress };
}

/**
 * ✅ 확장 프로그램으로부터 메시지를 수신하면 이미지 수집 작업 실행
 * - 메시지 타입: GET_NEXT_IMAGE_BATCH
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_NEXT_IMAGE_BATCH") {
    scrollAndCollect(100).then(({ images, done, progress }) => {
      sendResponse({ images, done, progress });
    });
    return true; // 비동기 응답 처리를 위해 true 반환
  }
});
