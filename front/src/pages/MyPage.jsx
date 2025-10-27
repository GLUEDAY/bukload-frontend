import Header from "../ui/Header";
import BottomNav from "../ui/BottomNav";
import { BookOpen } from "lucide-react";

export default function MyPage() {
  const savedCourses = [
    {
      id: 1,
      title: "로컬 맛집 완전 정복 코스",
      location: "의정부 | 당일치기",
      image:
        "https://images.unsplash.com/photo-1555992336-cbf2c7b7fc34?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      title: "감성 카페 & 독립 서점 코스",
      location: "파주 | 반나절",
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF2E6] to-white relative pb-[100px]">
      <Header title="마이페이지" centered={true} />

      <main className="relative z-10 mx-auto px-5 pt-4 pb-6 max-w-md md:max-w-2xl">
        {/* 포인트 카드 */}
        <section className="rounded-2xl border border-[#F4A259]/40 bg-[#FFE9D6]/60 shadow-sm p-5 text-center mb-8">
          <p className="text-[#8A6B52] font-medium mb-1">나의 북로드 포인트</p>
          <p className="text-[40px] font-extrabold text-green-600 mb-2">1,500 P</p>
          <button className="px-4 py-2 rounded-full bg-white border border-[#E6D9CC] text-[#8A6B52] shadow-sm hover:bg-[#fff8f4] transition">
            포인트 스토어 가기
          </button>
        </section>

        {/* 저장된 코스 */}
        <section className="mb-8">
          <h2 className="flex items-center gap-1 text-[#8A6B52] font-semibold text-[18px] mb-3">
            <BookOpen className="w-5 h-5 text-[#8A6B52]" />
            저장된 코스
          </h2>

          <div className="space-y-3">
            {savedCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-center gap-3 bg-[#FFF8F4] border border-[#E6D9CC] rounded-2xl p-3 shadow-[0_1px_4px_rgba(0,0,0,0.05)]"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <p className="font-bold text-[#8A6B52] text-[16px]">
                    {course.title}
                  </p>
                  <p className="text-[14px] text-[#B7A9A0] mt-0.5">
                    {course.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 기타 설정 */}
        <section className="space-y-3">
          <h2 className="text-[#8A6B52] font-semibold text-[18px]">기타</h2>
          <button className="w-full py-3 rounded-xl border border-[#E6D9CC] bg-white text-[#8A6B52] text-[16px] hover:bg-[#FFF8F4] transition">
            계정 설정
          </button>
          <button className="w-full py-3 rounded-xl border border-[#E6D9CC] bg-[#F3F4F6] text-gray-600 text-[16px] hover:bg-[#E9E9E9] transition">
            로그아웃
          </button>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
