import { type ReactNode } from 'react'
import { AlertTriangle, CircleDot, type LucideIcon } from 'lucide-react'

import { type CheckValue, type DocumentPresence } from '../../utils/driverInspection'
import { Badge } from '../../lib/shadcn/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../lib/shadcn/card'
import { Input } from '../../lib/shadcn/input'
import { Label } from '../../lib/shadcn/label'
import { RadioGroup, RadioGroupItem } from '../../lib/shadcn/radio-group'

const radioCardClassName =
  'rounded-md border border-border bg-background px-3 py-2 transition-colors hover:bg-accent/50'

type SectionCardProps = {
  title: string
  description: string
  icon: LucideIcon
  children: ReactNode
}

export function SectionCard({ title, description, icon: Icon, children }: SectionCardProps) {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

type StatusFieldProps = {
  fieldId: string
  label: string
  value: CheckValue
  onChange: (value: CheckValue) => void
  yesLabel?: string
  noLabel?: string
  helpText?: string
  alertWhen?: 'yes' | 'no'
  alertText?: string
}

export function StatusField({
  fieldId,
  label,
  value,
  onChange,
  yesLabel = 'Oui',
  noLabel = 'Non',
  helpText,
  alertWhen,
  alertText,
}: StatusFieldProps) {
  const showAlert = Boolean(alertText) && Boolean(alertWhen) && value === alertWhen

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <div className="space-y-1">
        <Label className="text-sm font-semibold text-foreground" htmlFor={fieldId}>
          {label}
        </Label>
        {helpText ? <p className="text-sm text-muted-foreground">{helpText}</p> : null}
      </div>

      <RadioGroup
        id={fieldId}
        className="grid gap-2 sm:grid-cols-2"
        onValueChange={(nextValue) => onChange(nextValue as CheckValue)}
        value={value}
      >
        <label className={radioCardClassName} htmlFor={`${fieldId}-yes`}>
          <div className="flex items-center gap-2">
            <RadioGroupItem id={`${fieldId}-yes`} value="yes" />
            <span className="text-sm text-foreground">{yesLabel}</span>
          </div>
        </label>
        <label className={radioCardClassName} htmlFor={`${fieldId}-no`}>
          <div className="flex items-center gap-2">
            <RadioGroupItem id={`${fieldId}-no`} value="no" />
            <span className="text-sm text-foreground">{noLabel}</span>
          </div>
        </label>
      </RadioGroup>

      {showAlert && alertText ? (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <span>{alertText}</span>
        </div>
      ) : null}
    </div>
  )
}

type DocumentFieldProps = {
  fieldId: string
  label: string
  presence: DocumentPresence
  expiryDate: string
  isExpired: boolean
  hasExpiryDate: boolean
  onPresenceChange: (value: DocumentPresence) => void
  onDateChange: (value: string) => void
}

export function DocumentField({
  fieldId,
  label,
  presence,
  expiryDate,
  isExpired,
  hasExpiryDate,
  onPresenceChange,
  onDateChange,
}: DocumentFieldProps) {
  const showExpired = isExpired
  const showMissing = presence === 'missing'
  const showDateReminder = hasExpiryDate && expiryDate.length === 0

  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <Label className="text-sm font-semibold text-foreground" htmlFor={fieldId}>
          {label}
        </Label>
        <div className="flex flex-wrap gap-2">
          {showMissing ? <Badge variant="warning">Non présenté</Badge> : null}
          {showExpired ? <Badge variant="destructive">Date expirée</Badge> : null}
          {showDateReminder ? <Badge variant="warning">Date à renseigner</Badge> : null}
          {hasExpiryDate && presence === 'present' && !showExpired && expiryDate.length > 0 ? (
            <Badge variant="success">Valide</Badge>
          ) : null}
          {!hasExpiryDate && presence === 'present' ? <Badge variant="success">Présent</Badge> : null}
        </div>
      </div>

      <RadioGroup
        className="grid gap-2 sm:grid-cols-2"
        onValueChange={(nextValue) => onPresenceChange(nextValue as DocumentPresence)}
        value={presence}
      >
        <label className={radioCardClassName} htmlFor={`${fieldId}-present`}>
          <div className="flex items-center gap-2">
            <RadioGroupItem id={`${fieldId}-present`} value="present" />
            <span className="text-sm text-foreground">Présent</span>
          </div>
        </label>
        <label className={radioCardClassName} htmlFor={`${fieldId}-missing`}>
          <div className="flex items-center gap-2">
            <RadioGroupItem id={`${fieldId}-missing`} value="missing" />
            <span className="text-sm text-foreground">Non présenté</span>
          </div>
        </label>
      </RadioGroup>

      {hasExpiryDate ? (
        <div className="grid gap-2">
          <Label htmlFor={`${fieldId}-expiry`}>Date de validité</Label>
          <Input
            id={`${fieldId}-expiry`}
            onChange={(event) => onDateChange(event.target.value)}
            type="date"
            value={expiryDate}
          />
        </div>
      ) : null}
    </div>
  )
}

type SummaryItemProps = {
  children: ReactNode
}

export function SummaryItem({ children }: SummaryItemProps) {
  return (
    <div className="flex items-start gap-2 text-sm text-body-foreground">
      <CircleDot className="mt-0.5 h-4 w-4 text-muted-foreground" />
      <span>{children}</span>
    </div>
  )
}
