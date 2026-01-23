import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { CustomCheckbox } from "./CustomCheckbox";

export const DropDownSelectorItem = ({
  title,
  options,
  showTextarea,
  variant = "common",
}: {
  title: string;
  options?: { label: string; value: string }[];
  showTextarea?: boolean;
  variant?: "common" | "special";
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
      <div className="bg-white rounded-[8px] shadow-sm overflow-hidden border border-custom-8">
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
      <div className="mt-5">
        {open && (
          <div className="px-4 pb-4">
            <div className={variant === "special"
              ? "flex flex-col gap-y-3"
              : "grid grid-cols-2 gap-x-4 gap-y-3"
            }>
              {(options || []).map((opt) => (
                <div key={opt.value} className="flex items-center">
                  <CustomCheckbox
                    label={opt.label}
                    value={opt.value}
                    checked={selected[opt.value] || false}
                    onCheckedChange={() => toggle(opt.value)}
                    borderColor="#79b6e2"
                    checkColor="#79b6e2"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
