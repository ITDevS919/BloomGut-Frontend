import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { IconType } from "react-icons";

const customButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] font-medium cursor-pointer transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border border-[#bdbdbd] bg-transparent hover:bg-accent shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-secondary font-medium font-roboto",
        ghost: "bg-transparent hover:bg-accent",
        link: "bg-transparent underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-6 w-6 px-2 text-xs",
        sm: "h-8 px-3 text-sm",
        md: "h-9 px-4 text-base",
        lg: "h-10 w-10 text-lg",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

const ICON_SIZE_MAP = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  icon: 20,
} as const;

export interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof customButtonVariants> {
  asChild?: boolean;

  icon?: IconType;
  iconPosition?: "left" | "right";
  iconSize?: number;

  textColor?: string;
  bgColor?: string;
  borderColor?: string;
  fontSize?: string;

  /** Loading */
  isLoading?: boolean;
  showLoader?: boolean;
  loadingText?: string;
}

export const CustomButton = React.forwardRef<
  HTMLButtonElement,
  CustomButtonProps
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      icon,
      iconPosition = "left",
      iconSize,
      textColor,
      bgColor,
      borderColor,
      fontSize,
      isLoading = false,
      showLoader = true,
      loadingText,
      children,
      style,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || isLoading;
    const Icon = icon;

    const resolvedIconSize = iconSize ?? ICON_SIZE_MAP[size];

    return (
      <Comp
        ref={ref}
        disabled={!asChild && isDisabled}
        aria-disabled={isDisabled}
        className={cn(customButtonVariants({ variant, size }), className)}
        style={{
          color: textColor,
          backgroundColor: bgColor,
          borderColor,
          fontSize,
          ...style,
        }}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            {showLoader && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {loadingText ?? children}
          </span>
        ) : (
          <>
            {Icon && iconPosition === "left" && (
              <Icon size={resolvedIconSize} className="shrink-0" />
            )}

            {children && <span className="font-roboto">{children}</span>}

            {Icon && iconPosition === "right" && (
              <Icon size={resolvedIconSize} className="shrink-0" />
            )}
          </>
        )}
      </Comp>
    );
  }
);

CustomButton.displayName = "CustomButton";

export { customButtonVariants };
