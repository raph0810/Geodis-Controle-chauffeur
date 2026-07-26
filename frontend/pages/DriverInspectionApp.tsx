import React, { useState, useEffect, useMemo } from 'react'
import { 
  Home, 
  RotateCcw, 
  User, 
  IdCard, 
  Truck, 
  FileCheck, 
  ShieldCheck, 
  Lock, 
  PackageCheck,
  CheckCircle2,
  ClipboardList,
  AlertTriangle,
  ArrowLeft,
  Ban,
  AlertCircle,
  History,
  Eye,
  ShieldAlert,
  BarChart3,
  Search,
  Filter,
  Download,
  XCircle,
  FileSpreadsheet
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface InspectionRecord {
  id: string
  timestamp: string
  status: 'Bloqué' | 'À surveiller' | 'Valide'
  statusColor: string
  controllerPost: string
  otherControllerPost: string
  controllerName: string
  inspectionDate: string
  tourNumber: string
  immatriculation: string
  driverLastName: string
  driverFirstName: string
  subcontractor: string
  badgePresent: string
  badgeReason: string
  extincteur: string
  pneuStatus: string
  pneuLisse: string
  licence: string
  assurance: string
  assuranceDate: string
  permis: string
  ctVehicule: string
  ctVehiculeDate: string
  ctHayon: string
  ctHayonDate: string
  attestationAdr: string
  critAir: string
  critAirDate: string
  kitSante: string
  kitAdr: string
  mobicop: string
  chasuble: string
  chaussures: string
  gants: string
  tenue: string
  ceinture: string
  rideau: string
  porteLat: string
  cleHayon: string
  ctrlColisDone: string
  hasAnomaliesColis: string
  anomaliesDetail: string
}

export default function DriverInspectionApp() {
  const [currentView, setCurrentView] = useState<'form' | 'summary' | 'history' | 'detail' | 'globalSummary'>('form')

  const [inspectionHistory, setInspectionHistory] = useState<InspectionRecord[]>(() => {
    try {
      const savedHistory = localStorage.getItem('inspection_history')
      return savedHistory ? JSON.parse(savedHistory) : []
    } catch (e) {
      console.error("Erreur de lecture du localStorage", e)
      return []
    }
  })
  
  useEffect(() => {
    try {
      localStorage.setItem('inspection_history', JSON.stringify(inspectionHistory))
    } catch (e) {
      console.error("Erreur d'écriture dans le localStorage", e)
    }
  }, [inspectionHistory])

  const [selectedRecord, setSelectedRecord] = useState<InspectionRecord | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const getTodayFormatted = () => {
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    return `${dd}/${mm}/${yyyy}`
  }

  const formatDateWithSlashes = (dateStr: string) => {
    if (!dateStr) return 'Non renseignée'
    if (dateStr.includes('/')) return dateStr
    const digits = dateStr.replace(/\D/g, '')
    if (digits.length === 8) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
    }
    return dateStr
  }

  const [controllerPost, setControllerPost] = useState<string>('surete')
  const [otherControllerPost, setOtherControllerPost] = useState<string>('')
  const [controllerName, setControllerName] = useState<string>('')
  const [inspectionDate, setInspectionDate] = useState<string>(getTodayFormatted())
  const [tourNumber, setTourNumber] = useState<string>('')
  const [immatriculation, setImmatriculation] = useState<string>('')
  const [driverLastName, setDriverLastName] = useState<string>('')
  const [driverFirstName, setDriverFirstName] = useState<string>('')
  const [subcontractor, setSubcontractor] = useState<string>('')

  const [badgePresent, setBadgePresent] = useState<string>('')
  const [badgeReason, setBadgeReason] = useState<string>('')

  const [extincteur, setExtincteur] = useState<string>('')
  const [pneuStatus, setPneuStatus] = useState<string>('')
  const [pneuLisse, setPneuLisse] = useState<string>('')

  const [licence, setLicence] = useState<string>('')
  const [assurance, setAssurance] = useState<string>('')
  const [assuranceDate, setAssuranceDate] = useState<string>('')
  const [permis, setPermis] = useState<string>('')
  const [ctVehicule, setCtVehicule] = useState<string>('')
  const [ctVehiculeDate, setCtVehiculeDate] = useState<string>('')
  const [ctHayon, setCtHayon] = useState<string>('')
  const [ctHayonDate, setCtHayonDate] = useState<string>('')
  const [attestationAdr, setAttestationAdr] = useState<string>('')
  const [critAir, setCritAir] = useState<string>('')
  const [critAirDate, setCritAirDate] = useState<string>('')

  const [kitSante, setKitSante] = useState<string>('')
  const [kitAdr, setKitAdr] = useState<string>('')
  const [mobicop, setMobicop] = useState<string>('')
  const [chasuble, setChasuble] = useState<string>('')
  const [chaussures, setChaussures] = useState<string>('')
  const [gants, setGants] = useState<string>('')
  const [tenue, setTenue] = useState<string>('')
  const [ceinture, setCeinture] = useState<string>('')

  const [rideau, setRideau] = useState<string>('')
  const [porteLat, setPorteLat] = useState<string>('')
  const [cleHayon, setCleHayon] = useState<string>('')

  const [ctrlColisDone, setCtrlColisDone] = useState<string>('')
  const [hasAnomaliesColis, setHasAnomaliesColis] = useState<string>('')
  const [anomaliesDetail, setAnomaliesDetail] = useState<string>('')

  const formatDateInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8)
    if (digits.length >= 5) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
    } else if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`
    }
    return digits
  }

  const parseDateFr = (dateStr: string): Date | null => {
    if (!dateStr || dateStr.length !== 10) return null
    const [day, month, year] = dateStr.split('/').map(Number)
    if (!day || !month || !year || month > 12 || day > 31) return null
    return new Date(year, month - 1, day)
  }

  const isDateExpired = (expiryDateStr: string) => {
    const expiryDate = parseDateFr(expiryDateStr)
    const ctrlDate = parseDateFr(inspectionDate)
    if (!expiryDate || !ctrlDate) return false
    return expiryDate < ctrlDate
  }

  const isRecordDateExpired = (expiryDateStr: string, inspectionDateStr: string) => {
    const expiryDate = parseDateFr(expiryDateStr)
    const ctrlDate = parseDateFr(inspectionDateStr)
    if (!expiryDate || !ctrlDate) return false
    return expiryDate < ctrlDate
  }

  const handleReset = () => {
    setControllerPost('surete')
    setOtherControllerPost('')
    setControllerName('')
    setInspectionDate(getTodayFormatted())
    setTourNumber('')
    setImmatriculation('')
    setDriverLastName('')
    setDriverFirstName('')
    setSubcontractor('')

    setBadgePresent('')
    setBadgeReason('')

    setExtincteur('')
    setPneuStatus('')
    setPneuLisse('')

    setLicence('')
    setAssurance('')
    setAssuranceDate('')
    setPermis('')
    setCtVehicule('')
    setCtVehiculeDate('')
    setCtHayon('')
    setCtHayonDate('')
    setAttestationAdr('')
    setCritAir('')
    setCritAirDate('')

    setKitSante('')
    setKitAdr('')
    setMobicop('')
    setChasuble('')
    setChaussures('')
    setGants('')
    setTenue('')
    setCeinture('')

    setRideau('')
    setPorteLat('')
    setCleHayon('')

    setCtrlColisDone('')
    setHasAnomaliesColis('')
    setAnomaliesDetail('')

    setCurrentView('form')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formattedInspDate = formatDateWithSlashes(inspectionDate)

    const hasBlocker = pneuLisse === 'oui'
    const hasWarnings = 
      badgePresent === 'non' || 
      extincteur === 'non' || 
      pneuStatus === 'degrade' || 
      licence === 'non' || 
      assurance === 'non' || isDateExpired(assuranceDate) || 
      permis === 'non' || 
      ctVehicule === 'non' || isDateExpired(ctVehiculeDate) || 
      ctHayon === 'non' || isDateExpired(ctHayonDate) || 
      attestationAdr === 'non' || 
      critAir === 'non' || isDateExpired(critAirDate) || 
      kitSante === 'non' || 
      kitAdr === 'non' || 
      mobicop === 'non' || 
      chasuble === 'non' || 
      chaussures === 'non' || 
      gants === 'non' || 
      tenue === 'non' || 
      ceinture === 'non' || 
      rideau === 'non' || 
      porteLat === 'non' || 
      cleHayon === 'non' || 
      hasAnomaliesColis === 'oui'

    let status: 'Bloqué' | 'À surveiller' | 'Valide' = 'Valide'
    let statusColor = 'bg-emerald-600'
    if (hasBlocker) {
      status = 'Bloqué'
      statusColor = 'bg-rose-600'
    } else if (hasWarnings) {
      status = 'À surveiller'
      statusColor = 'bg-amber-600'
    }

    const now = new Date()
    const timestampStr = `${now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}, ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`

    const newRecord: InspectionRecord = {
      id: Date.now().toString(),
      timestamp: timestampStr,
      status,
      statusColor,
      controllerPost,
      otherControllerPost,
      controllerName,
      inspectionDate: formattedInspDate,
      tourNumber,
      immatriculation,
      driverLastName,
      driverFirstName,
      subcontractor,
      badgePresent,
      badgeReason,
      extincteur,
      pneuStatus,
      pneuLisse,
      licence,
      assurance,
      assuranceDate: formatDateWithSlashes(assuranceDate),
      permis,
      ctVehicule,
      ctVehiculeDate: formatDateWithSlashes(ctVehiculeDate),
      ctHayon,
      ctHayonDate: formatDateWithSlashes(ctHayonDate),
      attestationAdr,
      critAir,
      critAirDate: formatDateWithSlashes(critAirDate),
      kitSante,
      kitAdr,
      mobicop,
      chasuble,
      chaussures,
      gants,
      tenue,
      ceinture,
      rideau,
      porteLat,
      cleHayon,
      ctrlColisDone,
      hasAnomaliesColis,
      anomaliesDetail
    }

    setInspectionHistory([newRecord, ...inspectionHistory])
    setCurrentView('summary')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filteredGlobalInspections = useMemo(() => {
    return inspectionHistory.filter((item) => {
      const driverFullName = `${item.driverFirstName} ${item.driverLastName}`.toLowerCase()
      const matchesSearch =
        driverFullName.includes(searchTerm.toLowerCase()) ||
        item.immatriculation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tourNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subcontractor.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'conforme' && item.status === 'Valide') ||
        (statusFilter === 'bloquant' && item.status === 'Bloqué') ||
        (statusFilter === 'alerte' && item.status === 'À surveiller')

      return matchesSearch && matchesStatus
    })
  }, [inspectionHistory, searchTerm, statusFilter])

  const globalStats = useMemo(() => {
    const total = inspectionHistory.length
    const conformes = inspectionHistory.filter((i) => i.status === 'Valide').length
    const bloquants = inspectionHistory.filter((i) => i.status === 'Bloqué').length
    const alertes = inspectionHistory.filter((i) => i.status === 'À surveiller').length
    const conformePercentage = total > 0 ? Math.round((conformes / total) * 100) : 0

    return { total, conformes, bloquants, alertes, conformePercentage }
  }, [inspectionHistory])

  // ==========================================
  // VUE : SYNTHÈSE GLOBALE
  // ==========================================
  if (currentView === 'globalSummary') {
    return (
      <div className="min-h-screen bg-[#1d2a80] p-4 md:p-8 text-white font-sans">
        <div className="mx-auto max-w-6xl space-y-6">

          <div className="flex items-center justify-between rounded-xl bg-[#22252a] p-4 shadow-lg border border-[#2d3139]">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#32363e] text-gray-300">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-gray-400 font-medium block">Tableau de bord</span>
                <span className="text-sm font-bold text-white">Synthèse Globale (Détaillée & Graphique)</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentView('history')}
                className="flex items-center space-x-2 rounded-lg bg-[#32363e] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-700 cursor-pointer"
              >
                <History className="h-4 w-4" />
                <span>Retour à l'historique</span>
              </button>
              <Link
                to="/"
                className="flex items-center space-x-2 rounded-lg bg-[#32363e] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-700"
              >
                <Home className="h-4 w-4" />
                <span>Accueil</span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between rounded-xl bg-[#22252a] p-6 shadow-lg border border-[#2d3139] gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="rounded bg-blue-600 px-2 py-0.5 text-[11px] font-bold uppercase text-white">
                  Analytique complète
                </span>
                <span className="rounded bg-[#32363e] px-2 py-0.5 text-[11px] font-bold text-gray-300">
                  Tous les formulaires enregistrés
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Synthèse détaillée et graphique globale
              </h1>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center space-x-2 rounded-lg bg-[#32363e] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-gray-700 self-start md:self-auto border border-[#404550]"
            >
              <Download className="h-4 w-4" />
              <span>Exporter / Imprimer</span>
            </button>
          </div>

          {/* KPI Grille */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl bg-[#22252a] p-5 border border-[#2d3139] shadow-lg flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Total Contrôles</p>
                <p className="text-2xl font-bold text-white">{globalStats.total}</p>
              </div>
            </div>

            <div className="rounded-xl bg-[#22252a] p-5 border border-[#2d3139] shadow-lg flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Conformes ({globalStats.conformePercentage}%)</p>
                <p className="text-2xl font-bold text-emerald-400">{globalStats.conformes}</p>
              </div>
            </div>

            <div className="rounded-xl bg-[#22252a] p-5 border border-[#2d3139] shadow-lg flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <XCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Cas Bloquants</p>
                <p className="text-2xl font-bold text-rose-400">{globalStats.bloquants}</p>
              </div>
            </div>

            <div className="rounded-xl bg-[#22252a] p-5 border border-[#2d3139] shadow-lg flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">À surveiller / Alertes</p>
                <p className="text-2xl font-bold text-amber-400">{globalStats.alertes}</p>
              </div>
            </div>
          </div>

          {/* Synthèse Graphique Visuelle */}
          <div className="rounded-xl bg-[#22252a] p-6 shadow-lg border border-[#2d3139] space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Synthèse Graphique : Répartition globale des statuts
            </h2>
            <div className="h-4 w-full rounded-full bg-[#181a1d] overflow-hidden flex">
              <div
                style={{ width: `${(globalStats.conformes / (globalStats.total || 1)) * 100}%` }}
                className="bg-emerald-500 h-full transition-all duration-500"
                title="Conformes"
              />
              <div
                style={{ width: `${(globalStats.alertes / (globalStats.total || 1)) * 100}%` }}
                className="bg-amber-500 h-full transition-all duration-500"
                title="À surveiller"
              />
              <div
                style={{ width: `${(globalStats.bloquants / (globalStats.total || 1)) * 100}%` }}
                className="bg-rose-500 h-full transition-all duration-500"
                title="Bloquants"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <span className="flex items-center space-x-1.5">
                <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" />
                <span>Conformes ({globalStats.conformes})</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="h-3 w-3 rounded-full bg-amber-500 inline-block" />
                <span>À surveiller ({globalStats.alertes})</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500 inline-block" />
                <span>Bloqués ({globalStats.bloquants})</span>
              </span>
            </div>
          </div>

          {/* Filtres et Recherche de la Synthèse Détaillée */}
          <div className="rounded-xl bg-[#22252a] p-4 shadow-lg border border-[#2d3139] flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Conducteur, immatriculation, tournée..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg bg-[#181a1d] border border-[#32363e] pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400 hidden sm:block" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg bg-[#181a1d] border border-[#32363e] p-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="conforme">Conformes uniquement</option>
                  <option value="bloquant">Bloquants uniquement</option>
                  <option value="alerte">À surveiller uniquement</option>
                </select>
              </div>
            </div>
          </div>

          {/* Synthèse Détaillée */}
          <div className="rounded-xl bg-[#22252a] shadow-lg border border-[#2d3139] overflow-hidden">
            <div className="p-4 border-b border-[#2d3139] flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Synthèse détaillée de tous les formulaires</h2>
              <span className="text-xs text-gray-400">{filteredGlobalInspections.length} résultat(s)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#181a1d] text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Date / Tournée</th>
                    <th className="p-4">Conducteur / Sous-traitant</th>
                    <th className="p-4">Immatriculation</th>
                    <th className="p-4">Badge</th>
                    <th className="p-4">Statut global</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d3139]">
                  {filteredGlobalInspections.length > 0 ? (
                    filteredGlobalInspections.map((item) => (
                      <tr key={item.id} className="hover:bg-[#282c33] transition-colors">
                        <td className="p-4 font-medium text-white">
                          <div>{formatDateWithSlashes(item.inspectionDate)}</div>
                          <span className="text-[11px] text-gray-400">{item.tourNumber || 'Tournée non renseignée'}</span>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-white">
                            {(item.driverFirstName || item.driverLastName) ? `${item.driverFirstName} ${item.driverLastName}` : 'Non renseigné'}
                          </div>
                          <div className="text-[11px] text-gray-400">{item.subcontractor || 'Sous-traitant non renseigné'}</div>
                        </td>
                        <td className="p-4 font-mono font-semibold text-gray-200">
                          {item.immatriculation || 'Non renseignée'}
                        </td>
                        <td className="p-4">
                          {item.badgePresent === 'oui' ? (
                            <span className="inline-flex items-center space-x-1 text-emerald-400">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Présent</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 text-rose-400 font-semibold">
                              <XCircle className="h-3.5 w-3.5" />
                              <span>Absent</span>
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`rounded px-2.5 py-1 text-[10px] font-bold text-white uppercase inline-block ${item.statusColor}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedRecord(item)
                              setCurrentView('detail')
                            }}
                            className="inline-flex items-center space-x-1 rounded bg-[#32363e] px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-700 transition-colors cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Consulter</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">
                        Aucun formulaire enregistré ne correspond à vos critères.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    )
  }

  // ==========================================
  // VUE : DÉTAIL D'UN FORMULAIRE UNIQUE
  // ==========================================
  if (currentView === 'detail' && selectedRecord) {
    return (
      <div className="min-h-screen bg-[#1d2a80] p-4 md:p-8 text-white font-sans">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex items-center justify-between rounded-xl bg-[#22252a] p-4 shadow-lg border border-[#2d3139]">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#32363e] text-gray-300">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-gray-400 font-medium block">Mode Lecture seule</span>
                <span className="text-sm font-bold text-white">Détail et synthèse de l'inspection</span>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('history')}
              className="flex items-center space-x-2 rounded-lg bg-[#32363e] px-4 py-2 text-xs font-semibold text-white hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour à l'historique</span>
            </button>
          </div>

          <div className="rounded-xl bg-[#22252a] p-6 shadow-lg border border-[#2d3139] space-y-4">
            <div>
              <span className={`rounded px-2.5 py-0.5 text-[11px] font-bold uppercase text-white ${selectedRecord.statusColor}`}>
                {selectedRecord.status}
              </span>
              <h1 className="text-2xl font-bold text-white mt-2">Synthèse du contrôle du {selectedRecord.timestamp}</h1>
            </div>
          </div>

          <div className="rounded-xl bg-[#22252a] p-6 shadow-lg border border-[#2d3139] space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-300" />
              <h2 className="text-base font-bold text-white">Informations principales</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 pt-2 text-xs">
              <div>
                <span className="text-gray-400 block">Poste du contrôleur</span>
                <span className="font-bold text-white">{selectedRecord.controllerPost === 'autre' ? (selectedRecord.otherControllerPost || 'Non renseigné') : selectedRecord.controllerPost}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Contrôleur</span>
                <span className="font-bold text-white">{selectedRecord.controllerName || 'Non renseigné'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Date</span>
                <span className="font-bold text-white">{formatDateWithSlashes(selectedRecord.inspectionDate)}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Numéro de tournée</span>
                <span className="font-bold text-white">{selectedRecord.tourNumber || 'Non renseigné'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Immatriculation</span>
                <span className="font-bold text-white">{selectedRecord.immatriculation || 'Non renseignée'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Conducteur</span>
                <span className="font-bold text-white">{(selectedRecord.driverFirstName || selectedRecord.driverLastName) ? `${selectedRecord.driverFirstName} ${selectedRecord.driverLastName}` : 'Non renseigné'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // VUE : HISTORIQUE DES CONTRÔLES
  // ==========================================
  if (currentView === 'history') {
    const blockedCount = inspectionHistory.filter((rec) => rec.status === 'Bloqué').length
    const warningCount = inspectionHistory.filter((rec) => rec.status === 'À surveiller').length
    const validCount = inspectionHistory.filter((rec) => rec.status === 'Valide').length

    return (
      <div className="min-h-screen bg-[#1d2a80] p-4 md:p-8 text-white font-sans">
        <div className="mx-auto max-w-6xl space-y-6">

          <div className="flex items-center justify-between rounded-xl bg-[#22252a] p-4 shadow-lg border border-[#2d3139]">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#32363e] text-gray-300">
                <History className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-gray-400 font-medium block">Suivi des contrôles</span>
                <span className="text-sm font-bold text-white cursor-pointer" onClick={() => setCurrentView('history')}>
                  Historique des contrôles
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentView('globalSummary')}
                className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Synthèse globale (Détaillée & Graphique)</span>
              </button>
              <button
                onClick={() => setCurrentView('form')}
                className="flex items-center space-x-2 rounded-lg bg-[#32363e] px-4 py-2 text-xs font-semibold text-white hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Nouveau formulaire</span>
              </button>
              <Link
                to="/"
                className="flex items-center space-x-2 rounded-lg bg-[#32363e] px-4 py-2 text-xs font-semibold text-white hover:bg-gray-700 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Accueil</span>
              </Link>
            </div>
          </div>

          <div className="rounded-xl bg-[#22252a] p-6 shadow-lg border border-[#2d3139] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
                  <History className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Historique de tous les contrôles enregistrés</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Vue complète avec statut, conducteur, tournée et anomalies principales.
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#32363e] text-gray-400 font-medium">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Statut</th>
                    <th className="py-3 px-3">Contrôleur</th>
                    <th className="py-3 px-3">Conducteur</th>
                    <th className="py-3 px-3">Tournée</th>
                    <th className="py-3 px-3">Immatriculation</th>
                    <th className="py-3 px-3">Observations</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#32363e]/50 text-white">
                  {inspectionHistory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-400 italic">
                        Aucun formulaire validé pour le moment.
                      </td>
                    </tr>
                  ) : (
                    inspectionHistory.map((rec) => {
                      const obsList: string[] = []
                      if (rec.pneuLisse === 'oui') obsList.push('Pneus lisses détectés.')
                      if (rec.badgePresent === 'non') obsList.push('Badge absent.')
                      if (rec.extincteur === 'non') obsList.push('Extincteur manquant.')
                      if (isRecordDateExpired(rec.assuranceDate, rec.inspectionDate)) obsList.push('Assurance expirée.')
                      if (isRecordDateExpired(rec.ctVehiculeDate, rec.inspectionDate)) obsList.push('Contrôle technique du véhicule dépassé.')
                      if (isRecordDateExpired(rec.ctHayonDate, rec.inspectionDate)) obsList.push('Contrôle technique hayon dépassé.')
                      if (rec.hasAnomaliesColis === 'oui') obsList.push('Anomalies colis signalées.')

                      return (
                        <tr key={rec.id} className="hover:bg-[#282c35] transition-colors">
                          <td className="py-4 px-3 text-gray-300 font-medium whitespace-nowrap">
                            {formatDateWithSlashes(rec.inspectionDate)}
                          </td>
                          <td className="py-4 px-3 whitespace-nowrap">
                            <span className={`rounded-full px-3 py-1 text-[11px] font-bold text-white inline-block ${rec.statusColor}`}>
                              {rec.status}
                            </span>
                          </td>
                          <td className="py-4 px-3">
                            <div className="font-bold">{rec.controllerName || 'Non renseigné'}</div>
                            <div className="text-[10px] text-gray-400 uppercase">{rec.controllerPost}</div>
                          </td>
                          <td className="py-4 px-3">
                            {(rec.driverFirstName || rec.driverLastName) ? `${rec.driverFirstName} ${rec.driverLastName}` : 'Non renseigné'}
                          </td>
                          <td className="py-4 px-3">{rec.tourNumber || 'Non renseignée'}</td>
                          <td className="py-4 px-3">{rec.immatriculation || 'Non renseignée'}</td>
                          <td className="py-4 px-3 max-w-xs text-gray-300">
                            {obsList.length === 0 ? (
                              <span className="text-gray-400">Aucune anomalie</span>
                            ) : (
                              obsList.slice(0, 2).map((obs, idx) => (
                                <div key={idx} className="flex items-center space-x-1.5">
                                  <span className="text-rose-500">•</span>
                                  <span>{obs}</span>
                                </div>
                              ))
                            )}
                          </td>
                          <td className="py-4 px-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => {
                                setSelectedRecord(rec)
                                setCurrentView('detail')
                              }}
                              className="inline-flex items-center space-x-1 rounded bg-[#32363e] px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>Consulter</span>
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-[#22252a] p-6 shadow-lg border border-[#2d3139] flex items-center gap-4">
              <ShieldAlert className="h-8 w-8 text-rose-500 shrink-0" />
              <div>
                <div className="text-xs text-gray-400 font-medium">Bloqués</div>
                <div className="text-2xl font-bold text-white">{blockedCount}</div>
              </div>
            </div>
            <div className="rounded-xl bg-[#22252a] p-6 shadow-lg border border-[#2d3139] flex items-center gap-4">
              <AlertTriangle className="h-8 w-8 text-amber-500 shrink-0" />
              <div>
                <div className="text-xs text-gray-400 font-medium">À surveiller</div>
                <div className="text-2xl font-bold text-white">{warningCount}</div>
              </div>
            </div>
            <div className="rounded-xl bg-[#22252a] p-6 shadow-lg border border-[#2d3139] flex items-center gap-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 shrink-0" />
              <div>
                <div className="text-xs text-gray-400 font-medium">Conformes</div>
                <div className="text-2xl font-bold text-white">{validCount}</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }

  // ==========================================
  // VUE : SYNTHÈSE DU CONTRÔLE COURANT
  // ==========================================
  if (currentView === 'summary') {
    const latestRecord = inspectionHistory[0]

    return (
      <div className="min-h-screen bg-[#1d2a80] p-4 md:p-8 text-white font-sans">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex items-center justify-between rounded-xl bg-[#22252a] p-4 shadow-lg border border-[#2d3139]">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#32363e] text-gray-300">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-gray-400 font-medium block">Application de contrôle</span>
                <span className="text-sm font-bold text-white">Synthèse du contrôle</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentView('history')}
                className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <History className="h-4 w-4" />
                <span>Voir l'historique de contrôle</span>
              </button>
              <button
                onClick={() => setCurrentView('form')}
                className="flex items-center space-x-2 rounded-lg bg-[#32363e] px-4 py-2 text-xs font-semibold text-white hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Nouveau contrôle</span>
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-[#22252a] p-6 shadow-lg border border-[#2d3139] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className={`rounded px-2.5 py-0.5 text-[11px] font-bold uppercase text-white ${latestRecord?.statusColor}`}>
                {latestRecord?.status}
              </span>
              <h1 className="text-2xl font-bold text-white mt-2">Synthèse du contrôle chauffeur</h1>
              <p className="text-xs text-gray-400 mt-1">Le formulaire a bien été enregistré dans l'historique.</p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 rounded-lg bg-[#32363e] px-4 py-2.5 text-xs font-semibold text-white hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // VUE : FORMULAIRE DE SAISIE INITIAL
  // ==========================================
  return (
    <div className="min-h-screen bg-[#1d2a80] p-4 md:p-8 text-white font-sans">
      <div className="mx-auto max-w-4xl space-y-6">
        
        <div className="flex items-center justify-between rounded-xl bg-[#22252a] p-4 shadow-lg border border-[#2d3139]">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#32363e] text-gray-300">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium block">Nouveau contrôle</span>
              <span className="text-sm font-bold text-white">Formulaire d'inspection conducteur</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('history')}
              className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <History className="h-4 w-4" />
              <span>Historique</span>
            </button>
            <Link
              to="/"
              className="flex items-center space-x-2 rounded-lg bg-[#32363e] px-4 py-2 text-xs font-semibold text-white hover:bg-gray-700 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Accueil</span>
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl bg-[#22252a] p-6 shadow-lg border border-[#2d3139] space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-400" />
              <span>Informations générales</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Nom du contrôleur *</label>
                <input
                  type="text"
                  required
                  value={controllerName}
                  onChange={(e) => setControllerName(e.target.value)}
                  placeholder="Nom du contrôleur"
                  className="w-full rounded-lg bg-[#181a1d] border border-[#32363e] p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Date du contrôle *</label>
                <input
                  type="text"
                  required
                  value={inspectionDate}
                  onChange={(e) => setInspectionDate(formatDateInput(e.target.value))}
                  placeholder="JJ/MM/AAAA"
                  maxLength={10}
                  className="w-full rounded-lg bg-[#181a1d] border border-[#32363e] p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Numéro de tournée *</label>
                <input
                  type="text"
                  required
                  value={tourNumber}
                  onChange={(e) => setTourNumber(e.target.value)}
                  placeholder="Numéro de tournée"
                  className="w-full rounded-lg bg-[#181a1d] border border-[#32363e] p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Immatriculation du véhicule *</label>
                <input
                  type="text"
                  required
                  value={immatriculation}
                  onChange={(e) => setImmatriculation(e.target.value.toUpperCase())}
                  placeholder="AA-123-BB"
                  className="w-full rounded-lg bg-[#181a1d] border border-[#32363e] p-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Nom du conducteur *</label>
                <input
                  type="text"
                  required
                  value={driverLastName}
                  onChange={(e) => setDriverLastName(e.target.value)}
                  placeholder="Nom"
                  className="w-full rounded-lg bg-[#181a1d] border border-[#32363e] p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Prénom du conducteur *</label>
                <input
                  type="text"
                  required
                  value={driverFirstName}
                  onChange={(e) => setDriverFirstName(e.target.value)}
                  placeholder="Prénom"
                  className="w-full rounded-lg bg-[#181a1d] border border-[#32363e] p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section Contrôle des Équipements / Pneus / Badge */}
          <div className="rounded-xl bg-[#22252a] p-6 shadow-lg border border-[#2d3139] space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span>Contrôles de sécurité & Véhicule</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Badge présent ?</label>
                <select
                  required
                  value={badgePresent}
                  onChange={(e) => setBadgePresent(e.target.value)}
                  className="w-full rounded-lg bg-[#181a1d] border border-[#32363e] p-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Sélectionner...</option>
                  <option value="oui">Oui</option>
                  <option value="non">Non (Alerte)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">État des pneus</label>
                <select
                  required
                  value={pneuStatus}
                  onChange={(e) => setPneuStatus(e.target.value)}
                  className="w-full rounded-lg bg-[#181a1d] border border-[#32363e] p-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Sélectionner...</option>
                  <option value="bon">Bon état</option>
                  <option value="degrade">Dégradé (Alerte)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Présence de pneus lisses ? (Bloquant)</label>
                <select
                  required
                  value={pneuLisse}
                  onChange={(e) => setPneuLisse(e.target.value)}
                  className="w-full rounded-lg bg-[#181a1d] border border-[#32363e] p-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Sélectionner...</option>
                  <option value="non">Non</option>
                  <option value="oui">Oui (BLOQUANT)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Extincteur présent ?</label>
                <select
                  required
                  value={extincteur}
                  onChange={(e) => setExtincteur(e.target.value)}
                  className="w-full rounded-lg bg-[#181a1d] border border-[#32363e] p-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Sélectionner...</option>
                  <option value="oui">Oui</option>
                  <option value="non">Non (Alerte)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg bg-[#32363e] px-5 py-2.5 text-xs font-semibold text-white hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer shadow-lg shadow-blue-600/30"
            >
              Valider et enregistrer l'inspection
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}