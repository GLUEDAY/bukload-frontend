// src/pages/AiCourseListPage.jsx
import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomNav from "../ui/BottomNav";
import AiHyeonmuImage from "../assets/ai-hyeonmu.png";
import BackImage from "../assets/back.png";
import { useCourses } from "../hook/useCourses.js";
import { useSaveCourse } from "../hook/useAiRecommendation.js"; 
import { ACCESS_TOKEN_KEY } from "../api/http.js";
import { useLoading } from "../context/LoadingContext.jsx";
import { useAlert } from "../context/AlertContext.jsx";


export default function AiCourseListPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { withLoading } = useLoading();
  const { showAlert } = useAlert();

  // 진단용 콘솔 (ReferenceError 방지, 중복 제거)
  // eslint-disable-next-line no-console
  console.log("location.state:", location.state);

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


  const handleCourseClick = (course) => {
    // 코스 리스트에서 코스 선택 시 /result로 이동 (단일 course만 전달)
    navigate("/result", {
      state: {
        region: course.region || regionFromResult,
        course, // 단일 코스 객체
        meta,   // 메타 정보
      },
    });
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
          {COURSES.map((course) => (
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
