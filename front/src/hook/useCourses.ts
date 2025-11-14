// src/hook/useCourses.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCourses,
  fetchCourseDetail,
  addSegment,
  deleteSegment,
  saveCourseSegments,   // ⭐ 추가된 부분
  CourseListItem,
  CourseDetail,
} from "../api/courses";

/**
 * 1) 내 코스 목록 조회 훅
 * GET /courses?mine=true
 */
export function useCourses() {
  return useQuery<CourseListItem[], Error>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });
}

/**
 * 2) 코스 상세 조회 훅
 * GET /courses/{courseId}
 */
export function useCourseDetail(courseId: number) {
  return useQuery<CourseDetail, Error>({
    queryKey: ["course", courseId],
    queryFn: () => fetchCourseDetail(courseId),
    enabled: Number.isFinite(courseId),
  });
}

/**
 * 3) 코스에 장소 segment 추가
 * POST /courses/{courseId}/segments
 */
export function useAddSegment(courseId: number) {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { placeId: string; orderNo: number }>({
    mutationFn: (input) => addSegment(courseId, input),
    onSuccess: () => {
      // 상세 데이터 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },
  });
}

/**
 * 4) 코스에서 segment 삭제
 * DELETE /courses/{courseId}/segments/{segmentId}
 */
export function useDeleteSegment(courseId: number) {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, number>({
    mutationFn: (segmentId) => deleteSegment(courseId, segmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },
  });
}

/**
 * ⭐ 5) 드래그로 바꾼 순서 저장 (새 API)
 * PUT /courses/{courseId}/segments/fullupdate
 */
export function useSaveCourseSegments(courseId: number) {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, number[]>({
    mutationFn: (order) => saveCourseSegments(courseId, order),
    onSuccess: () => {
      // 저장 후 최신 데이터 반영
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}
