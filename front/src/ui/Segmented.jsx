export default function Segmented({ options = [], value, onChange }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-lg px-3 py-2 text-[18px] border transition
              ${active
                ? "bg-[#FF840078] text-[#974E00] border-white"
                : "bg-white text-[#974E00] border-white"}`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
