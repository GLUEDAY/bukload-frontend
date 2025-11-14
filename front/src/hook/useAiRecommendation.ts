// src/hook/useAiRecommendation.ts
import { useMutation } from "@tanstack/react-query";
import {
  createTravelRequest,
  recommendRegion,
  recommendCourses,
  CreateTravelRequestReq,
  RegionRecommendation,
  RecommendCoursesReq,
  RecommendCoursesRes,
} from "../api/ai";
import {
  saveCourse,
  SaveCourseReq,
  SavedCourse,
} from "../api/courses";

// 1) 여행 요청 생성: POST /travel-requests
export function useCreateTravelRequest() {
  return useMutation<number, Error, CreateTravelRequestReq>({
    mutationFn: (body) => createTravelRequest(body),
  });
}

// 2) 지역 추천: POST /recommendations/region?requestId=...
export function useRecommendRegion() {
  return useMutation<RegionRecommendation, Error, number>({
    mutationFn: (requestId) => recommendRegion(requestId),
  });
}

// 3) 코스 추천: POST /recommendations/courses
export function useRecommendCourses() {
  return useMutation<RecommendCoursesRes, Error, RecommendCoursesReq>({
    mutationFn: (body) => recommendCourses(body),
  });
}

// 4) 추천 코스 확정/저장: POST /courses
export function useSaveCourse() {
  return useMutation<SavedCourse, Error, SaveCourseReq>({
    mutationFn: (body) => saveCourse(body),
  });
}
