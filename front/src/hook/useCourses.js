// src/hook/useCourses.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCourses,
  fetchCourseDetail,
  addSegment,
  deleteSegment,
  saveCourseSegments,
} from "../api/courses.js";
import { ACCESS_TOKEN_KEY } from "../api/http.js";

/**
 * 1) 내 코스 목록 조회 훅
 * GET /courses?mine=true
 *
 * - ✅ accessToken 이 있을 때만 API 호출
 *   (로그인 안 한 상태에서는 서버에 요청 자체를 안 보냄 → 403 / CORS 에러 X)
 */
export function useCourses(options = {}) {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem(ACCESS_TOKEN_KEY)
      : null;

  return useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
    // 토큰이 있고, 외부에서 enabled를 따로 false로 주지 않은 경우에만 실행
    enabled: !!token && (options.enabled ?? true),
  });
}

/**
 * 2) 코스 상세 조회 훅
 * GET /courses/{courseId}
 */
export function useCourseDetail(courseId) {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => fetchCourseDetail(courseId),
    enabled: Number.isFinite(courseId),
  });
}

/**
 * 3) 코스에 장소 segment 추가
 * POST /courses/{courseId}/segments
 */
export function useAddSegment(courseId) {
  const queryClient = useQueryClient();
  return useMutation({
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
export function useDeleteSegment(courseId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (segmentId) => deleteSegment(courseId, segmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },
  });
}

/**
 * 5) 드래그로 바꾼 순서 저장
 * PUT /courses/{courseId}/segments/fullupdate
 */
export function useSaveCourseSegments(courseId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (order) => saveCourseSegments(courseId, order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}
