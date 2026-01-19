import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type RadioVariant = "default" | "card";

export interface CustomRadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  variant?: RadioVariant;
  className?: string;
}

export interface CustomRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label: React.ReactNode;
  description?: React.ReactNode;
  variant?: RadioVariant;
  className?: string;
}

export const CustomRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  CustomRadioGroupProps
>(({ className, variant = "default", ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      className={cn("grid gap-3", variant === "card" && "gap-4", className)}
      {...props}
    />
  );
});

CustomRadioGroup.displayName = "CustomRadioGroup";

export const CustomRadioItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  CustomRadioItemProps
>(({ label, description, variant = "default", className, ...props }, ref) => {
  const isCard = variant === "card";

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "relative outline-none disabled:opacity-50 disabled:cursor-not-allowed",
        isCard
          ? "flex items-center justify-between w-full shodow-sm rounded-lg bg-white p-4 shadow-md data-[state=checked]:border data-[state=checked]:border-primary-muted"
          : "flex items-center gap-3",
        className
      )}
      {...props}
    >
      {/* LEFT CONTENT */}
      <div className="flex items-start gap-3">
        {/* RADIO CIRCLE */}
        {!isCard && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full border border-input">
            <RadioGroupPrimitive.Indicator>
              <CircleIcon className="h-2.5 w-2.5 fill-primary" />
            </RadioGroupPrimitive.Indicator>
          </span>
        )}

        {/* TEXT */}
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-sm font-medium text-primary">{label}</span>

          {description && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
        </div>
      </div>

      {/* RIGHT CHECK ICON (CARD) */}
      {/* {isCard && (
        <RadioGroupPrimitive.Indicator>
          <CheckIcon className="h-5 w-5 text-primary" />
        </RadioGroupPrimitive.Indicator>
      )} */}
    </RadioGroupPrimitive.Item>
  );
});

CustomRadioItem.displayName = "CustomRadioItem";
