// src/api/ai.ts
import http, { ApiResponse } from "./http";

/** 1) 여행 요청 생성 --------------------------------- */

export interface CreateTravelRequestReq {
  themeId?: number;
  departureLocation: string;
  travelDays: number;
  budget: number;
  gender: string;          // "F" | "M" | "OTHER" 등
  birthDate: string;       // "YYYY-MM-DD"
  companions: string;
  style: string;
  additionalRequest?: string;
}

// data: number = requestId
export async function createTravelRequest(
  body: CreateTravelRequestReq
): Promise<number> {
  const res = await http.post<ApiResponse<number>>(
    "/travel-requests",
    body
  );
  if (!res.data.success) {
    throw new Error(res.data.message || "여행 요청 생성 실패");
  }
  return res.data.data;
}

/** 2) 지역 추천 ------------------------------------- */

export interface RegionRecommendation {
  region: string;      // "양주시" 등
  anchorId: string;    // "yangju" 등
  comment: string;
  tags: string[];
}

export async function recommendRegion(
  requestId: number
): Promise<RegionRecommendation> {
  const res = await http.post<ApiResponse<RegionRecommendation>>(
    "/recommendations/region",
    null,
    { params: { requestId } }
  );
  if (!res.data.success) {
    throw new Error(res.data.message || "지역 추천 실패");
  }
  return res.data.data;
}

/** 3) 코스 추천 ------------------------------------- */

export interface AiCoursePlace {
  name: string;
  category: string;
  lat: number;
  lng: number;
}

export interface AiCourse {
  title: string;
  description: string;
  places: AiCoursePlace[];
  totalDistance: string;     // "7km"
  estimatedTime: string;     // "4시간 30분"
  tags: string[];
  localCurrencyMerchants: number;
}

export interface RecommendCoursesReq {
  requestId: number;
  anchorId?: string;
}

export interface RecommendCoursesRes {
  region: string;
  courses: AiCourse[];
}

export async function recommendCourses(
  body: RecommendCoursesReq
): Promise<RecommendCoursesRes> {
  const res = await http.post<ApiResponse<RecommendCoursesRes>>(
    "/recommendations/courses",
    body
  );
  if (!res.data.success) {
    throw new Error(res.data.message || "코스 추천 실패");
  }
  return res.data.data;
}
