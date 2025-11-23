// src/api/ai.js
import { api } from "./http";

/**
 * 1️⃣ 여행 요청 생성
 * POST /travel-requests
 */
export const createTravelRequest = async (payload) => {
  const { data } = await api.post("/travel-requests", payload);
  console.log("[travel-requests 응답]", data);

  if (!data?.success) {
    alert(data?.message || "여행 요청 생성에 실패했습니다.");
    return null;
  }

  return data.data; // requestId (number)
};

/**
 * 2️⃣ AI 지역 추천
 * POST /recommendations/region?requestId=...
 */
export const recommendRegion = async (requestIdOrObj) => {
  const requestId =
    typeof requestIdOrObj === "number"
      ? requestIdOrObj
      : requestIdOrObj?.requestId;

  if (!requestId) throw new Error("유효한 requestId가 없습니다.");

  const { data } = await api.post("/recommendations/region", null, {
    params: { requestId },
  });

  console.log("[recommendations/region 응답]", data);

  if (!data?.success) {
    throw new Error(data?.message || "지역 추천에 실패했습니다.");
  }

  return data.data; // { region, anchorId, comment, tags, ... }
};

/**
 * 3️⃣ AI 코스 추천
 * POST /recommendations/courses
 */
export const recommendCourses = async ({ requestId, anchorId }) => {
  if (!requestId || !anchorId) {
    throw new Error("requestId 또는 anchorId가 없습니다.");
  }

  const { data } = await api.post("/recommendations/courses", {
    requestId,
    anchorId,
  });

  console.log("[recommendations/courses 응답]", data);

  if (!data?.success) {
    throw new Error(data?.message || "코스 추천에 실패했습니다.");
  }

  return { courses: data.data || [] };
};

/**
 * 4️⃣ 추천 코스 확정(저장)
 * POST /courses?tempCourseId=...
 */
export const confirmRecommendedCourse = async ({ tempCourseId }) => {
  if (!tempCourseId) throw new Error("유효한 tempCourseId가 없습니다.");

  console.log("✅ [confirmRecommendedCourse] tempCourseId:", tempCourseId);

  const { data } = await api.post("/courses", null, {
    params: { tempCourseId },
  });

  console.log("[POST /courses 응답]", data);

  if (!data?.success) {
    throw new Error(data?.message || "코스 확정에 실패했습니다.");
  }

  return data.data; // { courseId, ... }
};

/**
 * 5️⃣ 코스 상세 조회
 * GET /courses/{courseId}
 */
export const getCourseDetail = async (courseId) => {
  if (!courseId) throw new Error("유효한 courseId가 없습니다.");

  const { data } = await api.get(`/courses/${courseId}`);
  console.log("[GET /courses/{courseId} 응답]", data);

  if (!data?.success) {
    throw new Error(data?.message || "코스 상세 조회에 실패했습니다.");
  }

  return data.data; // { title, segments: [...], ... }
};
