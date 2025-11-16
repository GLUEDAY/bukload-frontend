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

            className={`rounded-lg px-3 py-2 text-[18px] border transition ${
              active
                ? "bg-[#F07818] text-white border-[#F07818] shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
                : "bg-white text-[#6B7280] border-white"
            }`}

          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
