import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import clsx from "clsx";

type CheckboxProps = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> & {
  label?: string;
};

export const CustomCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, ...props }, ref) => {
  return (
    <label className="inline-flex items-center gap-1.75 cursor-pointer">
      <CheckboxPrimitive.Root
        ref={ref}
        className={clsx(
          "h-5.5 w-5 rounded border border-custom-12 bg-white",
          "flex items-center justify-center",
          "data-[state=checked]:bg-white data-[state=checked]:border-custom-12",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator>
          <Check className="h-4 w-4 text-custom-5" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      {label && (
        <span className="text-sm text-custom-2 font-medium font-roboto">
          {label}
        </span>
      )}
    </label>
  );
});

CustomCheckbox.displayName = "CustomCheckbox";
