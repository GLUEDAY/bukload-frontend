// src/hook/useReviews.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview, CreateReviewReq } from "../api/reviews";

/**
 * 후기 작성 훅
 * - POST /reviews
 * - 변수: { courseSegmentId, content, photoUrl? }
 */
export function useCreateReview() {
  const qc = useQueryClient();

  return useMutation<unknown, Error, CreateReviewReq>({
    mutationFn: (input) => createReview(input),
    onSuccess: () => {
      // 필요하면 리뷰 목록, 포인트 요약 등 같이 invalidate
      qc.invalidateQueries({ queryKey: ["reviews"] });
      qc.invalidateQueries({ queryKey: ["points-summary"] });
    },
  });
}
