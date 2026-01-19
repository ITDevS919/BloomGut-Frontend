import * as React from "react";
import { cn } from "@/lib/utils";

export interface CustomHeadingProps {
  label: React.ReactNode;
  isRequired?: boolean;
  className?: string;
  labelClassName?: string;
  requiredTextClassName?: string;
  requiredText?: string;
}

const CustomHeading: React.FC<CustomHeadingProps> = ({
  label,
  isRequired = false,
  className,
  labelClassName,
  requiredTextClassName,
  requiredText = "Required",
}) => {
  return (
    <div className={cn("flex gap-1 items-end", className)}>
      <span
        className={cn(
          "text-primary text-base font-medium tracking-[1px] leading-5.25 capitalize font-base",
          labelClassName
        )}
      >
        {label}
      </span>

      {isRequired && (
        <span
          className={cn(
            "text-custom-12 font-normal italic leading-3.5 text-[12px] font-roboto",
            requiredTextClassName
          )}
        >
          {requiredText}
        </span>
      )}
    </div>
  );
};

export default CustomHeading;
