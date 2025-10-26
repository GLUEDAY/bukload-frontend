export default function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-2 text-[18px] border transition
        ${active
          ? "bg-[#FFE5D3] border-[#F3C1A3] text-[#C4682E]"
          : "bg-[#F3F4F6] border-[#E5E7EB] text-[#8A8F98] hover:bg-[#ECEFF3]"}`}
    >
      #{children}
    </button>
  );
}
