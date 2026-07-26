import { type ReactNode } from 'react'

import { cn } from '../../lib/shadcn/utils'

type InspectionPageShellProps = {
  children: ReactNode
  className?: string
}

export function InspectionPageShell({ children, className }: InspectionPageShellProps) {
  return (
    <div className="min-h-screen bg-[#3f00ff] text-foreground dark:bg-[#1f2f8f]">
      <div className={cn('relative z-10', className)}>{children}</div>
    </div>
  )
}
