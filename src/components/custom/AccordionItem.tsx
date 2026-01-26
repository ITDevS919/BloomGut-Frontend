import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { CustomCheckbox } from "./CustomCheckbox";

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
    <>
      <style>{`
        textarea:focus {
          border-color: grey !important;
          outline: none !important;
        }
      `}</style>
      <div
        className="bg-white rounded-[8px] shadow-sm overflow-hidden border border-custom-8"
      >
        <button
          className="w-full flex items-center justify-between p-4 cursor-pointer"
          onClick={() => setOpen(!open)}
          type="button"
          aria-expanded={open}
        >
          <span className="text-sm text-secondary">{title}</span>
          <IoIosArrowDown
            className="text-secondary"
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 180ms",
            }}
            size={20}
          />
        </button>
      </div>

      {
        open && (
          <div className="pt-0">
            <div className="flex flex-wrap gap-4 items-center">
              {(options || []).map((opt) => (
                <div key={opt.value} className="flex items-center gap-3 ml-[20px]">
                  <CustomCheckbox
                    label={opt.label}
                    value={opt.value}
                    onChange={(e) => toggle(opt.value)}
                  />
                </div>
              ))}

              {showTextarea && (
                <div className="w-full">
                  <textarea
                    value={otherText}
                    onChange={(e) => onOtherChange(e.target.value)}
                    placeholder="Describe other symptoms (e.g., night)Max 20 characters, no symbols"
                    className="w-full min-h-[48px] text-sm text-secondary rounded-[8px] p-3 mb-[13px] placeholder:text-custom-12 placeholder:font-medium cursor-pointer focus:outline-none"
                    style={{
                      backgroundColor: 'white',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: 'grey',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'grey';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'grey';
                    }}
                    rows={3}
                  />
                  <p className="text-xs text-[#9e9e9e] font-medium flex items-center justify-center">Info for reference only; consult doctor if unsure</p>
                </div>
              )}
            </div>
          </div>
        )
      }
    </>
  );
};
