// src/pages/SavedCoursePage.jsx
import { useNavigate } from "react-router-dom";
import BottomNav from "../ui/BottomNav";
import BackImage from "../assets/back.png";
import { useCourses } from "../hook/useCourses";
import FileImage from "../assets/file.png";

// 🔗 공통 알럿 컨텍스트
import { useAlert } from "@/context/AlertContext";

export default function SavedCoursePage() {
  const navigate = useNavigate();
  const { data: courses, isLoading, error } = useCourses(); // 서버에서 내 코스 목록
  const { showAlert } = useAlert();

  const handleClick = (course) => {
    const id = course.id ?? course.courseId ?? course._id;
    if (!id) {
      showAlert("코스 ID가 없어 상세로 이동할 수 없어요.");
      return;
    }
    navigate(`/courses/${id}`, {
      state: {
        region: course.region,
        title: course.title,
        courseId: id,
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 상단 헤더 */}
      <header className="relative flex items-center px-4 pt-6 pb-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5"
        >
          <img src={BackImage} alt="뒤로가기" className="w-25 h-25 object-contain" />
        </button>

        <div className="flex-1 flex items-center justify-end gap-2">
          <img src={FileImage} alt="뒤로가기" className="w-5 h-5 object-contain" />
          <span className="text-[22px] font-bold text-[#974E00]">저장된 코스</span>
        </div>

        <div className="w-8" />
      </header>

      {/* 코스 리스트 */}
      <main className="flex-1 px-6 pt-2 pb-24 overflow-y-auto">
        {isLoading && (
          <p className="py-12 text-center text-sm text-gray-500">불러오는 중…</p>
        )}
        {error && (
          <p className="py-12 text-center text-sm text-red-500">
            코스를 불러오지 못했어요.
          </p>
        )}
        {!isLoading && !error && (
          <>
            {(!courses || courses.length === 0) ? (
              <p className="py-12 text-center text-sm text-gray-500">
                저장된 코스가 없어요.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {courses.map((course) => (
                  <button
                    key={course.id ?? course.courseId ?? course._id}
                    type="button"
                    onClick={() => handleClick(course)}
                    className="w-full flex items-center gap-4 rounded-xl bg-[#FFF4E8] shadow-[0_4px_10px_rgba(0,0,0,0.08)] px-5 py-4 active:scale-[0.99] transition"
                  >
                    {/* 썸네일(없으면 아이콘) */}
                    <div className="w-[56px] h-[56px] rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-tr from-[#D94E27] via-[#FF9056] to-[#F8D192] flex items-center justify-center">
                      {course.thumbnailUrl ? (
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                          onError={(e)=>{ e.currentTarget.src="/images/sample-course-thumbnail.jpg"; }}
                        />
                      ) : (
                        <span className="text-2xl text-white">🏙️</span>
                      )}
                    </div>

                    {/* 텍스트 */}
                    <div className="flex-1 flex flex-col text-left">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[16px] font-bold text-[#974E00] leading-snug line-clamp-2">
                          {course.title || "여행 코스"}
                        </p>
                        <span className="text-[18px] leading-none">⭐</span>
                      </div>
                      <p className="mt-1 text-[13px] text-[#B2B2B2]">
                        {(course.region ?? "지역 미정")}{course.type ? ` | ${course.type}` : ""}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <BottomNav active="mypage" />
    </div>
  );
}
