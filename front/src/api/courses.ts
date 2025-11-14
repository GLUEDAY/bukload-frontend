// src/api/courses.ts
import http, { ApiResponse } from "./http";

/** 공통 타입들 -------------------------------------------------- */

export type TransportMode = "CAR" | "WALK" | "TRANSIT" | string;

// 🟠 내 코스 목록 아이템 (GET /courses?mine=true)
export interface CourseListItem {
  courseId: number;
  title: string;
  region: string;
  thumbnailUrl?: string;
  totalDistanceKm?: number;
  estimatedMinutes?: number;
}

// 🟠 코스 상세(segments 포함) – 저장된 코스 구조랑 거의 동일
export interface CourseSegment {
  id?: number;
  orderNo: number;
  placeId: string | null;
  placeName: string;
  category: string;
  lat: number;
  lng: number;
  transportMode: TransportMode;
  hasLocalCurrency?: boolean;
}

export interface CourseDetail {
  courseId: number;
  title: string;
  description?: string;
  region: string;
  totalDistanceKm: number;
  estimatedMinutes: number;
  segments: CourseSegment[];
}

/** 1) 내 코스 목록 조회: GET /courses?mine=true ---------------- */

export async function fetchCourses(): Promise<CourseListItem[]> {
  const res = await http.get<ApiResponse<CourseListItem[]>>("/courses", {
    params: { mine: true }, // 명세: mine=true 넣으면 내 코스만
  });

  if (!res.data.success) {
    throw new Error(res.data.message || "코스 목록 조회 실패");
  }
  return res.data.data;
}

/** 2) 코스 상세 조회: GET /courses/{courseId} ------------------- */

export async function fetchCourseDetail(id: number): Promise<CourseDetail> {
  const res = await http.get<ApiResponse<CourseDetail>>(`/courses/${id}`);

  if (!res.data.success) {
    throw new Error(res.data.message || "코스 상세 조회 실패");
  }
  return res.data.data;
}

/** 3) 코스에 장소 segment 추가 (임시) --------------------------- */
/**
 * 명세에는 나중에 /courses/{courseId}/segments/db, order 변경용 PUT 등이 생길 예정이라
 * 일단은 지금 쓰고 있는 /courses/{courseId}/segments 엔드포인트를 그대로 유지하고,
 * 서버가 완성되면 여기만 한 번에 바꾸면 돼!
 */
export async function addSegment(
  courseId: number,
  input: { placeId: string; orderNo: number }
) {
  const res = await http.post<ApiResponse<any>>(
    `/courses/${courseId}/segments`,
    input
  );

  if (!res.data.success) {
    throw new Error(res.data.message || "장소 추가 실패");
  }
  return res.data.data;
}

/** 4) 코스에서 segment 삭제 (임시) ------------------------------ */

export async function deleteSegment(courseId: number, segmentId: number) {
  const res = await http.delete<ApiResponse<any>>(
    `/courses/${courseId}/segments/${segmentId}`
  );

  if (!res.data.success) {
    throw new Error(res.data.message || "장소 삭제 실패");
  }
  return res.data.data;
}

/** 5) 추천 코스 확정/저장: POST /courses ------------------------ */

export interface SaveCoursePlaceReq {
  placeId?: string | null;
  name: string;
  category: string;
  lat?: number;
  lng?: number;
  orderNo: number;
  transportMode?: TransportMode;
}

export interface SaveCourseReq {
  requestId: number;
  anchorId: string;
  title: string;
  description?: string;
  places: SaveCoursePlaceReq[];
}

// SavedCourse는 CourseDetail 구조와 동일하게 사용
export type SavedCourse = CourseDetail;

export async function saveCourse(body: SaveCourseReq): Promise<SavedCourse> {
  const res = await http.post<ApiResponse<SavedCourse>>("/courses", body);

  if (!res.data.success) {
    throw new Error(res.data.message || "코스 저장 실패");
  }
  return res.data.data;
}

/** 6) 세그먼트 전체 순서 저장: PUT /courses/{courseId}/segments/fullupdate --- */
/**
 * body: { order: number[] }  // segment id들의 순서
 * -> 코스 상세에서 드래그로 바꾼 순서를 한 번에 저장할 때 사용
 */
export async function saveCourseSegments(
  courseId: number,
  order: number[]
): Promise<any> {
  const res = await http.put<ApiResponse<any>>(
    `/courses/${courseId}/segments/fullupdate`,
    { order }
  );

  if (!res.data.success) {
    throw new Error(res.data.message || "코스 순서 저장 실패");
  }
  return res.data.data;
}
