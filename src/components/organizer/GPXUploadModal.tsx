import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Discipline, Checkpoint } from '../../types';
import { Upload, FileText, Navigation, Plus, X, Mountain } from 'lucide-react';

interface GPXUploadModalProps {
  onClose: () => void;
}

export const GPXUploadModal: React.FC<GPXUploadModalProps> = ({ onClose }) => {
  const { activeOrganizer, addGpxTrack } = useApp();

  const [title, setTitle] = useState('');
  const [discipline, setDiscipline] = useState<Discipline>('TRAIL');
  const [distanceKm, setDistanceKm] = useState(28.5);
  const [elevationGainM, setElevationGainM] = useState(980);
  const [filename, setFilename] = useState('parcours_custom.gpx');
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFilename(file.name);
      if (!title) {
        setTitle(file.name.replace('.gpx', '').replace(/_/g, ' '));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrganizer || !title.trim()) return;

    // Generate simulated points around organizer region
    const centerLat = activeOrganizer.region.includes('Jura') ? 46.48 : activeOrganizer.region.includes('Alpes') ? 45.92 : 44.35;
    const centerLng = activeOrganizer.region.includes('Jura') ? 5.88 : activeOrganizer.region.includes('Alpes') ? 6.86 : 2.57;

    const points = [];
    const numPoints = 50;
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      points.push({
        lat: Number((centerLat + Math.sin(angle) * 0.03).toFixed(5)),
        lng: Number((centerLng + Math.cos(angle) * 0.04).toFixed(5)),
        ele: Math.round(500 + Math.sin(angle * 2) * (elevationGainM / 2))
      });
    }

    const checkpoints: Checkpoint[] = [
      { id: 'cp-start', name: 'Départ Officiel', kmLocation: 0, lat: points[0].lat, lng: points[0].lng },
      { id: 'cp-mid', name: 'CP1 - Ravitaillement', kmLocation: Math.round(distanceKm / 2), lat: points[25].lat, lng: points[25].lng, cutoffTime: '12:30' },
      { id: 'cp-finish', name: 'Ligne d’Arrivée', kmLocation: distanceKm, lat: points[49].lat, lng: points[49].lng }
    ];

    addGpxTrack({
      organizerId: activeOrganizer.id,
      title: title.trim(),
      discipline,
      distanceKm,
      elevationGainM,
      elevationLossM: elevationGainM,
      filename,
      points,
      checkpoints
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden p-6 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Importer / Créer un Tracé GPX</h3>
            <p className="text-xs text-slate-400">Espace privé de {activeOrganizer?.name}</p>
          </div>
        </div>

        {/* File Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) {
              setFilename(file.name);
              if (!title) setTitle(file.name.replace('.gpx', ''));
            }
          }}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition mb-4 ${
            dragOver ? 'border-emerald-400 bg-emerald-500/10' : 'border-slate-700 bg-slate-950/50 hover:border-slate-600'
          }`}
        >
          <input type="file" accept=".gpx,.xml" onChange={handleFileUpload} className="hidden" id="gpx-file-input" />
          <label htmlFor="gpx-file-input" className="cursor-pointer block">
            <FileText className="w-10 h-10 text-emerald-400 mx-auto mb-2 animate-bounce-slow" />
            <span className="text-xs font-semibold text-white block">Glissez votre fichier .GPX ici</span>
            <span className="text-[11px] text-slate-400 block mt-1">Ou cliquez pour parcourir vos fichiers</span>
            {filename && (
              <span className="inline-block mt-3 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[11px]">
                📄 {filename}
              </span>
            )}
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Titre du parcours *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex. Boucle des Crêtes, Circuit VTT..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Discipline</label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value as Discipline)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="TRAIL">🏃 TRAIL</option>
                <option value="VTT">🚴 VTT</option>
                <option value="HORSETRAIL">🐴 HORSETRAIL</option>
                <option value="RANDO">🥾 RANDONNÉE</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Distance (km)</label>
              <input
                type="number"
                step="0.1"
                required
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Dénivelé D+ (m)</label>
              <input
                type="number"
                required
                value={elevationGainM}
                onChange={(e) => setElevationGainM(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition active:scale-95"
            >
              <Upload className="w-4 h-4" />
              Enregistrer le Tracé GPX
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
