// src/hook/useAiRecommendation.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTravelRequest,
  recommendRegion,
  recommendCourses,
} from "../api/ai.js";
import { saveCourse } from "../api/courses.js";

/**
 * 1) 여행 요청 생성
 * POST /travel-requests
 * 반환: number(requestId)
 */
export function useCreateTravelRequest() {
  return useMutation({
    mutationFn: (body) => createTravelRequest(body),
  });
}

/**
 * 2) AI 지역 우선 추천
 * POST /recommendations/region?requestId=1
 * 반환: { region, anchorId, comment, tags, ... }
 */
export function useRecommendRegion() {
  return useMutation({
    mutationFn: (requestId) => recommendRegion(requestId),
  });
}

/**
 * 3) AI 코스 추천
 * POST /recommendations/courses
 * payload: { requestId, anchorId }
 * 반환: { courses: AiCourse[] }
 */
export function useRecommendCourses() {
  return useMutation({
    mutationFn: ({ requestId, anchorId }) =>
      recommendCourses({ requestId, anchorId }),
  });
}

/**
 * 4) 추천 코스 확정/저장
 * POST /courses
 * payload: SaveCourseReq
 * 반환: SavedCourse
 */
export function useSaveCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => saveCourse(body),
    onSuccess: () => {
      // 코스 저장 후 내 코스 목록 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}
