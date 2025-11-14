// src/pages/PlannerPage.jsx
import { useState, useMemo } from "react";
import Header from "../ui/Header";
import StepCard from "../ui/StepCard";
import Segmented from "../ui/Segmented";
import Chip from "../ui/Chip";
import BottomNav from "../ui/BottomNav";
import { useNavigate } from "react-router-dom";
import MapImage from "../assets/map.png";

// 🔗 AI 추천 훅들
import {
  useCreateTravelRequest,
  useRecommendRegion,
  useRecommendCourses,
} from "../hook/useAiRecommendation";

// 🔗 공통 로딩 / 알럿 컨텍스트
import { useLoading } from "@/context/LoadingContext";
import { useAlert } from "@/context/AlertContext";

const DURATIONS = ["당일치기", "1박 2일", "2박 3일", "3박 4일"];
const TAGS = ["휴식 #힐링", "맛집 #로컬푸드", "포토 #인생샷", "액티비티 #도전", "문화 #전시", "쇼핑"];

export default function PlannerPage() {
  const [duration, setDuration] = useState("1박 2일");
  const [departure, setDeparture] = useState("");
  const [withWho, setWithWho] = useState("연인");
  const [selectedTags, setSelectedTags] = useState([]);
  const [freeText, setFreeText] = useState("");

  // STEP2 직접입력
  const [customOpen, setCustomOpen] = useState(false);
  const [customText, setCustomText] = useState("");

  const navigate = useNavigate();

  const { withLoading } = useLoading();
  const { showAlert } = useAlert();

  const toggleTag = (t) =>
    setSelectedTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const addCustomTag = () => {
    const t = customText.trim();
    if (!t) return;
    if (!selectedTags.includes(t)) setSelectedTags((prev) => [...prev, t]);
    setCustomText("");
  };

  // ===== API 훅 =====
  const createReq = useCreateTravelRequest();
  const recRegion = useRecommendRegion();
  const recCourses = useRecommendCourses();

  const isSubmitting = createReq.isPending || recRegion.isPending || recCourses.isPending;

  // UI 값 → API payload 매핑
  const travelDays = useMemo(() => {
    if (duration === "당일치기") return 1;
    if (duration.includes("1박")) return 2;
    if (duration.includes("2박")) return 3;
    if (duration.includes("3박")) return 4;
    return 1;
  }, [duration]);

  const companions = useMemo(() => {
    if (withWho === "혼자") return "solo";
    if (withWho === "친구") return "friends";
    if (withWho === "연인") return "couple";
    if (withWho === "가족") return "family";
    return "friends";
  }, [withWho]);

  const submit = async (e) => {
    e.preventDefault();

    try {
      await withLoading(async () => {
        // 1) 여행 요청 생성 (createTravelRequest → number(requestId) 반환)
        const requestId = await createReq.mutateAsync({
          themeId: 1, // 필요시 선택값으로 바꿔도 됨
          departureLocation: departure || "의정부역",
          travelDays,
          budget: 50000, // TODO: 예산 입력 UI 만들면 연결
          style: selectedTags.join(", "),
          companions,
          additionalRequest: freeText,
          // gender, birthDate 등은 로그인/프로필 연동 시에 쓰면 됨
          gender: "F",
          birthDate: "1999-01-01",
        });

        // 2) 지역 추천
        const regionRes = await recRegion.mutateAsync(requestId);
        // 명세: { region, anchorId, comment, tags }
        const regionName = regionRes?.region || "의정부";
        const anchorId = regionRes?.anchorId;

        if (!anchorId) {
          throw new Error("추천 지역 정보를 가져오지 못했어요. 다시 시도해 주세요.");
        }

        // 3) 코스 추천 (AI 코스 후보들)
        const courseRes = await recCourses.mutateAsync({ requestId, anchorId });
        const courses = courseRes?.courses || [];

        // 4) 코스 리스트 페이지로 이동 (AI 응답 기반)
        navigate("/ai-courses", {
          state: {
            region: regionName,
            courses,
            meta: {
              requestId,
              anchorId,
              regionComment: regionRes.comment,
              regionTags: regionRes.tags,
            },
          },
        });
      });
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "추천 과정에서 오류가 발생했어요.";
      showAlert(msg);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b to-white overflow-hidden">
      {/* 배경 지도 */}
      <div
        aria-hidden
        style={{ backgroundImage: `url(${MapImage})` }}
        className="pointer-events-none absolute inset-0 bg-no-repeat bg-center bg-cover opacity-40 scale-110 md:scale-125"
      />

      <Header
        title="BukLoad"
        subtitle="현무와 함께 만드는 나만의 경기 북부 여행"
        centered
      />

      {/* 폼 */}
      <form id="planner-form" onSubmit={submit}>
        <main className="relative z-10 mx-auto w-full max-w-md md:max-w-2xl lg:max-w-5xl px-4 pt-3 pb-[160px]">
          {/* 반응형: 모바일 1열, 데스크탑 2열 */}
          <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
            {/* STEP 1 */}
            <StepCard title="STEP 1">
              <label className="block text-[18px] md:text-sm font-medium text-[#8A6B52] mb-1">
                얼마나 떠날까요?
              </label>
              <div className="mb-3">
                <select
                  className="w-full rounded-xl border border-[#E6D9CC] bg-white px-3 py-2 text-[18px] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-[#F4A259]"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  {DURATIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <label className="block text-[18px] md:text-sm font-medium text-[#8A6B52] mb-1">
                어디서 출발할까요?
              </label>
              <input
                className="w-full rounded-xl border border-[#E6D9CC] bg-white placeholder:text-[#B7A9A0] px-3 py-2 text-[18px] mb-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-[#F4A259]"
                placeholder="ex. 의정부역"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
              />

              <label className="block text-[18px] md:text-sm font-medium text-[#8A6B52] mb-2">
                누구와 함께 떠날까요?
              </label>
              <Segmented
                options={["혼자", "친구", "연인", "가족"]}
                value={withWho}
                onChange={(v) => setWithWho(v)}
              />
            </StepCard>

            {/* STEP 2 */}
            <StepCard title="STEP 2" className="lg:mt-0">
              <p className="text-[18px] md:text-sm font-medium text-[#8A6B52] mb-3">
                어떤 여행을 꿈꾸시나요?
              </p>

              {/* 고정 태그 */}
              <div className="flex flex-wrap gap-2 mb-3">
                {TAGS.map((t) => (
                  <Chip key={t} active={selectedTags.includes(t)} onClick={() => toggleTag(t)}>
                    {t}
                  </Chip>
                ))}
                {/* 직접 입력 토글 */}
                <Chip active={customOpen} onClick={() => setCustomOpen((v) => !v)}>
                  직접 입력!
                </Chip>
              </div>

              {/* 직접 입력 UI */}
              {customOpen && (
                <div className="flex items-center gap-2">
                  <input
                    className="flex-1 rounded-xl border border-[#E6D9CC] bg-white px-3 py-2 text-[18px] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-[#F4A259]"
                    placeholder="태그 입력 후 Enter 또는 추가"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomTag();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addCustomTag}
                    className="px-4 py-2 rounded-xl bg-[#F07818] hover:bg-[#e66e12] text-white font-semibold shadow-sm"
                  >
                    추가
                  </button>
                </div>
              )}

              {selectedTags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedTags.map((t) => (
                    <Chip key={`sel-${t}`} active onClick={() => toggleTag(t)}>
                      {t}
                    </Chip>
                  ))}
                </div>
              )}
            </StepCard>

            {/* STEP 3 */}
            <StepCard title="STEP 3" className="lg:col-span-2">
              <label className="block text-[18px] md:text-sm font-medium text-[#8A6B52] mb-1">
                더 바라는 것!
              </label>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-[#E6D9CC] bg-white px-3 py-2 text-[18px] resize-none placeholder:text-[#B7A9A0] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-[#F4A259]"
                placeholder="AI 현무가 꼭 참고했으면 하는 내용을 자유롭게 적어주세요"
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
              />
            </StepCard>
          </div>
        </main>
      </form>

      {/* 하단 고정 CTA */}
      <div
        className="
          fixed
          left-1/2
          -translate-x-1/2
          bottom-[88px] md:bottom-6
          z-50
          w-full
          px-4
        "
      >
        <div className="mx-auto w-full max-w-md md:max-w-2xl lg:max-w-3xl">
          <button
            type="submit"
            form="planner-form"
            disabled={isSubmitting}
            className={`w-full px-5 py-3 text-[20px] rounded-2xl font-extrabold tracking-tight ${
              isSubmitting
                ? "bg-[#FFB878] text-white cursor-not-allowed"
                : "bg-[#FF8400] text-[#FFF4E8]"
            }`}
          >
            {isSubmitting ? "AI가 코스 추천 중…" : "AI로 맞춤 여행 코스 추천받기"}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
