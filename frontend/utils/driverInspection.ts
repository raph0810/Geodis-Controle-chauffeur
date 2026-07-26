export type CheckValue = '' | 'yes' | 'no'
export type DocumentPresence = '' | 'present' | 'missing'
export type BadgeIssue = '' | 'lost' | 'broken' | 'not_received'
export type ControllerRole = '' | 'surete' | 'camionnage' | 'autre'
export type DocumentKey =
  | 'licence'
  | 'assurance'
  | 'permis'
  | 'controleTechniqueVehicule'
  | 'controleTechniqueHayon'
  | 'adr'
  | 'critair'
export type EquipmentKey =
  | 'kitSante'
  | 'kitAdr'
  | 'mobicop'
  | 'chasuble'
  | 'chaussuresSecurite'
  | 'gants'
  | 'tenueCorrecte'
  | 'ceintureShintee'
export type SecurityKey = 'rearLock' | 'sideLock' | 'hayonKey'

export type DocumentState = {
  presence: DocumentPresence
  expiryDate: string
}

export type InspectionFormState = {
  controllerRole: ControllerRole
  controllerRoleDescription: string
  controllerName: string
  tourDate: string
  tourNumber: string
  vehiclePlate: string
  driverLastName: string
  driverFirstName: string
  subcontractorName: string
  badgePresent: CheckValue
  badgeIssue: BadgeIssue
  extinguisher: CheckValue
  tiresCondition: CheckValue
  tiresSmooth: CheckValue
  documents: Record<DocumentKey, DocumentState>
  equipment: Record<EquipmentKey, CheckValue>
  security: Record<SecurityKey, CheckValue>
  parcelCheckDone: CheckValue
  parcelAnomalies: CheckValue
  parcelAnomaliesNotes: string
}

export type DocumentDefinition = {
  key: DocumentKey
  label: string
  hasExpiryDate: boolean
  blocksWhenExpired: boolean
}

export const documentDefinitions: ReadonlyArray<DocumentDefinition> = [
  { key: 'licence', label: 'Licence', hasExpiryDate: false, blocksWhenExpired: false },
  { key: 'assurance', label: 'Assurance', hasExpiryDate: true, blocksWhenExpired: true },
  { key: 'permis', label: 'Permis de conduire', hasExpiryDate: false, blocksWhenExpired: false },
  {
    key: 'controleTechniqueVehicule',
    label: 'Contrôle technique du véhicule',
    hasExpiryDate: true,
    blocksWhenExpired: true,
  },
  {
    key: 'controleTechniqueHayon',
    label: 'Contrôle technique du hayon',
    hasExpiryDate: true,
    blocksWhenExpired: true,
  },
  { key: 'adr', label: 'Carte ou attestation ADR', hasExpiryDate: false, blocksWhenExpired: false },
  { key: 'critair', label: "Vignette Crit'Air", hasExpiryDate: true, blocksWhenExpired: false },
]

export const equipmentDefinitions: ReadonlyArray<{ key: EquipmentKey; label: string }> = [
  { key: 'kitSante', label: 'Kit santé' },
  { key: 'kitAdr', label: 'Kit ADR' },
  { key: 'mobicop', label: 'MOBICOP' },
  { key: 'chasuble', label: 'Chasuble' },
  { key: 'chaussuresSecurite', label: 'Chaussures de sécurité portées' },
  { key: 'gants', label: 'Gants' },
  { key: 'tenueCorrecte', label: 'Tenue correcte' },
  { key: 'ceintureShintee', label: 'Ceinture de sécurité SHINTEE' },
]

export const securityDefinitions: ReadonlyArray<{ key: SecurityKey; label: string }> = [
  { key: 'rearLock', label: 'Rideau / porte arrière verrouillé(e)' },
  { key: 'sideLock', label: 'Porte latérale verrouillée' },
  { key: 'hayonKey', label: 'Clé présente sur le hayon' },
]

function createDocumentState(): Record<DocumentKey, DocumentState> {
  return {
    licence: { presence: '', expiryDate: '' },
    assurance: { presence: '', expiryDate: '' },
    permis: { presence: '', expiryDate: '' },
    controleTechniqueVehicule: { presence: '', expiryDate: '' },
    controleTechniqueHayon: { presence: '', expiryDate: '' },
    adr: { presence: '', expiryDate: '' },
    critair: { presence: '', expiryDate: '' },
  }
}

function createCheckMap<T extends string>(keys: ReadonlyArray<T>): Record<T, CheckValue> {
  return keys.reduce<Record<T, CheckValue>>((accumulator, key) => {
    accumulator[key] = ''
    return accumulator
  }, {} as Record<T, CheckValue>)
}

export function createInitialState(): InspectionFormState {
  return {
    controllerRole: '',
    controllerRoleDescription: '',
    controllerName: '',
    tourDate: '',
    tourNumber: '',
    vehiclePlate: '',
    driverLastName: '',
    driverFirstName: '',
    subcontractorName: '',
    badgePresent: '',
    badgeIssue: '',
    extinguisher: '',
    tiresCondition: '',
    tiresSmooth: '',
    documents: createDocumentState(),
    equipment: createCheckMap(equipmentDefinitions.map((item) => item.key)),
    security: createCheckMap(securityDefinitions.map((item) => item.key)),
    parcelCheckDone: '',
    parcelAnomalies: '',
    parcelAnomaliesNotes: '',
  }
}

export function getTodayIsoDate() {
  const today = new Date()
  const offset = today.getTimezoneOffset()
  return new Date(today.getTime() - offset * 60_000).toISOString().slice(0, 10)
}

export function isExpiredDate(dateValue: string) {
  return dateValue.length > 0 && dateValue < getTodayIsoDate()
}

export function getBlockingReasons(form: InspectionFormState) {
  const reasons: string[] = []

  if (form.tiresCondition === 'no' && form.tiresSmooth === 'yes') {
    reasons.push('Pneus lisses détectés.')
  }

  for (const definition of documentDefinitions) {
    const document = form.documents[definition.key]

    if (
      definition.hasExpiryDate &&
      definition.blocksWhenExpired &&
      isExpiredDate(document.expiryDate)
    ) {
      reasons.push(`${definition.label} dépassé(e).`)
    }
  }

  return reasons
}

export function getAttentionPoints(form: InspectionFormState) {
  const points: string[] = []

  if (form.badgePresent === 'no') {
    const causeLabel =
      form.badgeIssue === 'lost'
        ? 'badge perdu'
        : form.badgeIssue === 'broken'
          ? 'badge cassé'
          : form.badgeIssue === 'not_received'
            ? 'badge non reçu'
            : 'cause non renseignée'

    points.push(`Badge absent : ${causeLabel}.`)
  }

  if (form.extinguisher === 'no') {
    points.push("Absence d'extincteur à confirmer.")
  }

  if (form.tiresCondition === 'no') {
    points.push('État des pneus non conforme.')
  }

  for (const definition of documentDefinitions) {
    if (form.documents[definition.key].presence === 'missing') {
      points.push(`${definition.label} non présenté(e).`)
    }
  }

  for (const definition of equipmentDefinitions) {
    if (form.equipment[definition.key] === 'no') {
      points.push(`${definition.label} non conforme.`)
    }
  }

  for (const definition of securityDefinitions) {
    if (form.security[definition.key] === 'no') {
      points.push(`${definition.label} : anomalie constatée.`)
    }
  }

  if (form.parcelAnomalies === 'yes') {
    points.push('Des anomalies colis ont été signalées.')
  }

  if (form.parcelAnomalies === 'yes' && form.parcelAnomaliesNotes.trim().length === 0) {
    points.push('Le détail des anomalies colis doit être renseigné.')
  }

  return points
}

export function getMissingRequiredInfoCount(form: InspectionFormState) {
  const requiredFields = [
    form.controllerRole,
    form.controllerName,
    form.tourDate,
    form.tourNumber,
    form.vehiclePlate,
    form.driverLastName,
    form.driverFirstName,
    form.subcontractorName,
  ]

  let missingCount = requiredFields.filter((value) => value.trim().length === 0).length

  if (form.controllerRole === 'autre' && form.controllerRoleDescription.trim().length === 0) {
    missingCount += 1
  }

  return missingCount
}

export function getControllerRoleLabel(role: ControllerRole) {
  if (role === 'surete') {
    return 'Sûreté'
  }

  if (role === 'camionnage') {
    return 'Camionnage'
  }

  if (role === 'autre') {
    return 'Autre'
  }

  return 'Non renseigné'
}

export function getPendingChecksCount(form: InspectionFormState) {
  let count = 0

  const scalarChecks: CheckValue[] = [
    form.badgePresent,
    form.extinguisher,
    form.tiresCondition,
    form.parcelCheckDone,
    form.parcelAnomalies,
  ]

  for (const value of scalarChecks) {
    if (value.length === 0) {
      count += 1
    }
  }

  if (form.badgePresent === 'no' && form.badgeIssue.length === 0) {
    count += 1
  }

  for (const definition of equipmentDefinitions) {
    if (form.equipment[definition.key].length === 0) {
      count += 1
    }
  }

  for (const definition of securityDefinitions) {
    if (form.security[definition.key].length === 0) {
      count += 1
    }
  }

  if (form.tiresCondition === 'no' && form.tiresSmooth.length === 0) {
    count += 1
  }

  for (const definition of documentDefinitions) {
    const document = form.documents[definition.key]

    if (document.presence.length === 0) {
      count += 1
    }

    if (definition.hasExpiryDate && document.expiryDate.length === 0) {
      count += 1
    }
  }

  if (form.parcelAnomalies === 'yes' && form.parcelAnomaliesNotes.trim().length === 0) {
    count += 1
  }

  return count
}
