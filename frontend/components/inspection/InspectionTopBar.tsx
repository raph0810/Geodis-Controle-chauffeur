import { ArrowLeft, ClipboardList, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '../../lib/shadcn/button'

type InspectionTopBarProps = {
  title: string
  backTo?: string
  backLabel?: string
}

export function InspectionTopBar({
  title,
  backTo = '/',
  backLabel = "Retour à l'accueil",
}: InspectionTopBarProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 pt-6 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/95 p-4 text-card-foreground shadow-sm backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Application de contrôle</div>
            <div className="text-lg font-semibold">{title}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild type="button" variant="outline">
            <Link to="/">
              <Home className="h-4 w-4" />
              Accueil
            </Link>
          </Button>
          {backTo !== '/' ? (
            <Button asChild type="button" variant="ghost">
              <Link to={backTo}>
                <ArrowLeft className="h-4 w-4" />
                {backLabel}
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
