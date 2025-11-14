// src/pages/ReviewRegisterPage.jsx
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRef, useState, useMemo } from "react";
import BottomNav from "../ui/BottomNav";
import PhotoImage from "../assets/photo.png";
import BackImage from "../assets/back.png";
import { useCreateReview } from "../hook/useReviews";

// 🔗 공통 로딩 / 알럿 컨텍스트
import { useLoading } from "@/context/LoadingContext";
import { useAlert } from "@/context/AlertContext";

export default function ReviewRegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId: cidParam, placeId: pidParam } = useParams();

  const { withLoading } = useLoading();
  const { showAlert } = useAlert();

  // 코스/장소 식별자: URL 파라미터 우선, 없으면 state
  const courseId = useMemo(
    () => cidParam ?? location.state?.courseId ?? null,
    [cidParam, location.state]
  );
  const placeId = useMemo(
    () => pidParam ?? location.state?.placeId ?? null,
    [pidParam, location.state]
  );

  const placeName = location.state?.placeName || "독립 서점 '오래된 미래'";

  const fileInputRef = useRef(null);
  const [previews, setPreviews] = useState([null, null, null]); // dataURL
  const [activeIndex, setActiveIndex] = useState(null);
  const [content, setContent] = useState("");

  const createReview = useCreateReview();
  const isSubmitting = createReview.isPending;

  const handleClickBox = (index) => {
    setActiveIndex(index);
    fileInputRef.current?.click();
  };

  const handleChangeFile = (e) => {
    const file = e.target.files?.[0];
    if (!file || activeIndex === null) return;

    if (file.size > 5 * 1024 * 1024) {
      showAlert("이미지 용량이 5MB를 초과합니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviews((prev) => {
        const next = [...prev];
        next[activeIndex] = reader.result; // dataURL
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const canSubmit = !!content.trim() && !isSubmitting && !!courseId && !!placeId;

  const handleSubmit = async () => {
    if (!canSubmit) {
      if (!courseId || !placeId) {
        showAlert("코스/장소 정보가 없어 후기를 보낼 수 없어요.");
      }
      return;
    }
    try {
      await withLoading(async () => {
        await createReview.mutateAsync({
          courseId: String(courseId),
          placeId: String(placeId),
          content: content.trim(),
          photoUrl: previews[0] || null,
        });
      });
      showAlert("후기가 등록되었어요! (+500P)");
      navigate(-1);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "후기 등록 중 오류가 발생했어요.";
      showAlert(msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 상단 헤더 */}
      <header className="bg-white">
        <div className="px-4 sm:px-6 lg:px-8 pt-3 pb-5 flex items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5"
          >
            <img src={BackImage} alt="뒤로가기" className="w-25 h-25 sm:w-6 sm:h-6 object-contain" />
          </button>
          <div className="flex-1" />
        </div>
      </header>

       {/* 본문 */}
      <main className="flex-1 px-4 pb-24">
        <section className="max-w-[360px] mx-auto">
          <h1 className="text-[32px] font-semibold text-[#313131]">후기 등록하기</h1>

          {/* 설명 텍스트 */}
          <p className="mt-3 font-medium text-[15px] text-[#7A7A7A]">
            다녀온 장소:{" "}
            <span className="font-medium text-[#7A7A7A]">{placeName}</span>
          </p>

          {/* 사진 업로드 3칸 */}
          <div className="mt-12 flex gap-3">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="flex-1">
                <button
                  type="button"
                  onClick={() => handleClickBox(idx)}
                  className="w-full h-[150px] sm:h-[150px] md:h-[160px] border border-dashed border-[#A0A0A0] rounded-[8px] bg-[#FFFAF5] flex items-center justify-center overflow-hidden"
                >
                  {previews[idx] ? (
                    <img
                      src={previews[idx]}
                      alt="사진 미리보기"
                      className="w-full h-full object-cover rounded-[10px]"
                    />
                  ) : idx === 2 ? (
                    <span className="text-5xl sm:text-6xl text-[#D0D0D0]">+</span>
                  ) : (
                    <img src={PhotoImage} alt="포토" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                  )}
                </button>
                {previews[idx] && (
                  <button
                    type="button"
                    onClick={() =>
                      setPreviews((prev) => {
                        const next = [...prev];
                        next[idx] = null;
                        return next;
                      })
                    }
                    className="mt-2 w-full text-xs text-[#969696] underline"
                  >
                    이 사진 빼기
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* 숨겨진 input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChangeFile}
          />

          {/* 사진 안내 */}
          <p className="mt-3 text-[12px] sm:text-[13px] text-[#969696]">사진을 올려주세요</p>

          {/* 후기 텍스트 영역 */}
          <div className="mt-12">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-40 sm:h-48 md:h-52 border border-[#A0A0A0] rounded-[10px] bg-[#FFFAF5] p-3 text-[13px] text-[#555555] placeholder:text-[#969696] resize-none"
              placeholder="후기를 작성해주세요 (+500P)"
            />
            {!courseId || !placeId ? (
              <p className="mt-2 text-xs text-red-500">
                코스/장소 정보가 없어 제출할 수 없어요. 상세 페이지에서 후기 버튼으로 들어와 주세요.
              </p>
            ) : null}
          </div>
        </section>
      </main>

      {/* 하단 제출 버튼 */}
      <footer className="bg-white px-4 sm:px-6 lg:px-8 py-3 mb-[96px]">
        <div className="max-w-sm sm:max-w-md md:max-w-lg mx-auto">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full h-[50px] sm:h-[55px] rounded-[10px] text-base sm:text-[18px] font-semibold ${
              canSubmit ? "bg-[#FF8400] text-white" : "bg-[#FFD3A8] text-white/80 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "제출 중..." : "제출하고 포인트 받기"}
          </button>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
}
