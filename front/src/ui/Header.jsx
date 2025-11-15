import { ChevronLeft } from "lucide-react";
import BackImage from "../assets/back.png";

export default function Header({ title, subtitle, centered = true }) {
  return (
    <header className="relative z-10 px-3 pt-1">
      <div className="relative mx-auto max-w-md flex items-center justify-center">
        {/* 뒤로가기 */}
<button
  type="button"
  onClick={() => history.back()}
  className="absolute left-0  rounded-full hover:bg-black/5"
  aria-label="뒤로가기"
>
  <img
    src={BackImage}
    alt="뒤로가기"
    className="w-8 h-8 object-contain"
  />
</button>


        {/* 타이틀/서브타이틀 */}
        <div className={centered ? "text-center" : ""}>
          <h1 className="text-[35px] leading-7 mt-4 font-extrabold text-[#FF8400]"> {title} </h1>
          {subtitle && <p className="mt-3 text-[16px] text-[#8A6B52]">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
}
