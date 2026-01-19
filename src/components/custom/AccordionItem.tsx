import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

export const AccordionItem = ({
  title,
  options,
  showTextarea,
}: {
  title: string;
  options?: { label: string; value: string }[];
  showTextarea?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [otherText, setOtherText] = useState("");

  useEffect(() => {
    // initialize selected state
    const init: Record<string, boolean> = {};
    (options || []).forEach((o) => (init[o.value] = false));
    setSelected(init);
  }, [options]);

  const toggle = (val: string) => {
    setSelected((s) => ({ ...s, [val]: !s[val] }));
  };

  const onOtherChange = (v: string) => {
    // remove symbols, allow letters, numbers and spaces only
    const filtered = v.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 20);
    setOtherText(filtered);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden"
      style={{ border: "1px solid rgba(0,0,0,0.03)" }}
    >
      <button
        className="w-full flex items-center justify-between p-4"
        onClick={() => setOpen(!open)}
        type="button"
        aria-expanded={open}
      >
        <span className="text-base text-primary">{title}</span>
        <IoIosArrowDown
          className="text-primary"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 180ms",
          }}
          size={20}
        />
      </button>

      {open && (
        <div className="p-4 pt-0">
          <div className="flex flex-wrap gap-4 items-center">
            {(options || []).map((opt) => (
              <div key={opt.value} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggle(opt.value)}
                  aria-pressed={!!selected[opt.value]}
                  className="flex items-center justify-center"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    border: `2px solid ${selected[opt.value] ? "#f6a02a" : "#cfcfcf"}`,
                    background: selected[opt.value] ? "#fff6e8" : "#fff",
                    boxShadow: selected[opt.value] ? "inset 0 0 0 2px rgba(246,160,42,0.05)" : "none",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  {selected[opt.value] ? (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L4 8L11 1" stroke="#f6a02a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : null}
                </button>
                <span className="select-none text-sm text-primary">{opt.label}</span>
              </div>
            ))}

            {showTextarea && (
              <div className="w-full mt-4">
                <textarea
                  value={otherText}
                  onChange={(e) => onOtherChange(e.target.value)}
                  placeholder="Describe other symptoms (e.g., night)\nMax 20 characters, no symbols"
                  className="w-full p-4 border rounded-md"
                  rows={3}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
