// src/pages/AiCourseListPage.jsx
import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomNav from "../ui/BottomNav";
import AiHyeonmuImage from "../assets/ai-hyeonmu.png";
import BackImage from "../assets/back.png";
import { useCourses } from "../hook/useCourses"; // ✅ 서버에 이미 저장된 코스 목록
import { useSaveCourse } from "../hook/useAiRecommendation"; // ✅ AI 추천 코스 → 저장용

// 🔗 공통 로딩 / 알럿 컨텍스트
import { useLoading } from "@/context/LoadingContext";
import { useAlert } from "@/context/AlertContext";

export default function AiCourseListPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { withLoading } = useLoading();
  const { showAlert } = useAlert();

  const regionFromResult = location.state?.region || "의정부";
  const incoming = location.state?.courses || null; // AI 추천 코스 배열
  const meta = location.state?.meta || null;        // { requestId, anchorId }

  const { data: serverCourses } = useCourses(); // 서버에 이미 저장된 코스 목록 (없으면 undefined)
  const saveCourse = useSaveCourse();

  // 화면에 쓸 목록: state(courses) 우선 → 서버 목록 → 없으면 빈 배열
  const COURSES = useMemo(
    () => incoming || serverCourses || [],
    [incoming, serverCourses]
  );

  const filteredCourses = COURSES.filter(
    (c) =>
      !c?.region ||
      c.region === regionFromResult ||
      regionFromResult === "의정부"
  );

  const handleCourseClick = async (course) => {
    // 1) 이미 서버에 저장된 코스(id가 있는 경우) → 바로 상세로 이동
    const existingId = course.id ?? course.courseId ?? course._id;
    if (existingId) {
      navigate(`/course/${existingId}`, {
        state: {
          region: course.region || regionFromResult,
          title: course.title,
          courseId: existingId,
        },
      });
      return;
    }

    // 2) AI 추천 결과로만 존재하는 코스(→ 저장 후 이동)
    if (!meta?.requestId) {
      showAlert(
        "코스 정보를 저장할 수 있는 요청 ID가 없어요. 처음 단계부터 다시 시도해 주세요."
      );
      return;
    }

    try {
      await withLoading(async () => {
        const payload = {
          requestId: meta.requestId,
          anchorId: meta.anchorId,
          title: course.title,
          description: course.description,
          places: (course.places || []).map((p, idx) => ({
            placeId: null,
            name: p.name,
            category: p.category,
            lat: p.lat,
            lng: p.lng,
            orderNo: idx + 1,
            transportMode: "CAR", // 기본값
          })),
        };

        const saved = await saveCourse.mutateAsync(payload);
        const newId = saved.courseId ?? saved.id;

        if (!newId) {
          showAlert(
            "코스는 저장되었지만 ID를 찾지 못했어요. 서버 응답을 확인해 주세요."
          );
          return;
        }

        // 저장된 코스 상세 페이지로 이동
        navigate(`/course/${newId}`, {
          state: {
            region: saved.region || regionFromResult,
            title: saved.title || course.title,
            courseId: newId,
          },
        });
      });
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "코스를 저장하는 중 오류가 발생했어요.";
      showAlert(msg);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 상단 헤더 (디자인 그대로) */}
      <header className="pt-4 px-4 flex items-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5"
        >
          <img src={BackImage} alt="화살표" className="w-25 h-25 object-contain" />
        </button>
      </header>

      {/* 제목 + 현무 이미지 (디자인 그대로) */}
      <section className="flex justify-center mt-6 mb-4">
        <div className="flex items-center gap-3"></div>
        <p className="text-[20px] leading-snug font-bold text-[#974E00]  text-center">
          AI 현무가 제안하는
          <br />
          n가지 여행 코스
        </p>
        <img
          src={AiHyeonmuImage}
          alt="AI 현무 캐릭터"
          className="w-[66px] h-[66px] object-contain"
        />
      </section>

      {/* 리스트 (디자인 그대로) */}
      <main className="mt-6 flex-1 overflow-y-auto px-4 pb-24">
        <div className="flex flex-col gap-4">
          {filteredCourses.map((course) => (
            <button
              key={course.id ?? course.courseId ?? course._id ?? course.title}
              type="button"
              onClick={() => handleCourseClick(course)}
              className="w-full bg-[#FFF4E8] rounded-[16px] shadow-[0_4px_10px_rgba(0,0,0,0.1)] flex items-center px-5 py-3 mt-5 active:scale-[0.99] transition-transform"
            >
              <div className="w-16 h-16 rounded-[12px] overflow-hidden mr-3 flex-shrink-0">
                <img
                  src={course.thumbnailUrl || "/images/sample-course-thumbnail.jpg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = "/images/sample-course-thumbnail.jpg")}
                />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[16px] font-semibold text-[#974E00]">
                  {course.title || "추천 코스"}
                </p>
                <p className="mt-1 text-[14px] text-[#B2B2B2]">
                  {(course.region || regionFromResult) +
                    (course.type ? ` | ${course.type}` : "")}
                </p>
              </div>
              <div className="ml-2 flex items-center justify-center">
                <span className="text-[25px] text-[#C8802A]">☕</span>
              </div>
            </button>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
