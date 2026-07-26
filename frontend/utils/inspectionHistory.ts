export interface InspectionEntry {
  id: string;
  driverName: string;
  vehiclePlate: string;
  date: string;
  status: 'Valide' | 'Bloqué' | 'À surveiller';
  packageAnomalies: boolean;
  comments?: string;
}

const STORAGE_KEY = 'driver-inspection-history';

export function loadInspectionHistory(): InspectionEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Erreur lors du chargement de l'historique", error);
    return [];
  }
}

export function saveInspectionHistory(history: InspectionEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'historique", error);
  }
}

export function generateInspectionStats(history: InspectionEntry[]) {
  return {
    total: history.length,
    valid: history.filter(item => item.status === 'Valide').length,
    blocked: history.filter(item => item.status === 'Bloqué').length,
    warning: history.filter(item => item.status === 'À surveiller').length,
    anomaliesCount: history.filter(item => item.packageAnomalies).length,
  };
}
```[cite: 12]

---

## 2. Composant de contrôle (`DriverInspectionApp.tsx`)

Il gère la saisie d'un nouveau contrôle et met à jour instantanément la liste locale[cite: 10].

```tsx
import React, { useState, useEffect } from 'react';
import { InspectionEntry, loadInspectionHistory, saveInspectionHistory } from './inspectionHistory';

export function DriverInspectionApp() {
  const [history, setHistory] = useState<InspectionEntry[]>([]);
  const [driverName, setDriverName] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [status, setStatus] = useState<'Valide' | 'Bloqué' | 'À surveiller'>('Valide');
  const [packageAnomalies, setPackageAnomalies] = useState(false);
  const [comments, setComments] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setHistory(loadInspectionHistory());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: InspectionEntry = {
      id: Date.now().toString(),
      driverName,
      vehiclePlate,
      date: new Date().toISOString(),
      status,
      packageAnomalies,
      comments,
    };

    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    saveInspectionHistory(updatedHistory);

    // Réinitialisation du formulaire
    setDriverName('');
    setVehiclePlate('');
    setStatus('Valide');
    setPackageAnomalies(false);
    setComments('');
    alert('Contrôle enregistré avec succès !');
  };

  const filteredHistory = history.filter(
    item =>
      item.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Nouveau Contrôle Chauffeur</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded mb-6 space-y-4">
        <div>
          <label className="block font-medium">Nom du chauffeur</label>
          <input
            type="text"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Immatriculation du véhicule</label>
          <input
            type="text"
            value={vehiclePlate}
            onChange={(e) => setVehiclePlate(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Statut</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full border p-2 rounded"
          >
            <option value="Valide">Valide</option>
            <option value="Bloqué">Bloqué</option>
            <option value="À surveiller">À surveiller</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={packageAnomalies}
            onChange={(e) => setPackageAnomalies(e.target.checked)}
            id="anomalies"
          />
          <label htmlFor="anomalies">Anomalies de colis détectées</label>
        </div>
        <div>
          <label className="block font-medium">Commentaires</label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Enregistrer le contrôle
        </button>
      </form>
    </div>
  );
}
```[cite: 10]

---

## 3. Page d'Historique Global (`HistoryPage.tsx`)

Composant dédié à la route `/history` pour consulter l'intégralité des rapports enregistrés.

```tsx
import React, { useState, useEffect } from 'react';
import { InspectionEntry, loadInspectionHistory } from './inspectionHistory';

export function HistoryPage() {
  const [history, setHistory] = useState<InspectionEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setHistory(loadInspectionHistory());
  }, []);

  const filteredHistory = history.filter(
    item =>
      item.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Historique Global des Contrôles</h2>
      <input
        type="text"
        placeholder="Rechercher par chauffeur ou immatriculation..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />
      {filteredHistory.length === 0 ? (
        <p className="text-gray-500">Aucun contrôle trouvé.</p>
      ) : (
        <ul className="space-y-2">
          {filteredHistory.map((item) => (
            <li key={item.id} className="bg-white p-4 shadow rounded flex justify-between items-center">
              <div>
                <p className="font-bold">{item.driverName} - {item.vehiclePlate}</p>
                <p className="text-sm text-gray-600">Date : {new Date(item.date).toLocaleDateString()}</p>
                {item.packageAnomalies && <p className="text-sm text-red-600 font-semibold">Anomalie de colis signalée</p>}
                {item.comments && <p className="text-sm italic">Remarque : {item.comments}</p>}
              </div>
              <div>
                <span className={`px-3 py-1 rounded text-white text-sm font-medium ${
                  item.status === 'Valide' ? 'bg-green-500' :
                  item.status === 'Bloqué' ? 'bg-red-500' : 'bg-yellow-500'
                }`}>
                  {item.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}