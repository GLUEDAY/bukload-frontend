// src/pages/ReviewRegisterPage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import BottomNav from "../ui/BottomNav";
import PhotoImage from "../assets/photo.png";
import BackImage from "../assets/back.png";

export default function ReviewRegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const placeName =
    location.state?.placeName || "독립 서점 '오래된 미래'";

  const fileInputRef = useRef(null);
  const [previews, setPreviews] = useState([null, null, null]);
  const [activeIndex, setActiveIndex] = useState(null);

  const handleClickBox = (index) => {
    setActiveIndex(index);
    fileInputRef.current?.click();
  };

  const handleChangeFile = (e) => {
    const file = e.target.files?.[0];
    if (!file || activeIndex === null) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreviews((prev) => {
        const next = [...prev];
        next[activeIndex] = reader.result;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 상단 헤더 */}
      <header className="bg-white">
        <div className="px-4 pt-3 pb-5 flex items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5"
          >
             <img
                src={BackImage}
                alt="화살표"
                className="w-25 h-25 object-contain"
              />
          </button>
          <div className="w-8" />
        </div>
      </header>

      {/* 본문 */}
      <main className="flex-1 px-4 pb-24">
        <section className="max-w-[360px] mx-auto">
            <h1 className="text-[32px] font-semibold text-[#313131]">
              후기 등록하기
            </h1>
          {/* 설명 텍스트 */}
          <p className="mt-3 font-medium text-[15px] text-[#7A7A7A]">
            다녀온 장소:{" "}
            <span className="font-semibold text-[#7A7A7A]">
              {placeName}
            </span>
          </p>

          {/* 사진 업로드 3칸 */}
          <div className="mt-16 flex gap-3">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleClickBox(idx)}
                className="flex-1 h-[150px] border border-dashed border-[#A0A0A0] rounded-[8px] bg-[#FFFAF5] flex items-center justify-center"
              >
                {previews[idx] ? (
                  <img
                    src={previews[idx]}
                    alt="사진 미리보기"
                    className="w-full h-full object-cover rounded-[10px]"
                  />
                ) : idx === 2 ? (
                  <span className="text-6xl text-[#D0D0D0]">+</span>
                ) : (
                   <img
                      src={PhotoImage}
                        alt="포토"
                        className="w-10 h-10 object-contain"
                   />
                )}
              </button>
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

          {/* 사진 올려달라는 문구 */}
          <p className="mt-2 text-[13px] text-[#969696]">
            사진을 올려주세요
          </p>

          {/* 후기 텍스트 영역 */}
          <div className="mt-15">
            <textarea
              className="w-full h-[200px] border-[1px] border-[#A0A0A0] rounded-[10px] bg-[#FFFAF5] p-3 text-[13px] text-[#555555] placeholder:text-[#969696] resize-none"
              placeholder="후기를 작성해주세요 (+500P)"
            />
          </div>
        </section>
      </main>

      {/* 하단 제출 버튼 */}
      <div className="bg-white px-4 py-3 ">
        <div className="max-w-[360px] mx-auto flex-1 overflow-y-auto px-4 pb-[100px]">
          <button
            type="button"
            className="w-full h-[55px] rounded-[10px] bg-[#FF8400] text-white text-[20px] font-semibold"
          >
            제출하고 포인트 받기
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
