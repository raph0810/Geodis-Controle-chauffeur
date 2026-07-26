import React from 'react'
import { FileText, History, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1d2a80] p-8 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        
        <div className="rounded-xl bg-[#22252a] p-8 shadow-lg">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Accueil
          </span>
          <h1 className="mt-1 text-3xl font-bold text-white">
            Tableau d’accueil du contrôle conducteur
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Accédez rapidement au formulaire de contrôle, à l'historique des contrôles et à la synthèse globale regroupant la synthèse détaillée et la synthèse graphique.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
          <div className="flex flex-col justify-between rounded-xl bg-[#22252a] p-6 shadow-lg">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#32363e] text-white">
                <FileText className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">
                Formulaire de contrôle
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Remplissez une nouvelle fiche de contrôle conducteur et consultez sa synthèse individuelle.
              </p>
            </div>
            <Link
              to="/inspection"
              className="mt-6 w-full rounded-lg bg-white py-2.5 text-center text-sm font-semibold text-black transition-colors hover:bg-gray-100"
            >
              Ouvrir le formulaire
            </Link>
          </div>

          <div className="flex flex-col justify-between rounded-xl bg-[#22252a] p-6 shadow-lg">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#32363e] text-white">
                <History className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">
                Historique de contrôle
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Retrouvez l'historique complet de tous les contrôles validés avec leur statut et les points clés.
              </p>
            </div>
            <Link
              to="/history"
              className="mt-6 w-full rounded-lg bg-white py-2.5 text-center text-sm font-semibold text-black transition-colors hover:bg-gray-100"
            >
              Voir l'historique
            </Link>
          </div>

          <div className="flex flex-col justify-between rounded-xl bg-[#22252a] p-6 shadow-lg">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#32363e] text-white">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">
                Synthèse globale
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Accédez à la synthèse détaillée et à la synthèse graphique de l'ensemble de tous les formulaires enregistrés.
              </p>
            </div>
            <Link
              to="/summary"
              className="mt-6 w-full rounded-lg bg-white py-2.5 text-center text-sm font-semibold text-black transition-colors hover:bg-gray-100"
            >
              Voir la synthèse globale
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}