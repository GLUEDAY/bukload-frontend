export default function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-2 text-[18px] border transition
        ${active
          ? "bg-[#FFE5D3] border-[#F3C1A3] text-[#C4682E]"
          : "bg-[#FFFFFF] border-[#E5E7EB] text-[#B2B2B2] hover:bg-[#ECEFF3]"}`}
    >
      #{children}
    </button>
  );
}
