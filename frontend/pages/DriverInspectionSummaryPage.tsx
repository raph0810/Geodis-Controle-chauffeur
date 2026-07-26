import { Ban, ClipboardList, FileWarning, Truck, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import {
  type InspectionFormState,
  getAttentionPoints,
  getBlockingReasons,
  getControllerRoleLabel,
} from '../utils/driverInspection'
import { SummaryItem } from '../components/inspection/InspectionFields'
import { InspectionPageShell } from '../components/inspection/InspectionPageShell'
import { InspectionTopBar } from '../components/inspection/InspectionTopBar'
import { Badge } from '../lib/shadcn/badge'
import { Button } from '../lib/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../lib/shadcn/card'
import { Separator } from '../lib/shadcn/separator'

type DriverInspectionSummaryPageProps = {
  form: InspectionFormState
  pendingCount: number
  missingRequiredInfoCount: number
}

export default function DriverInspectionSummaryPage({
  form,
  pendingCount,
  missingRequiredInfoCount,
}: DriverInspectionSummaryPageProps) {
  const navigate = useNavigate()
  const blockingReasons = getBlockingReasons(form)
  const attentionPoints = getAttentionPoints(form)
  const isVehicleBlocked = blockingReasons.length > 0

  return (
    <InspectionPageShell>
      <InspectionTopBar backTo="/formulaire" backLabel="Retour au formulaire" title="Synthèse du contrôle" />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 lg:px-6">
        <Card>
          <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={isVehicleBlocked ? 'destructive' : 'success'}>
                  {isVehicleBlocked ? 'Véhicule bloqué' : 'Véhicule non bloqué'}
                </Badge>
                <Badge variant="secondary">Synthèse du contrôle</Badge>
              </div>
              <CardTitle className="text-3xl">Synthèse du contrôle chauffeur</CardTitle>
              <CardDescription>
                Consultez les motifs de blocage, les points d'attention et l'avancement du contrôle.
              </CardDescription>
            </div>
            <Button onClick={() => navigate('/formulaire')} type="button" variant="outline">
              Retour au formulaire
            </Button>
          </CardHeader>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">Blocages</div>
              <div className="mt-2 text-3xl font-semibold">{blockingReasons.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">Points d'attention</div>
              <div className="mt-2 text-3xl font-semibold">{attentionPoints.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">Éléments restants</div>
              <div className="mt-2 text-3xl font-semibold">{pendingCount + missingRequiredInfoCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <UserRound className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-xl">Informations principales</CardTitle>
                <CardDescription>Identité du contrôleur, du conducteur et de la tournée.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-sm text-muted-foreground">Poste du contrôleur</div>
              <div className="font-medium">
                {form.controllerRole === 'autre'
                  ? form.controllerRoleDescription.trim() || 'Autre'
                  : getControllerRoleLabel(form.controllerRole)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Contrôleur</div>
              <div className="font-medium">{form.controllerName || 'Non renseigné'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Date</div>
              <div className="font-medium">{form.tourDate || 'Non renseignée'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Numéro de tournée</div>
              <div className="font-medium">{form.tourNumber || 'Non renseigné'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Immatriculation</div>
              <div className="font-medium">{form.vehiclePlate || 'Non renseignée'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Conducteur</div>
              <div className="font-medium">
                {[form.driverFirstName, form.driverLastName].filter((value) => value.trim().length > 0).join(' ') ||
                  'Non renseigné'}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Sous-traitant</div>
              <div className="font-medium">{form.subcontractorName || 'Non renseigné'}</div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Ban className={`h-5 w-5 ${isVehicleBlocked ? 'text-destructive' : 'text-muted-foreground'}`} />
                <div>
                  <CardTitle className="text-xl">Motifs de blocage</CardTitle>
                  <CardDescription>Les éléments empêchant la mise en circulation.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {blockingReasons.length > 0 ? (
                blockingReasons.map((reason) => <SummaryItem key={reason}>{reason}</SummaryItem>)
              ) : (
                <p className="text-sm text-muted-foreground">Aucun motif de blocage détecté.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileWarning className="h-5 w-5 text-amber-500" />
                <div>
                  <CardTitle className="text-xl">Points d'attention</CardTitle>
                  <CardDescription>Les anomalies non bloquantes ou informations à compléter.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {attentionPoints.length > 0 ? (
                attentionPoints.map((point) => <SummaryItem key={point}>{point}</SummaryItem>)
              ) : (
                <p className="text-sm text-muted-foreground">Aucun point d'attention complémentaire.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-xl">Statut final</CardTitle>
                <CardDescription>Décision rapide sur le départ du véhicule.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
              <div>
                <div className="text-sm text-muted-foreground">Décision</div>
                <div className="text-lg font-semibold">
                  {isVehicleBlocked ? 'Véhicule bloqué' : 'Véhicule autorisé au départ'}
                </div>
              </div>
              <Badge variant={isVehicleBlocked ? 'destructive' : 'success'}>
                {isVehicleBlocked ? 'Bloqué' : 'Autorisé'}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">Anomalies colis</span>
              </div>
              <p className="whitespace-pre-wrap text-sm text-foreground">
                {form.parcelAnomaliesNotes.trim().length > 0
                  ? form.parcelAnomaliesNotes
                  : 'Aucune anomalie colis renseignée.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </InspectionPageShell>
  )
}