import { useState } from 'react';
import Header from '../ui/Header';
import StepCard from '../ui/StepCard';
import Segmented from '../ui/Segmented';
import Chip from '../ui/Chip';
import BottomNav from '../ui/BottomNav';

const DURATIONS = ['당일치기', '1박 2일', '2박 3일', '3박 4일'];
const TAGS = [
  '휴식 #힐링',
  '맛집 #로컬푸드',
  '포토 #인생샷',
  '액티비티 #도전',
  '문화 #전시',
  '쇼핑',
];

export default function PlannerPage() {
  const [duration, setDuration] = useState('1박 2일');
  const [departure, setDeparture] = useState('');
  const [withWho, setWithWho] = useState('연인');
  const [selectedTags, setSelectedTags] = useState([]);
  const [freeText, setFreeText] = useState('');

  // STEP2 직접입력
  const [customOpen, setCustomOpen] = useState(false);
  const [customText, setCustomText] = useState('');

  const toggleTag = (t) =>
    setSelectedTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const addCustomTag = () => {
    const t = customText.trim();
    if (!t) return;
    if (!selectedTags.includes(t)) setSelectedTags((prev) => [...prev, t]);
    setCustomText('');
  };

  const submit = (e) => {
    e.preventDefault();
    console.log({ duration, departure, withWho, selectedTags, freeText });
    alert('제출 테스트 ✅ 콘솔 확인!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF2E6] to-white relative">
      {/* 배경 지도: 데스크탑에서 조금 더 강조 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 lg:opacity-40 bg-[url('/map-placeholder.png')] bg-center bg-no-repeat bg-contain"
      />

      <Header
        title="BukLoad"
        subtitle="현무와 함께 만드는 나만의 경기 북부 여행"
        centered
      />

      {/* 폼: id를 부여해서 고정 CTA와 연결 */}
      <form id="planner-form" onSubmit={submit}>
        {/* 하단 고정 CTA/탭에 가리지 않게 여백 확보 */}
        <main className="relative z-10 mx-auto px-4 pt-3 pb-[160px] max-w-md md:max-w-2xl lg:max-w-5xl">
          {/* ✅ 반응형: 모바일 1열, 데스크탑 2열 */}
          <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
            {/* 좌측 컬럼: STEP 1 */}
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
                options={['혼자', '친구', '연인', '가족']}
                value={withWho}
                onChange={(v) => setWithWho(v)}
              />
            </StepCard>

            {/* 우측 컬럼: STEP 2 */}
            <StepCard title="STEP 2" className="lg:mt-0">
              <p className="text-[18px] md:text-sm font-medium text-[#8A6B52] mb-3">
                어떤 여행을 꿈꾸시나요?
              </p>

              {/* 고정 태그 */}
              <div className="flex flex-wrap gap-2 mb-3">
                {TAGS.map((t) => (
                  <Chip
                    key={t}
                    active={selectedTags.includes(t)}
                    onClick={() => toggleTag(t)}
                  >
                    {t}
                  </Chip>
                ))}
                {/* 직접 입력 토글 */}
                <Chip
                  active={customOpen}
                  onClick={() => setCustomOpen((v) => !v)}
                >
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
                      if (e.key === 'Enter') {
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

            {/* STEP 3: 데스크탑에선 전체 폭 차지 */}
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

      {/* ✅ 하단 고정 CTA: 모바일은 바텀탭 위로, 데스크탑은 화면 하단 여유 */}
      <div className="fixed inset-x-0 z-50 px-4 bottom-[88px] md:bottom-6">
        <div className="mx-auto max-w-md md:max-w-2xl lg:max-w-5xl">
          <button
            type="submit"
            form="planner-form"
            className="w-full px-5 py-3 text-[20px] rounded-2xl bg-[#F07818] text-white font-extrabold tracking-tight"
          >
            AI로 맞춤 여행 코스 추천받기
          </button>
        </div>
      </div>

      {/* 모바일 전용 하단 탭 */}
      <BottomNav />
    </div>
  );
}
