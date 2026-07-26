import * as React from "react"
import { cn } from "./utils"

const Select = ({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select className={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm", className)} {...props} />
)
const SelectTrigger = Select
const SelectValue = ({ children }: { children?: React.ReactNode }) => <>{children}</>
const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>
const SelectItem = ({ value, children, ...props }: React.OptionHTMLAttributes<HTMLOptionElement>) => (
  <option value={value} {...props}>{children}</option>
)

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }