import { ChevronLeft } from "lucide-react";

export default function Header({ title, subtitle, centered = true }) {
  return (
    <header className="relative z-10 px-4 pt-3">
      <div className="relative mx-auto max-w-md flex items-center justify-center">
        {/* 뒤로가기 */}
        <button
          type="button"
          onClick={() => history.back()}
          className="absolute left-0 p-2 rounded-full hover:bg-black/5"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* 타이틀/서브타이틀 */}
        <div className={centered ? "text-center" : ""}>
          <h1 className="text-[35px] leading-7 font-extrabold text-[#F07818]"> {title} </h1>
          {subtitle && <p className="mt-1 text-[16px] text-[#8A6B52]">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
}
