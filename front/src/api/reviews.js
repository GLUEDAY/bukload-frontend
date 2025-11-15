// src/api/reviews.js
import http from "./http";

/**
 * 후기 등록: POST /api/uploads/review?courseSegmentId=...
 * body: { content: string }  // 사진 없이 텍스트만
 */
export async function createReview({ courseSegmentId, content }) {
  const res = await http.post(
    "/api/uploads/review",
    { content }, // ✅ 사진 없이 텍스트만
    {
      params: { courseSegmentId }, // ✅ 명세 param 반영
    }
  );

  const data = res.data;
  // 백엔드가 success/data/message 형태라면:
  if (data && data.success === false) {
    throw new Error(data.message || "후기 등록에 실패했습니다.");
  }

  return data?.data ?? data;
}

/** 포인트 요약: GET /points/summary */
export async function fetchPointsSummary() {
  const res = await http.get("/points/summary");
  const data = res.data;

  if (data && data.success === false) {
    throw new Error(data.message || "포인트 합계 조회에 실패했습니다.");
  }

  return data?.data ?? data;
}

/** 포인트 내역: GET /points/history */
export async function fetchPointsHistory() {
  const res = await http.get("/points/history");
  const data = res.data;

  if (data && data.success === false) {
    throw new Error(data.message || "포인트 내역 조회에 실패했습니다.");
  }

  return data?.data ?? data;
}
