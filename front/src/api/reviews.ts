// src/api/reviews.ts
import http, { ApiResponse } from "./http";

/** 1) 후기 등록: POST /reviews */
export interface CreateReviewReq {
  courseSegmentId: number;
  content: string;
  photoUrl?: string;
}

export async function createReview(input: CreateReviewReq) {
  const res = await http.post<ApiResponse<unknown>>("/reviews", input);

  if (!res.data.success) {
    throw new Error(res.data.message || "후기 등록에 실패했습니다.");
  }

  return res.data.data;
}

/** 2) 포인트 합계 조회: GET /points/summary */
export async function fetchPointsSummary() {
  const res = await http.get<ApiResponse<unknown>>("/points/summary");

  if (!res.data.success) {
    throw new Error(res.data.message || "포인트 합계 조회에 실패했습니다.");
  }

  return res.data.data;
}

/** 3) 포인트 내역 조회: GET /points/history (필요 시 사용) */
export async function fetchPointsHistory() {
  const res = await http.get<ApiResponse<unknown>>("/points/history");

  if (!res.data.success) {
    throw new Error(res.data.message || "포인트 내역 조회에 실패했습니다.");
  }

  return res.data.data;
}
