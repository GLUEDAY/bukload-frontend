// src/hook/usePoints.ts
import { useQuery } from "@tanstack/react-query";
import { fetchPointsSummary, fetchPointsHistory } from "../api/reviews";

/**
 * 현재 총 포인트 조회
 * - GET /points/summary
 */
export function usePointsSummary() {
  return useQuery({
    queryKey: ["points-summary"],
    queryFn: fetchPointsSummary,
  });
}

/**
 * 포인트 적립/사용 내역 조회
 * - GET /points/history
 * (이 화면 안 만들 거면 이 훅은 안 써도 됨)
 */
export function usePointsHistory() {
  return useQuery({
    queryKey: ["points-history"],
    queryFn: fetchPointsHistory,
  });
}
