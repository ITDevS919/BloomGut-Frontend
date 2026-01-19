// import * as React from "react"
// import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
// import { CircleIcon } from "lucide-react"

// import { cn } from "@/lib/utils"

// function RadioGroup({
//   className,
//   ...props
// }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
//   return (
//     <RadioGroupPrimitive.Root
//       data-slot="radio-group"
//       className={cn("grid gap-3", className)}
//       {...props}
//     />
//   )
// }

// function RadioGroupItem({
//   className,
//   ...props
// }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
//   return (
//     <RadioGroupPrimitive.Item
//       data-slot="radio-group-item"
//       className={cn(
//         "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
//         className
//       )}
//       {...props}
//     >
//       <RadioGroupPrimitive.Indicator
//         data-slot="radio-group-indicator"
//         className="relative flex items-center justify-center"
//       >
//         <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
//       </RadioGroupPrimitive.Indicator>
//     </RadioGroupPrimitive.Item>
//   )
// }

// export { RadioGroup, RadioGroupItem }

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CircleIcon, CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

const baseClasses =
  "relative transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50"
const variantClasses = {
  default: "border border-input rounded-full size-4 flex items-center justify-center focus-visible:ring-[3px] focus-visible:ring-ring/50",
  checkbox: "border border-input rounded-sm size-4 flex items-center justify-center focus-visible:ring-[3px] focus-visible:ring-ring/50",
  card: "border border-input rounded-md p-3 flex items-center justify-between w-full cursor-pointer data-[state=checked]:border-primary data-[state=checked]:bg-ivory/5",
}

export interface RadioGroupItemProps
  extends React.ComponentProps<typeof RadioGroupPrimitive.Item> {
  variant?: "default" | "checkbox" | "card"
}

export function RadioGroupItem({
  className,
  variant = "default",
  children,
  ...props
}: RadioGroupItemProps) {
  const isCard = variant === "card"
  const isCheckbox = variant === "checkbox"

  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {/* DEFAULT / CHECKBOX indicator */}
      {!isCard && (
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center size-full">
          {isCheckbox ? (
            <CheckIcon className="size-3 text-primary" />
          ) : (
            <CircleIcon className="size-2 fill-primary" />
          )}
        </RadioGroupPrimitive.Indicator>
      )}

      {/* CARD variant children */}
      {isCard && (
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">{children}</div>

          <RadioGroupPrimitive.Indicator>
            <CheckIcon className="size-4 text-primary" />
          </RadioGroupPrimitive.Indicator>
        </div>
      )}
    </RadioGroupPrimitive.Item>
  )
}
