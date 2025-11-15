// src/api/ai.js
import { api } from "./http";

/**
 * 1. 여행 요청 생성
 * POST /travel-requests
 * body: { themeId, departureLocation, travelDays, budget, gender, birthDate, companions, style, additionalRequest }
 * 응답: { success, data: { requestId, ... }, message }
 *
 * => 이 함수는 "requestId (number)"만 반환하게 만든다.
 */
export const createTravelRequest = async (payload) => {
  const { data } = await api.post("/travel-requests", payload);

  if (!data?.success) {
    throw new Error(data?.message || "여행 요청 생성에 실패했습니다.");
  }

  const requestId = data?.data?.requestId;
  if (!requestId) {
    throw new Error("요청 ID를 받아오지 못했습니다.");
  }

  return requestId; // ✅ PlannerPage에서 바로 숫자로 사용
};

/**
 * 2. AI 지역 우선 추천
 * POST /recommendations/region?requestId=...
 * body: 없음
 * 응답: { success, data: { region, regionEng, comment, tags, anchorId, ... }, message }
 *
 * => 이 함수는 data 객체만 반환 (PlannerPage: regionRes.region, regionRes.anchorId)
 */
export const recommendRegion = async (requestIdOrObj) => {
  const requestId =
    typeof requestIdOrObj === "number"
      ? requestIdOrObj
      : requestIdOrObj?.requestId;

  const { data } = await api.post(
    "/recommendations/region",
    null,
    { params: { requestId } }
  );

  if (!data?.success) {
    throw new Error(data?.message || "지역 추천에 실패했습니다.");
  }

  return data.data; // ✅ { region, anchorId, comment, tags, ... }
};

/**
 * 3. AI 코스 추천
 * POST /recommendations/courses?requestId=&anchorId=
 * 응답: { success, data: [ { tempCourseId, title, region, imageUrl, travelDays, ... }, ... ], message }
 *
 * => 이 함수는 코스 배열만 반환
 */
export const recommendCourses = async ({ requestId, anchorId }) => {
  const { data } = await api.post(
    "/recommendations/courses",
    null,
    {
      params: { requestId, anchorId },
    }
  );

  if (!data?.success) {
    throw new Error(data?.message || "코스 추천에 실패했습니다.");
  }

  // 필요에 따라 key 이름을 맞춰줄 수 있음
  const courses = data.data || [];
  return { courses }; // ✅ PlannerPage: const courses = courseRes?.courses || [];
};

/**
 * 4. 추천 코스 확정 (저장)
 * POST /courses?tempCourseId=
 * 응답: { success, data: { courseId, ... }, message }
 */
export const confirmRecommendedCourse = async ({ tempCourseId }) => {
  const { data } = await api.post(
    "/courses",
    null,
    { params: { tempCourseId } }
  );

  if (!data?.success) {
    throw new Error(data?.message || "코스 확정에 실패했습니다.");
  }

  return data.data; // { courseId, ... }
};
