import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, History, BarChart3, ArrowLeft, Eye, CheckCircle2, AlertTriangle, XCircle, Home as HomeIcon, PieChart, ListFilter, Trash2 
} from 'lucide-react';

// ==========================================
// TYPES & INTERFACES
// ==========================================
interface Inspection {
  id: string;
  date: string;
  tournee: string;
  poste: string;
  controleur: string;
  immatriculation: string;
  conducteurNom: string;
  conducteurPrenom: string;
  soustraitant: string;
  badge: 'Oui' | 'Non';
  motifBadge?: string;
  extincteur: 'Oui' | 'Non';
  pneusEtat: 'Conforme' | 'Dégradé' | 'Lisse';
  
  // Documents obligatoires
  licence: 'Présent' | 'Non présenté';
  permis: 'Présent' | 'Non présenté';
  assurance: 'Présent' | 'Non présenté';
  dateAssurance?: string;
  controleTechniqueVehicule: 'Présent' | 'Non présenté';
  dateControleTechniqueVehicule?: string;
  controleTechniqueHayon: 'Présent' | 'Non présenté';
  dateControleTechniqueHayon?: string;
  carteADR: 'Présent' | 'Non présenté';
  vignetteCritAir: 'Présent' | 'Non présenté';
  dateVignetteCritAir?: string;

  // Matériel et équipements
  kitSante: 'Oui' | 'Non';
  kitADR: 'Oui' | 'Non';
  mobicop: 'Oui' | 'Non';
  chasuble: 'Oui' | 'Non';
  chaussuresSecurite: 'Oui' | 'Non';
  gants: 'Oui' | 'Non';
  tenueCorrecte: 'Oui' | 'Non';
  ceintureShintee: 'Oui' | 'Non';

  // Sécurisation & Colis
  rideauArriere: 'Oui' | 'Non';
  porteLaterale: 'Oui' | 'Non';
  cleHayon: 'Oui' | 'Non';
  colisEffectue: 'Oui' | 'Non';
  anomalieColis: 'Oui, anomalies' | 'Non';
  detailAnomalies?: string;

  statut: 'Valide' | 'À surveiller' | 'Bloqué';
}

// Fonction utilitaire pour formater automatiquement la date en jj/mm/aaaa (uniquement des chiffres)
const handleDateInput = (value: string): string => {
  const numbersOnly = value.replace(/\D/g, '');
  const trimmed = numbersOnly.slice(0, 8);
  
  let formatted = '';
  if (trimmed.length > 0) {
    formatted = trimmed.slice(0, 2);
  }
  if (trimmed.length >= 3) {
    formatted += '/' + trimmed.slice(2, 4);
  }
  if (trimmed.length >= 5) {
    formatted += '/' + trimmed.slice(4, 8);
  }
  
  return formatted;
};

// Fonction utilitaire pour vérifier si une date au format jj/mm/aaaa est dépassée par rapport à aujourd'hui
const isDateExpired = (dateString?: string): boolean => {
  if (!dateString || dateString.length !== 10) return false;
  const parts = dateString.split('/');
  if (parts.length !== 3) return false;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  const inputDate = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inputDate < today;
};

// ==========================================
// COMPOSANT CONTENEUR AVEC FILIGRANE & BOUTON ACCUEIL GLOBAL
// ==========================================
function LayoutWithBackground({ children, setView }: { children: React.ReactNode; setView?: (v: string) => void }) {
  return (
    <div className="min-h-screen bg-[#111328] relative overflow-hidden py-8 font-sans">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-5 select-none">
        <div className="flex flex-col items-center">
          <div className="w-[500px] h-[500px] rounded-full bg-white flex items-center justify-center p-12 shadow-2xl">
            <span className="text-[160px] font-black text-[#111328]">G</span>
          </div>
          <span className="text-9xl font-black tracking-widest mt-6 text-white">GEODIS</span>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 mb-4 flex justify-end">
        {setView && (
          <button
            onClick={() => setView('home')}
            className="flex items-center space-x-2 px-3 py-1.5 bg-[#181b3a]/90 hover:bg-[#26294b] border border-[#373b6b] text-white rounded-lg text-sm backdrop-blur transition shadow-lg"
          >
            <HomeIcon size={16} />
            <span>Accueil</span>
          </button>
        )}
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// ==========================================
// COMPOSANT 1 : ACCUEIL (Home)
// ==========================================
function Home({ setView }: { setView: (v: string) => void }) {
  return (
    <LayoutWithBackground>
      <div className="max-w-4xl mx-auto p-6 space-y-8 text-white">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold">Application de Contrôle des Conducteurs & Véhicules</h1>
          <p className="text-indigo-200">Gérez vos inspections, consultez l'historique et suivez les indicateurs clés en temps réel.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => setView('inspection')}
            className="p-6 bg-[#181b3a]/90 backdrop-blur border border-[#373b6b] rounded-xl shadow-xl hover:border-indigo-500 transition flex flex-col items-center text-center space-y-4 group"
          >
            <div className="p-4 bg-indigo-950 text-indigo-400 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition">
              <ClipboardCheck size={32} />
            </div>
            <h2 className="text-xl font-semibold">Formulaire de Contrôle</h2>
            <p className="text-sm text-indigo-300">Effectuer une nouvelle inspection de véhicule et de conducteur.</p>
          </button>

          <button
            onClick={() => setView('history')}
            className="p-6 bg-[#181b3a]/90 backdrop-blur border border-[#373b6b] rounded-xl shadow-xl hover:border-indigo-500 transition flex flex-col items-center text-center space-y-4 group"
          >
            <div className="p-4 bg-indigo-950 text-indigo-400 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition">
              <History size={32} />
            </div>
            <h2 className="text-xl font-semibold">Historique & Détails</h2>
            <p className="text-sm text-indigo-300">Consulter la liste de tous les contrôles effectués et leurs détails.</p>
          </button>

          <button
            onClick={() => setView('summary')}
            className="p-6 bg-[#181b3a]/90 backdrop-blur border border-[#373b6b] rounded-xl shadow-xl hover:border-indigo-500 transition flex flex-col items-center text-center space-y-4 group"
          >
            <div className="p-4 bg-indigo-950 text-indigo-400 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition">
              <BarChart3 size={32} />
            </div>
            <h2 className="text-xl font-semibold">Synthèse Graphique</h2>
            <p className="text-sm text-indigo-300">Analyser les indicateurs clés sous forme de graphiques multiples.</p>
          </button>
        </div>
      </div>
    </LayoutWithBackground>
  );
}

// ==========================================
// COMPOSANT 2 : FORMULAIRE DE CONTRÔLE
// ==========================================
function DriverInspectionApp({ 
  setView, 
  addInspection, 
  onInspectSubmitted 
}: { 
  setView: (v: string) => void; 
  addInspection: (ins: Inspection) => void; 
  onInspectSubmitted: (ins: Inspection) => void; 
}) {
  const initialFormState = {
    tournee: '',
    poste: '',
    controleur: '',
    immatriculation: '',
    conducteurNom: '',
    conducteurPrenom: '',
    soustraitant: '',
    badge: '' as unknown as 'Oui' | 'Non',
    motifBadge: '',
    extincteur: '' as unknown as 'Oui' | 'Non',
    pneusEtat: '',
    
    licence: '' as unknown as 'Présent' | 'Non présenté',
    permis: '' as unknown as 'Présent' | 'Non présenté',
    assurance: '' as unknown as 'Présent' | 'Non présenté',
    dateAssurance: '',
    controleTechniqueVehicule: '' as unknown as 'Présent' | 'Non présenté',
    dateControleTechniqueVehicule: '',
    controleTechniqueHayon: '' as unknown as 'Présent' | 'Non présenté',
    dateControleTechniqueHayon: '',
    carteADR: '' as unknown as 'Présent' | 'Non présenté',
    vignetteCritAir: '' as unknown as 'Présent' | 'Non présenté',
    dateVignetteCritAir: '',

    kitSante: '' as unknown as 'Oui' | 'Non',
    kitADR: '' as unknown as 'Oui' | 'Non',
    mobicop: '' as unknown as 'Oui' | 'Non',
    chasuble: '' as unknown as 'Oui' | 'Non',
    chaussuresSecurite: '' as unknown as 'Oui' | 'Non',
    gants: '' as unknown as 'Oui' | 'Non',
    tenueCorrecte: '' as unknown as 'Oui' | 'Non',
    ceintureShintee: '' as unknown as 'Oui' | 'Non',

    rideauArriere: '' as unknown as 'Oui' | 'Non',
    porteLaterale: '' as unknown as 'Oui' | 'Non',
    cleHayon: '' as unknown as 'Oui' | 'Non',
    colisEffectue: '' as unknown as 'Oui' | 'Non',
    anomalieColis: '' as unknown as 'Oui, anomalies' | 'Non',
    detailAnomalies: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isAssuranceExpired = isDateExpired(formData.dateAssurance);
    const isCTVExpired = isDateExpired(formData.dateControleTechniqueVehicule);
    const isCTHExpired = isDateExpired(formData.dateControleTechniqueHayon);
    const isCritAirExpired = isDateExpired(formData.dateVignetteCritAir);

    let statut: 'Valide' | 'À surveiller' | 'Bloqué' = 'Valide';

    if (
      formData.pneusEtat === 'Lisse' ||
      isAssuranceExpired ||
      isCTVExpired ||
      isCTHExpired ||
      isCritAirExpired
    ) {
      statut = 'Bloqué';
    } else if (
      formData.badge === 'Non' ||
      formData.extincteur === 'Non' || 
      formData.pneusEtat === 'Dégradé' || 
      formData.anomalieColis === 'Oui, anomalies' ||
      formData.vignetteCritAir === 'Non présenté' ||
      formData.licence === 'Non présenté' ||
      formData.permis === 'Non présenté' ||
      formData.assurance === 'Non présenté' ||
      formData.controleTechniqueVehicule === 'Non présenté'
    ) {
      statut = 'À surveiller';
    }

    const newInspection: Inspection = {
      id: 'INS-' + Date.now().toString().slice(-6),
      date: new Date().toLocaleDateString('fr-FR'),
      ...formData as any,
      statut
    };

    addInspection(newInspection);
    onInspectSubmitted(newInspection);
  };

  return (
    <LayoutWithBackground setView={setView}>
      <div className="max-w-4xl mx-auto p-6 space-y-6 text-white">
        <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-indigo-300">
            <ClipboardCheck size={18} />
            <span>Application de contrôle</span>
            <span className="text-gray-500">/</span>
            <span className="text-white font-medium">Formulaire de contrôle</span>
          </div>
          <button onClick={() => setView('home')} className="flex items-center px-3 py-1.5 bg-[#26294b] hover:bg-[#323663] rounded-lg text-sm transition">
            <ArrowLeft size={16} className="mr-2" /> Accueil
          </button>
        </div>

        <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-xl flex items-center justify-between">
          <div>
            <div className="flex space-x-2 mb-2">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded-full">Contrôle en cours</span>
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full">Contrôle chauffeur</span>
            </div>
            <h1 className="text-2xl font-bold">Fiche de contrôle conducteur</h1>
          </div>
          <button type="button" onClick={resetForm} className="flex items-center px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg text-sm transition font-medium">
            Réinitialiser la page
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1 */}
          <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-semibold flex items-center"><span className="text-indigo-400 mr-2">👤</span> 1. Informations de la tournée</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-indigo-300 mb-1">Poste du contrôleur</label>
                <select value={formData.poste} onChange={e => setFormData({...formData, poste: e.target.value})} className="w-full bg-[#111328] border border-[#2d3163] rounded-lg p-2.5 text-sm">
                  <option value="">Sélectionner un poste</option>
                  <option value="Poste A">Poste A</option>
                  <option value="Poste B">Poste B</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-indigo-300 mb-1">Nom du contrôleur</label>
                <input type="text" placeholder="Nom" value={formData.controleur} onChange={e => setFormData({...formData, controleur: e.target.value})} className="w-full bg-[#111328] border border-[#2d3163] rounded-lg p-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-indigo-300 mb-1">Numéro de tournée</label>
                <input type="text" placeholder="Ex. T-2451" value={formData.tournee} onChange={e => setFormData({...formData, tournee: e.target.value})} className="w-full bg-[#111328] border border-[#2d3163] rounded-lg p-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-indigo-300 mb-1">Immatriculation</label>
                <input type="text" placeholder="AA-123-BB" value={formData.immatriculation} onChange={e => setFormData({...formData, immatriculation: e.target.value})} className="w-full bg-[#111328] border border-[#2d3163] rounded-lg p-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-indigo-300 mb-1">Nom du conducteur</label>
                <input type="text" placeholder="Nom" value={formData.conducteurNom} onChange={e => setFormData({...formData, conducteurNom: e.target.value})} className="w-full bg-[#111328] border border-[#2d3163] rounded-lg p-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-indigo-300 mb-1">Prénom du conducteur</label>
                <input type="text" placeholder="Prénom" value={formData.conducteurPrenom} onChange={e => setFormData({...formData, conducteurPrenom: e.target.value})} className="w-full bg-[#111328] border border-[#2d3163] rounded-lg p-2.5 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-indigo-300 mb-1">Nom du sous-traitant</label>
              <input type="text" placeholder="Sous-traitant" value={formData.soustraitant} onChange={e => setFormData({...formData, soustraitant: e.target.value})} className="w-full bg-[#111328] border border-[#2d3163] rounded-lg p-2.5 text-sm md:w-1/3" />
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-semibold flex items-center"><span className="text-indigo-400 mr-2">💳</span> 2. Gestion du badge</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#111328] p-4 rounded-xl border border-[#2d3163]">
                <p className="text-sm mb-3">Badge présent ?</p>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="badge" checked={formData.badge === 'Oui'} onChange={() => setFormData({...formData, badge: 'Oui'})} /> <span>Oui</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="badge" checked={formData.badge === 'Non'} onChange={() => setFormData({...formData, badge: 'Non'})} /> <span>Non</span></label>
                </div>
              </div>
              {formData.badge === 'Non' && (
                <div>
                  <label className="block text-xs text-indigo-300 mb-1">Motif d'absence de badge</label>
                  <input type="text" placeholder="Préciser le motif" value={formData.motifBadge} onChange={e => setFormData({...formData, motifBadge: e.target.value})} className="w-full bg-[#111328] border border-[#2d3163] rounded-lg p-2.5 text-sm" />
                </div>
              )}
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-semibold flex items-center"><span className="text-indigo-400 mr-2">🚚</span> 3. Contrôle du véhicule</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#111328] p-4 rounded-xl border border-[#2d3163]">
                <p className="text-sm mb-3">Extincteur présent ?</p>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="extincteur" checked={formData.extincteur === 'Oui'} onChange={() => setFormData({...formData, extincteur: 'Oui'})} /> <span>Oui</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="extincteur" checked={formData.extincteur === 'Non'} onChange={() => setFormData({...formData, extincteur: 'Non'})} /> <span>Non</span></label>
                </div>
              </div>
              <div className="bg-[#111328] p-4 rounded-xl border border-[#2d3163]">
                <p className="text-sm mb-3">État général des pneus conforme ?</p>
                <select value={formData.pneusEtat} onChange={e => setFormData({...formData, pneusEtat: e.target.value as any})} className="w-full bg-[#181b3a] border border-[#2d3163] rounded-lg p-2 text-sm">
                  <option value="">Sélectionner l'état</option>
                  <option value="Conforme">Conforme</option>
                  <option value="Dégradé">Dégradé</option>
                  <option value="Lisse">Lisse (Bloquant)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-semibold flex items-center"><span className="text-indigo-400 mr-2">📄</span> 4. Vérification des documents obligatoires</h2>
            <p className="text-xs text-indigo-300">Les dates de validité doivent être renseignées au format jj/mm/aaaa (chiffres uniquement). Une date dépassée bloquera le véhicule.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#111328] p-4 rounded-xl border border-[#2d3163]">
                <p className="text-sm mb-3">Licence</p>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="licence" checked={formData.licence === 'Présent'} onChange={() => setFormData({...formData, licence: 'Présent'})} /> <span>Présent</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="licence" checked={formData.licence === 'Non présenté'} onChange={() => setFormData({...formData, licence: 'Non présenté'})} /> <span>Non présenté</span></label>
                </div>
              </div>

              <div className="bg-[#111328] p-4 rounded-xl border border-[#2d3163] space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm">Assurance</p>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-semibold">Date à renseigner</span>
                </div>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="assurance" checked={formData.assurance === 'Présent'} onChange={() => setFormData({...formData, assurance: 'Présent'})} /> <span>Présent</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="assurance" checked={formData.assurance === 'Non présenté'} onChange={() => setFormData({...formData, assurance: 'Non présenté'})} /> <span>Non présenté</span></label>
                </div>
                {formData.assurance === 'Présent' && (
                  <div>
                    <label className="block text-[11px] text-indigo-300 mb-1">Date de validité (jj/mm/aaaa)</label>
                    <input 
                      type="text" 
                      maxLength={10} 
                      placeholder="jj/mm/aaaa" 
                      value={formData.dateAssurance} 
                      onChange={e => setFormData({...formData, dateAssurance: handleDateInput(e.target.value)})} 
                      className="w-full bg-[#181b3a] border border-[#2d3163] rounded p-1.5 text-xs tracking-wider" 
                    />
                  </div>
                )}
              </div>

              <div className="bg-[#111328] p-4 rounded-xl border border-[#2d3163]">
                <p className="text-sm mb-3">Permis de conduire</p>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="permis" checked={formData.permis === 'Présent'} onChange={() => setFormData({...formData, permis: 'Présent'})} /> <span>Présent</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="permis" checked={formData.permis === 'Non présenté'} onChange={() => setFormData({...formData, permis: 'Non présenté'})} /> <span>Non présenté</span></label>
                </div>
              </div>

              <div className="bg-[#111328] p-4 rounded-xl border border-[#2d3163] space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm">Contrôle technique du véhicule</p>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-semibold">Date à renseigner</span>
                </div>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="ctv" checked={formData.controleTechniqueVehicule === 'Présent'} onChange={() => setFormData({...formData, controleTechniqueVehicule: 'Présent'})} /> <span>Présent</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="ctv" checked={formData.controleTechniqueVehicule === 'Non présenté'} onChange={() => setFormData({...formData, controleTechniqueVehicule: 'Non présenté'})} /> <span>Non présenté</span></label>
                </div>
                {formData.controleTechniqueVehicule === 'Présent' && (
                  <div>
                    <label className="block text-[11px] text-indigo-300 mb-1">Date de validité (jj/mm/aaaa)</label>
                    <input 
                      type="text" 
                      maxLength={10} 
                      placeholder="jj/mm/aaaa" 
                      value={formData.dateControleTechniqueVehicule} 
                      onChange={e => setFormData({...formData, dateControleTechniqueVehicule: handleDateInput(e.target.value)})} 
                      className="w-full bg-[#181b3a] border border-[#2d3163] rounded p-1.5 text-xs tracking-wider" 
                    />
                  </div>
                )}
              </div>

              <div className="bg-[#111328] p-4 rounded-xl border border-[#2d3163] space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm">Contrôle technique du hayon</p>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-semibold">Date à renseigner</span>
                </div>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="cth" checked={formData.controleTechniqueHayon === 'Présent'} onChange={() => setFormData({...formData, controleTechniqueHayon: 'Présent'})} /> <span>Présent</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="cth" checked={formData.controleTechniqueHayon === 'Non présenté'} onChange={() => setFormData({...formData, controleTechniqueHayon: 'Non présenté'})} /> <span>Non présenté</span></label>
                </div>
                {formData.controleTechniqueHayon === 'Présent' && (
                  <div>
                    <label className="block text-[11px] text-indigo-300 mb-1">Date de validité (jj/mm/aaaa)</label>
                    <input 
                      type="text" 
                      maxLength={10} 
                      placeholder="jj/mm/aaaa" 
                      value={formData.dateControleTechniqueHayon} 
                      onChange={e => setFormData({...formData, dateControleTechniqueHayon: handleDateInput(e.target.value)})} 
                      className="w-full bg-[#181b3a] border border-[#2d3163] rounded p-1.5 text-xs tracking-wider" 
                    />
                  </div>
                )}
              </div>

              <div className="bg-[#111328] p-4 rounded-xl border border-[#2d3163]">
                <p className="text-sm mb-3">Carte ou attestation ADR</p>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="adr" checked={formData.carteADR === 'Présent'} onChange={() => setFormData({...formData, carteADR: 'Présent'})} /> <span>Présent</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="adr" checked={formData.carteADR === 'Non présenté'} onChange={() => setFormData({...formData, carteADR: 'Non présenté'})} /> <span>Non présenté</span></label>
                </div>
              </div>

              <div className="bg-[#111328] p-4 rounded-xl border border-[#2d3163] space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm">Vignette Crit'Air</p>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-semibold">Date à renseigner</span>
                </div>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="crit" checked={formData.vignetteCritAir === 'Présent'} onChange={() => setFormData({...formData, vignetteCritAir: 'Présent'})} /> <span>Présent</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="crit" checked={formData.vignetteCritAir === 'Non présenté'} onChange={() => setFormData({...formData, vignetteCritAir: 'Non présenté'})} /> <span>Non présenté</span></label>
                </div>
                {formData.vignetteCritAir === 'Présent' && (
                  <div>
                    <label className="block text-[11px] text-indigo-300 mb-1">Date de validité (jj/mm/aaaa)</label>
                    <input 
                      type="text" 
                      maxLength={10} 
                      placeholder="jj/mm/aaaa" 
                      value={formData.dateVignetteCritAir} 
                      onChange={e => setFormData({...formData, dateVignetteCritAir: handleDateInput(e.target.value)})} 
                      className="w-full bg-[#181b3a] border border-[#2d3163] rounded p-1.5 text-xs tracking-wider" 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-semibold flex items-center"><span className="text-indigo-400 mr-2">🦺</span> 5. Vérification du matériel et des équipements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#111328] p-4 rounded-xl border border-[#2d3163]">
                <p className="text-sm mb-3">Kit santé</p>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="ks" checked={formData.kitSante === 'Oui'} onChange={() => setFormData({...formData, kitSante: 'Oui'})} /> <span>Oui</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="ks" checked={formData.kitSante === 'Non'} onChange={() => setFormData({...formData, kitSante: 'Non'})} /> <span>Non</span></label>
                </div>
              </div>
              <div className="bg-[#111328] p-4 rounded-xl border border-[#2d3163]">
                <p className="text-sm mb-3">Kit ADR</p>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="kadr" checked={formData.kitADR === 'Oui'} onChange={() => setFormData({...formData, kitADR: 'Oui'})} /> <span>Oui</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="kadr" checked={formData.kitADR === 'Non'} onChange={() => setFormData({...formData, kitADR: 'Non'})} /> <span>Non</span></label>
                </div>
              </div>
              <div className="bg-[#111328] p-4 rounded-xl border border-[#2d3163]">
                <p className="text-sm mb-3">MOBICOP</p>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="mob" checked={formData.mobicop === 'Oui'} onChange={() => setFormData({...formData, mobicop: 'Oui'})} /> <span>Oui</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="mob" checked={formData.mobicop === 'Non'} onChange={() => setFormData({...formData, mobicop: 'Non'})} /> <span>Non</span></label>
                </div>
              </div>
              <div className="bg-[#111328] p-4 rounded-xl border border-[#2d3163]">
                <p className="text-sm mb-3">Chasuble</p>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="chas" checked={formData.chasuble === 'Oui'} onChange={() => setFormData({...formData, chasuble: 'Oui'})} /> <span>Oui</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="chas" checked={formData.chasuble === 'Non'} onChange={() => setFormData({...formData, chasuble: 'Non'})} /> <span>Non</span></label>
                </div>
              </div>
              <div className="bg-[#111328] p-4 rounded-xl border border-[#2d3163]">
                <p className="text-sm mb-3">Chaussures de sécurité portées</p>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="cs" checked={formData.chaussuresSecurite === 'Oui'} onChange={() => setFormData({...formData, chaussuresSecurite: 'Oui'})} /> <span>Oui</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="cs" checked={formData.chaussuresSecurite === 'Non'} onChange={() => setFormData({...formData, chaussuresSecurite: 'Non'})} /> <span>Non</span></label>
                </div>
              </div>
              <div className="bg-[#111328] p-4 rounded-xl border border-[#2d3163]">
                <p className="text-sm mb-3">Gants</p>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="gants" checked={formData.gants === 'Oui'} onChange={() => setFormData({...formData, gants: 'Oui'})} /> <span>Oui</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="gants" checked={formData.gants === 'Non'} onChange={() => setFormData({...formData, gants: 'Non'})} /> <span>Non</span></label>
                </div>
              </div>
              <div className="bg-[#111328] p-4 rounded-xl border border-[#2d3163]">
                <p className="text-sm mb-3">Tenue correcte</p>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="tenue" checked={formData.tenueCorrecte === 'Oui'} onChange={() => setFormData({...formData, tenueCorrecte: 'Oui'})} /> <span>Oui</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="tenue" checked={formData.tenueCorrecte === 'Non'} onChange={() => setFormData({...formData, tenueCorrecte: 'Non'})} /> <span>Non</span></label>
                </div>
              </div>
              <div className="bg-[#111328] p-4 rounded-xl border border-[#2d3163]">
                <p className="text-sm mb-3">Ceinture de sécurité SHINTEE</p>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="ceint" checked={formData.ceintureShintee === 'Oui'} onChange={() => setFormData({...formData, ceintureShintee: 'Oui'})} /> <span>Oui</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="ceint" checked={formData.ceintureShintee === 'Non'} onChange={() => setFormData({...formData, ceintureShintee: 'Non'})} /> <span>Non</span></label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-semibold flex items-center"><span className="text-indigo-400 mr-2">🔒</span> 6. Contrôle de la sécurisation du véhicule</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#111328] p-4 rounded-xl border border-[#2d3163]">
                <p className="text-sm mb-3">Rideau / porte arrière verrouillé(e)</p>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="rideau" checked={formData.rideauArriere === 'Oui'} onChange={() => setFormData({...formData, rideauArriere: 'Oui'})} /> <span>Oui</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="rideau" checked={formData.rideauArriere === 'Non'} onChange={() => setFormData({...formData, rideauArriere: 'Non'})} /> <span>Non</span></label>
                </div>
              </div>
              <div className="bg-[#111328] p-4 rounded-xl border border-[#2d3163]">
                <p className="text-sm mb-3">Porte latérale verrouillée</p>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="lat" checked={formData.porteLaterale === 'Oui'} onChange={() => setFormData({...formData, porteLaterale: 'Oui'})} /> <span>Oui</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="lat" checked={formData.porteLaterale === 'Non'} onChange={() => setFormData({...formData, porteLaterale: 'Non'})} /> <span>Non</span></label>
                </div>
              </div>
              <div className="bg-[#111328] p-4 rounded-xl border border-[#2d3163]">
                <p className="text-sm mb-3">Clé présente sur le hayon</p>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="hayon" checked={formData.cleHayon === 'Oui'} onChange={() => setFormData({...formData, cleHayon: 'Oui'})} /> <span>Oui</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="hayon" checked={formData.cleHayon === 'Non'} onChange={() => setFormData({...formData, cleHayon: 'Non'})} /> <span>Non</span></label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 7 */}
          <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-semibold flex items-center"><span className="text-indigo-400 mr-2">📦</span> 7. Contrôle des colis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#111328] p-4 rounded-xl border border-[#2d3163]">
                <p className="text-sm mb-3">Contrôle des colis effectué ?</p>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="colis" checked={formData.colisEffectue === 'Oui'} onChange={() => setFormData({...formData, colisEffectue: 'Oui'})} /> <span>Oui</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="colis" checked={formData.colisEffectue === 'Non'} onChange={() => setFormData({...formData, colisEffectue: 'Non'})} /> <span>Non</span></label>
                </div>
              </div>
              <div className="bg-[#111328] p-4 rounded-xl border border-[#2d3163]">
                <p className="text-sm mb-3">Des anomalies colis ont-elles été constatées ?</p>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="anoColis" checked={formData.anomalieColis === 'Oui, anomalies'} onChange={() => setFormData({...formData, anomalieColis: 'Oui, anomalies'})} /> <span>Oui, anomalies</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="anoColis" checked={formData.anomalieColis === 'Non'} onChange={() => setFormData({...formData, anomalieColis: 'Non'})} /> <span>Non</span></label>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs text-indigo-300 mb-1">Détail des anomalies constatées</label>
              <textarea rows={3} placeholder="Décrivez les colis concernés..." value={formData.detailAnomalies} onChange={e => setFormData({...formData, detailAnomalies: e.target.value})} className="w-full bg-[#111328] border border-[#2d3163] rounded-lg p-2.5 text-sm"></textarea>
            </div>
          </div>

          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-bold p-3 rounded-xl transition flex items-center justify-center space-x-2">
            <CheckCircle2 size={20} />
            <span>Valider la fiche</span>
          </button>
        </form>
      </div>
    </LayoutWithBackground>
  );
}

// ==========================================
// COMPOSANT 3 : HISTORIQUE & DÉTAILS
// ==========================================
function HistoryPage({ setView, inspections, setInspections }: { setView: (v: string) => void; inspections: Inspection[]; setInspections: React.Dispatch<React.SetStateAction<Inspection[]>> }) {
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleResetHistoryAttempt = () => {
    if (pinInput === 'Raph') {
      setInspections([]);
      localStorage.removeItem('inspections_data');
      setShowPinModal(false);
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  return (
    <LayoutWithBackground setView={setView}>
      <div className="max-w-4xl mx-auto p-6 space-y-6 text-white">
        <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-4 rounded-xl flex items-center justify-between">
          <button onClick={() => setView('home')} className="flex items-center px-3 py-1.5 bg-[#26294b] hover:bg-[#323663] rounded-lg text-sm transition">
            <ArrowLeft size={16} className="mr-2" /> Retour à l'accueil
          </button>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold">Historique & Synthèse détaillée</h1>
            {inspections.length > 0 && (
              <button 
                onClick={() => { setShowPinModal(true); setPinInput(''); setPinError(false); }}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 rounded-lg text-sm transition font-medium"
              >
                <Trash2 size={15} />
                <span>Réinitialiser l'historique</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal de vérification du code PIN */}
        {showPinModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#181b3a] border border-[#373b6b] p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold">Sécurité - Réinitialisation</h3>
              <p className="text-xs text-indigo-300">Veuillez entrer le code administrateur pour effacer tout l'historique.</p>
              
              <input 
                type="password" 
                maxLength={4}
                placeholder="Code" 
                value={pinInput} 
                onChange={e => { setPinInput(e.target.value); setPinError(false); }}
                className="w-full bg-[#111328] border border-[#2d3163] rounded-lg p-2.5 text-center text-lg tracking-widest text-white"
              />

              {pinError && (
                <p className="text-xs text-rose-400 font-semibold text-center">Code incorrect. Réinitialisation annulée.</p>
              )}

              <div className="flex space-x-3 pt-2">
                <button 
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 px-4 py-2 bg-[#26294b] hover:bg-[#323663] text-indigo-200 rounded-lg text-sm transition"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleResetHistoryAttempt}
                  className="flex-1 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-gray-950 font-bold rounded-lg text-sm transition"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedInspection ? (
          <InspectionSummaryDetail inspection={selectedInspection} onBack={() => setSelectedInspection(null)} />
        ) : (
          <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] rounded-xl overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#111328] text-indigo-300 text-xs uppercase border-b border-[#2d3163]">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Tournée</th>
                  <th className="p-4">Conducteur</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d3163] text-sm">
                {inspections.length === 0 ? (
                  <tr><td colSpan={6} className="p-6 text-center text-indigo-300">Aucun historique disponible.</td></tr>
                ) : (
                  inspections.map(ins => (
                    <tr key={ins.id} className="hover:bg-[#202448] transition">
                      <td className="p-4 font-medium">{ins.id}</td>
                      <td className="p-4 text-indigo-300">{ins.date}</td>
                      <td className="p-4 text-indigo-300">{ins.tournee}</td>
                      <td className="p-4 text-indigo-300">{ins.conducteurNom}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          ins.statut === 'Valide' ? 'bg-emerald-500/20 text-emerald-400' :
                          ins.statut === 'À surveiller' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>{ins.statut}</span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => setSelectedInspection(ins)} className="text-indigo-400 hover:text-white flex items-center ml-auto">
                          <Eye size={16} className="mr-1" /> Voir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </LayoutWithBackground>
  );
}

// ==========================================
// COMPOSANT SOUS-SYNTHÈSE PIXEL-PERFECT (AVEC DÉTAIL DU BADGE)
// ==========================================
function InspectionSummaryDetail({ inspection, onBack }: { inspection: Inspection; onBack: () => void }) {
  const isAssuranceExpired = isDateExpired(inspection.dateAssurance);
  const isCTVExpired = isDateExpired(inspection.dateControleTechniqueVehicule);
  const isCTHExpired = isDateExpired(inspection.dateControleTechniqueHayon);
  const isCritAirExpired = isDateExpired(inspection.dateVignetteCritAir);

  return (
    <div className="space-y-6 text-white">
      <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                inspection.statut === 'Bloqué' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {inspection.statut === 'Bloqué' ? 'Véhicule bloqué' : 'Véhicule non bloqué'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-300 border border-[#373b6b]">
                Synthèse du contrôle ({inspection.id})
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Synthèse du contrôle chauffeur</h1>
            <p className="text-sm text-indigo-300">Détails de l'inspection pour la tournée {inspection.tournee || 'en cours'}.</p>
          </div>
          <button onClick={onBack} className="px-4 py-2 bg-[#23274d] hover:bg-[#2e3366] text-indigo-200 border border-[#3b407a] rounded-xl text-sm transition font-medium">
            Retour 
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-2xl shadow-xl">
          <p className="text-xs text-indigo-300 font-medium mb-1">Blocages</p>
          <p className="text-4xl font-extrabold">{inspection.statut === 'Bloqué' ? 1 : 0}</p>
        </div>
        <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-2xl shadow-xl">
          <p className="text-xs text-indigo-300 font-medium mb-1">Points d'attention</p>
          <p className="text-4xl font-extrabold">{inspection.statut === 'À surveiller' ? 1 : 0}</p>
        </div>
        <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-2xl shadow-xl">
          <p className="text-xs text-indigo-300 font-medium mb-1">Éléments restants</p>
          <p className="text-4xl font-extrabold">0</p>
        </div>
      </div>

      {/* NOUVELLE SECTION : Détail du taux / statut de présence du badge */}
      <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-2xl shadow-xl space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-semibold flex items-center">
            <span className="text-indigo-400 mr-2 text-lg">💳</span> Taux et État de présence du Badge
          </h2>
          <p className="text-xs text-indigo-300">Vérification de la conformité du badge conducteur pour ce contrôle.</p>
        </div>
        
        <div className="bg-[#111328] border border-[#2d3163] p-4 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <p className="text-xs text-indigo-300 font-medium">Statut du badge</p>
            <p className="font-bold text-base mt-0.5 flex items-center">
              {inspection.badge === 'Oui' ? (
                <span className="text-emerald-400 flex items-center"><CheckCircle2 size={16} className="mr-1.5" /> Badge Présent (100%)</span>
              ) : inspection.badge === 'Non' ? (
                <span className="text-amber-400 flex items-center"><AlertTriangle size={16} className="mr-1.5" /> Badge Absent (Point d'attention)</span>
              ) : (
                <span className="text-indigo-300">Non renseigné</span>
              )}
            </p>
          </div>
          {inspection.badge === 'Non' && (
            <div>
              <p className="text-xs text-indigo-300 font-medium">Motif d'absence déclaré</p>
              <p className="font-semibold text-sm text-amber-300 mt-0.5">{inspection.motifBadge || 'Aucun motif précisé'}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-2xl shadow-xl space-y-6 relative">
        <div className="space-y-1">
          <h2 className="text-base font-semibold flex items-center">
            <span className="text-indigo-400 mr-2 text-lg">👤</span> Informations principales
          </h2>
          <p className="text-xs text-indigo-300">Identité du contrôleur, du conducteur et de la tournée.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-sm pt-2">
          <div className="space-y-1">
            <p className="text-xs text-indigo-400 font-medium">Poste du contrôleur</p>
            <p className="font-semibold">{inspection.poste || 'Non renseigné'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-indigo-400 font-medium">Contrôleur</p>
            <p className="font-semibold">{inspection.controleur || 'Non renseigné'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-indigo-400 font-medium">Date</p>
            <p className="font-semibold">{inspection.date || 'Non renseignée'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-indigo-400 font-medium">Numéro de tournée</p>
            <p className="font-semibold">{inspection.tournee || 'Non renseigné'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-indigo-400 font-medium">Immatriculation</p>
            <p className="font-semibold">{inspection.immatriculation || 'Non renseigné'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-indigo-400 font-medium">Conducteur</p>
            <p className="font-semibold">{inspection.conducteurNom ? `${inspection.conducteurNom} ${inspection.conducteurPrenom}` : 'Non renseigné'}</p>
          </div>
          <div className="md:col-span-2 space-y-1">
            <p className="text-xs text-indigo-400 font-medium">Sous-traitant</p>
            <p className="font-semibold">{inspection.soustraitant || 'Non renseigné'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-2xl shadow-xl space-y-3">
          <h2 className="text-base font-semibold flex items-center text-rose-400">
            <XCircle size={18} className="mr-2" /> Motifs de blocage
          </h2>
          <p className="text-xs text-indigo-300">Les éléments empêchant la mise en circulation (pneus lisses ou dates dépassées).</p>
          <div className="pt-2 text-sm space-y-1">
            {inspection.pneusEtat === 'Lisse' && (
              <p className="text-rose-300 font-medium flex items-center"><span className="mr-2">❌</span> Pneus lisses (Bloquant).</p>
            )}
            {isAssuranceExpired && (
              <p className="text-rose-300 font-medium flex items-center"><span className="mr-2">❌</span> Date d'assurance dépassée ({inspection.dateAssurance}).</p>
            )}
            {isCTVExpired && (
              <p className="text-rose-300 font-medium flex items-center"><span className="mr-2">❌</span> Contrôle technique véhicule dépassé ({inspection.dateControleTechniqueVehicule}).</p>
            )}
            {isCTHExpired && (
              <p className="text-rose-300 font-medium flex items-center"><span className="mr-2">❌</span> Contrôle technique hayon dépassé ({inspection.dateControleTechniqueHayon}).</p>
            )}
            {isCritAirExpired && (
              <p className="text-rose-300 font-medium flex items-center"><span className="mr-2">❌</span> Vignette Crit'Air expirée ({inspection.dateVignetteCritAir}).</p>
            )}
            {inspection.statut !== 'Bloqué' && (
              <p className="text-indigo-300 font-medium">Aucun motif de blocage détecté.</p>
            )}
          </div>
        </div>

        <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-2xl shadow-xl space-y-3">
          <h2 className="text-base font-semibold flex items-center text-amber-400">
            <AlertTriangle size={18} className="mr-2" /> Points d'attention
          </h2>
          <p className="text-xs text-indigo-300">Les anomalies non bloquantes ou informations à compléter.</p>
          <div className="pt-2 text-sm space-y-1">
            {inspection.badge === 'Non' && (
              <p className="text-amber-300 font-medium flex items-center"><span className="mr-2">⚠️</span> Badge conducteur absent.</p>
            )}
            {inspection.vignetteCritAir === 'Non présenté' && (
              <p className="text-amber-300 font-medium flex items-center"><span className="mr-2">⚠️</span> Vignette Crit'Air non présenté(e).</p>
            )}
            {inspection.extincteur === 'Non' && (
              <p className="text-amber-300 font-medium flex items-center"><span className="mr-2">⚠️</span> Extincteur absent.</p>
            )}
            {inspection.pneusEtat === 'Dégradé' && (
              <p className="text-amber-300 font-medium flex items-center"><span className="mr-2">⚠️</span> Pneus dégradés.</p>
            )}
            {(inspection.licence === 'Non présenté' || inspection.permis === 'Non présenté' || inspection.assurance === 'Non présenté' || inspection.controleTechniqueVehicule === 'Non présenté') && (
              <p className="text-amber-300 font-medium flex items-center"><span className="mr-2">⚠️</span> Élément obligatoire manquant.</p>
            )}
            {inspection.badge !== 'Non' && inspection.vignetteCritAir !== 'Non présenté' && inspection.extincteur !== 'Non' && inspection.pneusEtat !== 'Dégradé' && inspection.licence !== 'Non présenté' && inspection.permis !== 'Non présenté' && inspection.assurance !== 'Non présenté' && inspection.controleTechniqueVehicule !== 'Non présenté' && inspection.statut !== 'À surveiller' && (
              <p className="text-indigo-300 font-medium">Aucun point d'attention particulier.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-2xl shadow-xl space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-semibold flex items-center">
            <span className="text-indigo-400 mr-2 text-lg">🚚</span> Statut final
          </h2>
          <p className="text-xs text-indigo-300">Décision rapide sur le départ du véhicule.</p>
        </div>
        <div className="bg-[#111328] border border-[#2d3163] p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-indigo-300 font-medium">Décision</p>
            <p className="font-bold text-base mt-0.5">
              {inspection.statut === 'Bloqué' ? 'Véhicule interdit au départ' : 'Véhicule autorisé au départ'}
            </p>
          </div>
          <span className={`px-4 py-1.5 rounded-lg text-xs font-bold ${
            inspection.statut === 'Bloqué' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            {inspection.statut === 'Bloqué' ? 'Bloqué' : 'Autorisé'}
          </span>
        </div>
      </div>

      <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-2xl shadow-xl space-y-2">
        <h2 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider">Anomalies colis</h2>
        <p className="text-sm font-medium">{inspection.detailAnomalies || 'Aucune anomalie colis renseignée.'}</p>
      </div>
    </div>
  );
}

// ==========================================
// COMPOSANT 4 : SYNTHÈSE GRAPHIQUE MULTIPLE
// ==========================================
function InspectionGlobalSummaryPage({ setView, inspections }: { setView: (v: string) => void; inspections: Inspection[] }) {
  const totalInspections = inspections.length;
  const alertes = inspections.filter(i => i.statut === 'À surveiller').length;
  const bloques = inspections.filter(i => i.statut === 'Bloqué').length;
  const valides = inspections.filter(i => i.statut === 'Valide').length;

  const validPercent = totalInspections > 0 ? Math.round((valides / totalInspections) * 100) : 0;
  const warningPercent = totalInspections > 0 ? Math.round((alertes / totalInspections) * 100) : 0;
  const blockedPercent = totalInspections > 0 ? Math.round((bloques / totalInspections) * 100) : 0;

  const badgeOui = inspections.filter(i => i.badge === 'Oui').length;
  const badgeNon = inspections.filter(i => i.badge === 'Non').length;
  const badgeOuiPercent = totalInspections > 0 ? Math.round((badgeOui / totalInspections) * 100) : 0;
  const badgeNonPercent = totalInspections > 0 ? Math.round((badgeNon / totalInspections) * 100) : 0;

  const countDocPresent = (key: keyof Inspection, val: string) => inspections.filter(i => i[key] === val).length;

  const licencePresent = countDocPresent('licence', 'Présent');
  const permisPresent = countDocPresent('permis', 'Présent');
  const assurancePresent = countDocPresent('assurance', 'Présent');
  const ctvPresent = countDocPresent('controleTechniqueVehicule', 'Présent');
  const cthPresent = countDocPresent('controleTechniqueHayon', 'Présent');
  const adrPresent = countDocPresent('carteADR', 'Présent');
  const critAirPresent = countDocPresent('vignetteCritAir', 'Présent');

  return (
    <LayoutWithBackground setView={setView}>
      <div className="max-w-4xl mx-auto p-6 space-y-6 text-white">
        <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-indigo-300">
            <ClipboardCheck size={18} />
            <span>Application de contrôle</span>
            <span className="text-gray-500">/</span>
            <span className="text-white font-medium">Synthèse Graphique Globale</span>
          </div>
          <button onClick={() => setView('home')} className="flex items-center px-3 py-1.5 bg-[#26294b] hover:bg-[#323663] rounded-lg text-sm transition">
            Accueil
          </button>
        </div>

        <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-xl space-y-2">
          <h1 className="text-2xl font-bold">Tableau de bord & Indicateurs graphiques</h1>
          <p className="text-sm text-indigo-300">
            Analyse visuelle multi-graphiques de l'état de la flotte, des badges et des documents obligatoires.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-xl shadow-xl flex flex-col justify-between">
            <p className="text-xs text-indigo-300 mb-1 font-medium">Contrôles Valides</p>
            <div className="flex items-baseline justify-between mt-2">
              <p className="text-3xl font-extrabold text-emerald-400">{valides}</p>
              <span className="text-sm font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{validPercent}%</span>
            </div>
          </div>
          <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-xl shadow-xl flex flex-col justify-between">
            <p className="text-xs text-indigo-300 mb-1 font-medium">À surveiller / Points d'attention</p>
            <div className="flex items-baseline justify-between mt-2">
              <p className="text-3xl font-extrabold text-amber-400">{alertes}</p>
              <span className="text-sm font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">{warningPercent}%</span>
            </div>
          </div>
          <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-xl shadow-xl flex flex-col justify-between">
            <p className="text-xs text-indigo-300 mb-1 font-medium">Véhicules Bloqués</p>
            <div className="flex items-baseline justify-between mt-2">
              <p className="text-3xl font-extrabold text-rose-400">{bloques}</p>
              <span className="text-sm font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">{blockedPercent}%</span>
            </div>
          </div>
        </div>

        {/* GRAPHIQUE : Présence des badges */}
        <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-xl space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold">Taux de présence des badges</h2>
            <span className="text-xs text-indigo-300">Total fiches : {totalInspections}</span>
          </div>

          {totalInspections === 0 ? (
            <p className="text-sm text-indigo-300 text-center py-6">Aucune donnée disponible.</p>
          ) : (
            <div className="space-y-4">
              <div className="w-full h-4 bg-[#111328] rounded-full overflow-hidden flex border border-[#2d3163]">
                <div style={{ width: `${badgeOuiPercent}%` }} className="bg-indigo-500 transition-all duration-500" title="Badge Présent"></div>
                <div style={{ width: `${badgeNonPercent}%` }} className="bg-rose-500 transition-all duration-500" title="Badge Absent"></div>
              </div>

              <div className="flex justify-center space-x-8 text-xs font-medium pt-2">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                  <span>Badge Présent ({badgeOui})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  <span>Badge Absent ({badgeNon})</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* GRAPHIQUE : Présence des documents obligatoires */}
        <div className="bg-[#181b3a]/90 backdrop-blur border border-[#2d3163] p-6 rounded-xl space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold">Taux de présence des documents obligatoires</h2>
            <span className="text-xs text-indigo-300">Validations par type de document</span>
          </div>

          {totalInspections === 0 ? (
            <p className="text-sm text-indigo-300 text-center py-6">Aucune donnée disponible.</p>
          ) : (
            <div className="space-y-4 text-xs">
              {[
                { label: 'Licence', count: licencePresent },
                { label: 'Permis de conduire', count: permisPresent },
                { label: 'Assurance', count: assurancePresent },
                { label: 'Contrôle Technique Véhicule', count: ctvPresent },
                { label: 'Contrôle Technique Hayon', count: cthPresent },
                { label: 'Carte ADR', count: adrPresent },
                { label: "Vignette Crit'Air", count: critAirPresent },
              ].map((doc, index) => {
                const percent = totalInspections > 0 ? Math.round((doc.count / totalInspections) * 100) : 0;
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-indigo-200 font-medium">
                      <span>{doc.label}</span>
                      <span>{doc.count} / {totalInspections} ({percent}%)</span>
                    </div>
                    <div className="w-full h-3 bg-[#111328] rounded-full overflow-hidden flex border border-[#2d3163]">
                      <div style={{ width: `${percent}%` }} className="bg-emerald-400 transition-all duration-500"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </LayoutWithBackground>
  );
}

// ==========================================
// COMPOSANT PRINCIPAL (App / Routeur)
// ==========================================
export default function App() {
  const [view, setView] = useState('home');
  const [inspections, setInspections] = useState<Inspection[]>(() => {
    const saved = localStorage.getItem('inspections_data');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [recentlySubmittedInspection, setRecentlySubmittedInspection] = useState<Inspection | null>(null);

  useEffect(() => {
    localStorage.setItem('inspections_data', JSON.stringify(inspections));
  }, [inspections]);

  const addInspection = (newIns: Inspection) => {
    setInspections([newIns, ...inspections]);
  };

  return (
    <>
      {view === 'home' && <Home setView={setView} />}
      {view === 'inspection' && (
        recentlySubmittedInspection ? (
          <LayoutWithBackground setView={setView}>
            <div className="max-w-4xl mx-auto p-6">
              <InspectionSummaryDetail 
                inspection={recentlySubmittedInspection} 
                onBack={() => {
                  setRecentlySubmittedInspection(null);
                }} 
              />
            </div>
          </LayoutWithBackground>
        ) : (
          <DriverInspectionApp 
            setView={setView} 
            addInspection={addInspection} 
            onInspectSubmitted={(ins) => setRecentlySubmittedInspection(ins)} 
          />
        )
      )}
      {view === 'history' && <HistoryPage setView={setView} inspections={inspections} setInspections={setInspections} />}
      {view === 'summary' && <InspectionGlobalSummaryPage setView={setView} inspections={inspections} />}
    </>
  );
}