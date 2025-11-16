// src/pages/ReceiptPage.jsx
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomNav from "../ui/BottomNav";
import PhotoImage from "../assets/photo.png";
import BackImage from "../assets/back.png";
import { ACCESS_TOKEN_KEY } from "../api/http";
import { useLoading } from "../context/LoadingContext";
import { useAlert } from "../context/AlertContext";

export default function ReceiptProofPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const placeName = location.state?.placeName || "의정부 부대찌개 거리";
  // 서버에서 필요할 수 있는 값 (선택, 지금은 보관만)
  const courseId = location.state?.courseId ?? null;
  const placeId = location.state?.placeId ?? null;

  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { withLoading } = useLoading();
  const { showAlert } = useAlert();

  const handleClickUploadArea = () => {
    fileInputRef.current?.click();
  };

  const handleChangeFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);

    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(f);
  };

  const canSubmit = !!file && !isSubmitting;

  const handleSubmit = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      showAlert("영수증 인증을 하려면 로그인이 필요해요.");
      navigate("/login", { state: { from: "/receipt-proof" } });
      return;
    }

    if (!canSubmit) return;

    try {
      setIsSubmitting(true);

      await withLoading(async () => {
        console.log("영수증 더미 제출:", { file, courseId, placeId });
      });

      showAlert(
        "영수증 인증 기능은 아직 서버 준비 중이에요.\n이미지는 잘 선택되었고, 추후 API가 연결되면 실제로 포인트가 적립될 예정입니다!"
      );
      navigate(-1);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "영수증 인증 중 오류가 발생했어요.";
      showAlert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 헤더 */}
      <header className="bg-white">
        <div className="px-4 pt-3 pb-5 flex items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5"
          >
            <img src={BackImage} alt="뒤로가기" className="w-25 h-25 object-contain" />
          </button>
          <div className="flex-1 text-center font-semibold" />
          <div className="w-8" />
        </div>
      </header>

      {/* 본문 */}
      <main className="flex-1 px-4 pb-24">
        <section className="max-w-[360px] mx-auto">
          <h1 className="text-[32px] font-semibold text-[#313131]">영수증 인증하기</h1>

          {/* 설명 텍스트 */}
          <p className="mt-3 font-medium text-[15px] text-[#7A7A7A]">
            인증할 장소:{" "}
            <span className="font-medium text-[#7A7A7A]">{placeName}</span>
          </p>

          {/* 업로드 박스 */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleClickUploadArea}
              className="w-full h-[370px] border border-dashed border-[#A0A0A0] rounded-[10px] bg-[#F3F3FF] flex flex-col items-center justify-center gap-3"
            >
              {previewUrl ? (
                <div className="w-full h-full overflow-hidden rounded-[12px]">
                  <img
                    src={previewUrl}
                    alt="영수증 미리보기"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-[#F0F0F5] flex items-center justify-center">
                    <img src={PhotoImage} alt="사진" className="w-25 h-25 object-contain" />
                  </div>
                  <p className="text-[18px] font-semibold text-[#313131]">영수증 사진 올리기</p>
                  <p className="text-[12px] text-[#969696]">
                    경기지역화폐로 결제한 영수증을 올려주세요
                  </p>
                </>
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChangeFile}
            />
          </div>

          {/* 포인트 안내 문구 */}
          <p className="mt-6 text-[13px] text-[#969696] leading-relaxed text-center">
            결제 금액의 15%를 <span className="font-semibold">북로드 포인트</span>로 드려요.
            (최대 10,000P)
          </p>
        </section>
      </main>

      {/* 하단 제출 버튼 */}
      <div className="bg-white px-4 py-3">
        <div className="max-w-[360px] mx-auto px-4 pb-[80px]">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full h-[55px] rounded-[10px] text-[18px] font-semibold ${
              canSubmit ? "bg-[#3151C3] text-white" : "bg-[#B7C4F3] text-white/80 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "제출 중..." : "제출하고 포인트 받기"}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
