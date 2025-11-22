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
  console.log("[travel-requests 응답]", data);
  // 로그 보면 { success: true, data: 38, message: null } 이렇게 찍히는 그거!

  if (!data?.success) {
    alert(data?.message || "여행 요청 생성에 실패했습니다.");
    return null;
  }

  const requestId = data?.data; // ✅ 여기만 수정!
  if (!requestId) {
    alert(data?.message || "요청 ID를 받아오지 못했습니다.");
    return null;
  }

  return requestId;
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

  if (!requestId) {
    throw new Error("유효한 requestId가 없습니다.");
  }

  const { data } = await api.post(
    "/recommendations/region", // ✅ /api 제거
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
    { requestId, anchorId }   // ✅ body로 전달 (params 아님!)
  );

  if (!data?.success) {
    throw new Error(data?.message || "코스 추천에 실패했습니다.");
  }

  const courses = data.data || [];
  return { courses };
};


/**
 * 4. 추천 코스 확정 (저장)
 * POST /courses?tempCourseId=
 * 응답: { success, data: { courseId, ... }, message }
 */
// 코스 확정 (저장)
// 4. 추천 코스 확정 (저장)
export const confirmRecommendedCourse = async ({ tempCourseId }) => {
  console.log("✅ /courses 요청 tempCourseId:", tempCourseId);

  const { data } = await api.post(
    "/courses",
    null,                 // body 없음
    { params: { tempCourseId } }  // ✅ 쿼리스트링으로 전송
  );

  if (!data?.success) {
    throw new Error(data?.message || "코스 확정에 실패했습니다.");
  }

  return data.data; // { courseId, ... }
};
