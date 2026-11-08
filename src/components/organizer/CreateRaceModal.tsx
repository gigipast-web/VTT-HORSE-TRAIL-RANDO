import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Discipline, RaceStatus } from '../../types';
import { Calendar, Clock, MapPin, Navigation, Tag, DollarSign, Users, Plus, X } from 'lucide-react';

interface CreateRaceModalProps {
  onClose: () => void;
}

export const CreateRaceModal: React.FC<CreateRaceModalProps> = ({ onClose }) => {
  const { activeOrganizer, getOrganizerGpxTracks, createRace } = useApp();

  const organizerGpxList = activeOrganizer ? getOrganizerGpxTracks(activeOrganizer.id) : [];

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [discipline, setDiscipline] = useState<Discipline>('TRAIL');
  const [date, setDate] = useState('2027-06-15');
  const [startTime, setStartTime] = useState('08:00');
  const [location, setLocation] = useState(activeOrganizer ? activeOrganizer.region : '');
  const [description, setDescription] = useState('');
  const [gpxTrackId, setGpxTrackId] = useState(organizerGpxList[0]?.id || '');
  const [maxRunners, setMaxRunners] = useState(200);
  const [priceEur, setPriceEur] = useState(25);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrganizer || !title.trim()) return;

    // Generate random code if empty
    const finalCode = code.trim() ? code.trim().toUpperCase() : `${activeOrganizer.code.slice(0, 3)}${Math.floor(1000 + Math.random() * 9000)}`;

    createRace({
      organizerId: activeOrganizer.id,
      code: finalCode,
      title: title.trim(),
      discipline,
      date,
      startTime,
      location: location.trim(),
      description: description.trim(),
      gpxTrackId: gpxTrackId || undefined,
      maxRunners,
      status: 'UPCOMING',
      edition: 1,
      priceEur
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden p-6 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Créer une Nouvelle Course</h3>
            <p className="text-xs text-slate-400">
              Espace privé : <strong className="text-emerald-400">{activeOrganizer?.name}</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Nom de la course *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ex. Trail des Causses, VTT de l'Ours..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Code d'accès unique (ex. AVE2027)</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Généré automatiquement si vide"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Discipline *</label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value as Discipline)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="TRAIL">🏃 TRAIL</option>
                <option value="VTT">🚴 VTT</option>
                <option value="HORSETRAIL">🐴 HORSETRAIL (Équitation)</option>
                <option value="RANDO">🥾 RANDONNÉE</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Heure de départ *</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Lieu & Commune</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Parcours GPX Associé</label>
              <select
                value={gpxTrackId}
                onChange={(e) => setGpxTrackId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- Sélectionner un fichier GPX --</option>
                {organizerGpxList.map((gpx) => (
                  <option key={gpx.id} value={gpx.id}>
                    {gpx.title} ({gpx.distanceKm} km, D+ {gpx.elevationGainM}m)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Jauge max coureurs</label>
              <input
                type="number"
                value={maxRunners}
                onChange={(e) => setMaxRunners(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Tarif inscription (€)</label>
              <input
                type="number"
                value={priceEur}
                onChange={(e) => setPriceEur(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Description / Reglement</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Inscriptions ouvertes, ravitaillement complet à mi-parcours..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
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
              <Plus className="w-4 h-4" />
              Enregistrer la course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
