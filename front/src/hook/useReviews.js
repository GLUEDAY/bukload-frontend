// src/hook/useReviews.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview } from "../api/reviews";

export function useCreateReview() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input) => createReview(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
      qc.invalidateQueries({ queryKey: ["points-summary"] });
    },
  });
}
