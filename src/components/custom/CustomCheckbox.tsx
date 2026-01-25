import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import clsx from "clsx";

type CheckboxProps = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> & {
  label?: string;
  borderColor?: string;
  checkColor?: string;
};

export const CustomCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, borderColor, checkColor, style, ...props }, ref) => {
  const uniqueId = React.useMemo(() => 
    borderColor ? `checkbox-border-${borderColor.replace('#', '')}` : null,
    [borderColor]
  );

  const checkboxStyle = React.useMemo(() => {
    const baseStyle = style || {};
    const defaultStyle = {
      borderWidth: "1px",
      borderColor: "#705d56",
      ...baseStyle,
    };
    if (borderColor) {
      return {
        ...defaultStyle,
        borderColor: "#705d56", // Default border color when unchecked
      };
    }
    return defaultStyle;
  }, [borderColor, style]);

  const checkStyle = checkColor ? { color: checkColor } : { color: "#b3a2d0" };
  
  return (
    <>
      {borderColor && uniqueId && (
        <style dangerouslySetInnerHTML={{
          __html: `
            .${uniqueId} {
              border-width: 1px;
              border-color: #705d56;
            }
            .${uniqueId}[data-state="checked"] {
              border-color: ${borderColor} !important;
            }
          `
        }} />
      )}
      <label className="inline-flex items-center gap-1.75 cursor-pointer">
        <CheckboxPrimitive.Root
          ref={ref}
          className={clsx(
            "h-5.5 w-5 rounded border bg-white",
            borderColor ? uniqueId || "" : "",
            "flex items-center justify-center",
            borderColor ? "" : "data-[state=checked]:bg-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            className
          )}
          style={checkboxStyle}
          {...props}
        >
          <CheckboxPrimitive.Indicator>
            <Check 
              className="h-4 w-4" 
              style={checkStyle}
            />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        {label && (
          <span className="text-xs text-custom-2 font-roboto">
            {label}
          </span>
        )}
      </label>
    </>
  );
});

CustomCheckbox.displayName = "CustomCheckbox";
