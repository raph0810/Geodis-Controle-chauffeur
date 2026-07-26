import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Home,
  BarChart3,
  CheckCircle2,
  XCircle,
  Download,
  FileSpreadsheet,
  Search,
  AlertTriangle
} from 'lucide-react'

// Interface définissant la structure d'un enregistrement d'inspection
export interface InspectionRecord {
  id: string
  date: string
  tourneeNumber: string
  driverName: string
  subcontractor: string
  immatriculation: string
  status: 'conforme' | 'bloquant' | 'alerte'
  blockingReason?: string
  badgeStatus: 'present' | 'absent'
  documentsExpiredCount: number
}

// Données fictives initiales pour alimenter les indicateurs et tableaux
const MOCK_INSPECTIONS: InspectionRecord[] = [
  {
    id: 'CTRL-2026-001',
    date: '2026-07-25',
    tourneeNumber: 'T-2451',
    driverName: 'Jean Dupont',
    subcontractor: 'TransExpress',
    immatriculation: 'AA-123-BB',
    status: 'conforme',
    badgeStatus: 'present',
    documentsExpiredCount: 0
  },
  {
    id: 'CTRL-2026-002',
    date: '2026-07-25',
    tourneeNumber: 'T-2452',
    driverName: 'Marc Martin',
    subcontractor: 'LogiLog',
    immatriculation: 'BC-456-DE',
    status: 'bloquant',
    blockingReason: 'Pneus dégradés / lisse',
    badgeStatus: 'present',
    documentsExpiredCount: 1
  },
  {
    id: 'CTRL-2026-003',
    date: '2026-07-24',
    tourneeNumber: 'T-2448',
    driverName: 'Sophie Bernard',
    subcontractor: 'QuickTrans',
    immatriculation: 'EF-789-GH',
    status: 'alerte',
    blockingReason: 'CT Hayon expire dans 3 jours',
    badgeStatus: 'absent',
    documentsExpiredCount: 0
  },
  {
    id: 'CTRL-2026-004',
    date: '2026-07-24',
    tourneeNumber: 'T-2449',
    driverName: 'Pierre Durand',
    subcontractor: 'TransExpress',
    immatriculation: 'IJ-012-KL',
    status: 'conforme',
    badgeStatus: 'present',
    documentsExpiredCount: 0
  },
  {
    id: 'CTRL-2026-005',
    date: '2026-07-23',
    tourneeNumber: 'T-2442',
    driverName: 'Ahmed Benali',
    subcontractor: 'SpeedyDelivery',
    immatriculation: 'MN-345-OP',
    status: 'bloquant',
    blockingReason: 'Assurance expirée',
    badgeStatus: 'present',
    documentsExpiredCount: 1
  }
]

export default function InspectionGlobalSummaryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'conforme' | 'bloquant' | 'alerte'>('all')

  // Filtrage intelligent basé sur la recherche textuelle et le statut
  const filteredInspections = useMemo(() => {
    return MOCK_INSPECTIONS.filter((item) => {
      const matchesSearch =
        item.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.immatriculation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tourneeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subcontractor.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || item.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter])

  // Calcul des KPI globaux
  const stats = useMemo(() => {
    const total = MOCK_INSPECTIONS.length
    const conformes = MOCK_INSPECTIONS.filter((i) => i.status === 'conforme').length
    const bloquants = MOCK_INSPECTIONS.filter((i) => i.status === 'bloquant').length
    const alertes = MOCK_INSPECTIONS.filter((i) => i.status === 'alerte').length
    const conformePercentage = total > 0 ? Math.round((conformes / total) * 100) : 0

    return { total, conformes, bloquants, alertes, conformePercentage }
  }, [])

  return (
    <div className="min-h-screen bg-[#1d2a80] p-4 md:p-8 text-white font-sans">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Barre de navigation supérieure */}
        <div className="flex items-center justify-between rounded-xl bg-[#22252a] p-4 shadow-lg border border-[#2d3139]">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#32363e] text-gray-300">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium block">Tableau de bord</span>
              <span className="text-sm font-bold text-white">Synthèse Globale des Contrôles</span>
            </div>
          </div>
          <Link
            to="/"
            className="flex items-center space-x-2 rounded-lg bg-[#32363e] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-700"
          >
            <Home className="h-4 w-4" />
            <span>Accueil</span>
          </Link>
        </div>

        {/* Titre et actions d'export */}
        <div className="flex flex-col md:flex-row md:items-center justify-between rounded-xl bg-[#22252a] p-6 shadow-lg border border-[#2d3139] gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="rounded bg-blue-600 px-2 py-0.5 text-[11px] font-bold uppercase text-white">
                Analytique & Suivi
              </span>
              <span className="rounded bg-[#32363e] px-2 py-0.5 text-[11px] font-bold text-gray-300">
                Mise à jour en temps réel
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Synthèse globale des contrôles chauffeurs
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

        {/* Grille des KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="rounded-xl bg-[#22252a] p-5 border border-[#2d3139] shadow-lg flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Contrôles</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
          </div>

          <div className="rounded-xl bg-[#22252a] p-5 border border-[#2d3139] shadow-lg flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Conformes ({stats.conformePercentage}%)</p>
              <p className="text-2xl font-bold text-emerald-400">{stats.conformes}</p>
            </div>
          </div>

          <div className="rounded-xl bg-[#22252a] p-5 border border-[#2d3139] shadow-lg flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Cas Bloquants</p>
              <p className="text-2xl font-bold text-rose-400">{stats.bloquants}</p>
            </div>
          </div>

          <div className="rounded-xl bg-[#22252a] p-5 border border-[#2d3139] shadow-lg flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Alertes</p>
              <p className="text-2xl font-bold text-amber-400">{stats.alertes}</p>
            </div>
          </div>

        </div>

        {/* Barre de recherche et filtres */}
        <div className="rounded-xl bg-[#22252a] p-4 shadow-lg border border-[#2d3139] flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par chauffeur, immat., tournée..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg bg-[#1a1c23] border border-[#2d3139] pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {(['all', 'conforme', 'bloquant', 'alerte'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#1a1c23] text-gray-400 hover:text-white border border-[#2d3139]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Tableau récapitulatif des données */}
        <div className="rounded-xl bg-[#22252a] shadow-lg border border-[#2d3139] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2d3139] text-gray-400 text-xs uppercase tracking-wider">
                  <th className="p-4">ID / Date</th>
                  <th className="p-4">Tournée</th>
                  <th className="p-4">Chauffeur & Sous-traitant</th>
                  <th className="p-4">Immatriculation</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4">Détails / Motif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d3139]/50 text-sm">
                {filteredInspections.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">
                      Aucun contrôle ne correspond à vos critères de recherche.
                    </td>
                  </tr>
                ) : (
                  filteredInspections.map((item) => (
                    <tr key={item.id} className="hover:bg-[#2c3038]/40 transition-colors">
                      <td className="p-4 font-medium text-white">
                        <div>{item.id}</div>
                        <div className="text-xs text-gray-400">{item.date}</div>
                      </td>
                      <td className="p-4 text-gray-300 font-semibold">{item.tourneeNumber}</td>
                      <td className="p-4">
                        <div className="text-white font-medium">{item.driverName}</div>
                        <div className="text-xs text-gray-400">{item.subcontractor}</div>
                      </td>
                      <td className="p-4 font-mono text-gray-300">{item.immatriculation}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                          item.status === 'conforme'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : item.status === 'bloquant'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400 text-xs">
                        {item.blockingReason || 'Aucune anomalie signalée'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}