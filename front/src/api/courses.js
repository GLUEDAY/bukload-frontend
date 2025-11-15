// src/api/courses.js
import http from "./http";

/** 공통 타입 설명 (JS라 주석으로만)
 * CourseListItem: { courseId, title, region, thumbnailUrl?, totalDistanceKm?, estimatedMinutes? }
 * CourseSegment: { id?, orderNo, placeId, placeName, category, lat, lng, transportMode, hasLocalCurrency? }
 * CourseDetail: { courseId, title, description?, region, totalDistanceKm, estimatedMinutes, segments: CourseSegment[] }
 */

// 1) 내 코스 목록 조회: GET /courses?mine=true
export async function fetchCourses() {
  const res = await http.get("/courses", {
    params: { mine: true },
  });

  if (!res.data?.success) {
    throw new Error(res.data?.message || "코스 목록 조회 실패");
  }
  return res.data.data; // CourseListItem[]
}

// 2) 코스 상세 조회: GET /courses/{courseId}
export async function fetchCourseDetail(id) {
  const res = await http.get(`/courses/${id}`);

  if (!res.data?.success) {
    throw new Error(res.data?.message || "코스 상세 조회 실패");
  }
  return res.data.data; // CourseDetail
}

// 3) 코스에 장소 segment 추가: POST /courses/{courseId}/segments
export async function addSegment(courseId, input) {
  const res = await http.post(`/courses/${courseId}/segments`, input);

  if (!res.data?.success) {
    throw new Error(res.data?.message || "장소 추가 실패");
  }
  return res.data.data;
}

// 4) 코스에서 segment 삭제: DELETE /courses/{courseId}/segments/{segmentId}
export async function deleteSegment(courseId, segmentId) {
  const res = await http.delete(`/courses/${courseId}/segments/${segmentId}`);

  if (!res.data?.success) {
    throw new Error(res.data?.message || "장소 삭제 실패");
  }
  return res.data.data;
}

// 5) 추천 코스 확정/저장: POST /courses
//    body: { requestId, anchorId, title, description?, places: [{ placeId?, name, category, lat?, lng?, orderNo, transportMode? }] }
export async function saveCourse(body) {
  const res = await http.post("/courses", body);

  if (!res.data?.success) {
    throw new Error(res.data?.message || "코스 저장 실패");
  }
  return res.data.data; // SavedCourse (CourseDetail과 동일 구조)
}

// 6) 세그먼트 전체 순서 저장: PUT /courses/{courseId}/segments/fullupdate
//    body: { order: number[] }  // segment id 배열
export async function saveCourseSegments(courseId, order) {
  const res = await http.put(`/courses/${courseId}/segments/fullupdate`, {
    order,
  });

  if (!res.data?.success) {
    throw new Error(res.data?.message || "코스 순서 저장 실패");
  }
  return res.data.data;
}
