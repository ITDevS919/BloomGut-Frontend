// import * as React from "react"

// import { cn } from "@/lib/utils"

// function Input({ className, type, ...props }: React.ComponentProps<"input">) {
//   return (
//     <input
//       type={type}
//       data-slot="input"
//       className={cn(
//         "file:text-foreground placeholder:text-muted-foreground selection:bg-ivory selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
//         "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
//         "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
//         className
//       )}
//       {...props}
//     />
//   )
// }

// export { Input }

import React, { useState } from "react";

import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(
  ({ className, type = "text", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
      if (type === "number") {
        const value = e.target.value;
        if (value && value >= 0) {
          e.target.value = value;
        } else {
          e.target.value = "";
        }
      }
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className={cn(className, type === "password" ? "relative" : "")}>
        <input
          type={showPassword ? "text" : type}
          className={cn(
            "flex h-12 w-full rounded-lg border border-custome-15 bg-decimal px-3 py-1 text-sm transition-colors file:border-0 file:bg-secondary file:text-sm file:font-medium file:text-custom-12 placeholder:text-custom-12 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            "border-gray-200",
            className
          )}
          ref={ref}
          autoComplete={type === "password" ? "off" : undefined}
          onInput={handleInputChange}
          {...props}
        />
        {type === "password" && (
          <div
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-4 text-custom-12 focus:outline-none cursor-pointer"
          >
            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
