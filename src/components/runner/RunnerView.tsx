import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Race, GPXTrack, Runner } from '../../types';
import { GPXMap } from '../GPXMap';
import {
  Key,
  QrCode,
  Download,
  CheckCircle2,
  Navigation,
  Flag,
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  Phone,
  AlertTriangle,
  Search,
  Sparkles,
  Camera,
  ArrowRight
} from 'lucide-react';

export const RunnerView: React.FC = () => {
  const {
    runnerRaceCode,
    setRunnerRaceCode,
    getRaceByCode,
    getGpxForRace,
    getRunnersForRace,
    registerRunner,
    runners,
    organizers
  } = useApp();

  const [inputCode, setInputCode] = useState(runnerRaceCode || 'AVE2027');
  const [activeRace, setActiveRace] = useState<Race | undefined>(getRaceByCode(runnerRaceCode || 'AVE2027'));
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [registeredRunner, setRegisteredRunner] = useState<Runner | undefined>(undefined);

  // Registration Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Senior H');
  const [emergencyPhone, setEmergencyPhone] = useState('06 12 34 56 78');

  useEffect(() => {
    const race = getRaceByCode(runnerRaceCode);
    setActiveRace(race);
  }, [runnerRaceCode, getRaceByCode]);

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const race = getRaceByCode(inputCode);
    if (race) {
      setActiveRace(race);
      setRunnerRaceCode(race.code);
    } else {
      alert(`Course avec le code ${inputCode.toUpperCase()} introuvable.`);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRace || !firstName.trim() || !lastName.trim()) return;

    const newRunner = registerRunner({
      raceId: activeRace.id,
      organizerId: activeRace.organizerId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      category,
      emergencyContact: `Proche ${lastName}`,
      emergencyPhone
    });

    setRegisteredRunner(newRunner);

    // Auto-download GPX file as requested in prompt:
    // "Une fois inscrit, il télécharge automatiquement le parcours GPX correspondant."
    const gpxTrack = getGpxForRace(activeRace.id);
    if (gpxTrack) {
      setTimeout(() => {
        let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="VTT HORSETRAIL-RANDO Platform">
  <trk><name>${gpxTrack.title}</name><trkseg>`;
        gpxTrack.points.forEach((pt) => {
          xmlContent += `\n    <trkpt lat="${pt.lat}" lon="${pt.lng}">${pt.ele !== undefined ? `<ele>${pt.ele}</ele>` : ''}</trkpt>`;
        });
        xmlContent += `\n  </trkseg></trk></gpx>`;

        const blob = new Blob([xmlContent], { type: 'application/gpx+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = gpxTrack.filename || `${gpxTrack.title.toLowerCase().replace(/\s+/g, '_')}.gpx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 800);
    }
  };

  const gpxTrack = activeRace ? getGpxForRace(activeRace.id) : undefined;
  const raceRunners = activeRace ? getRunnersForRace(activeRace.id) : [];
  const activeOrg = activeRace ? organizers.find((o) => o.id === activeRace.organizerId) : undefined;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      {/* Search & Code Input Bar */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-sky-400" />
              Espace Coureur & Accès Course
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Rejoignez votre course via Code de Course, QR Code ou Lien d'Invitation.
            </p>
          </div>

          <button
            onClick={() => setShowQrScanner(!showQrScanner)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-xs border border-slate-700 transition"
          >
            <QrCode className="w-4 h-4" />
            <span>Scanner QR Code</span>
          </button>
        </div>

        {/* QR Code Scanner Simulation */}
        {showQrScanner && (
          <div className="rounded-2xl bg-slate-950 p-6 border border-sky-500/30 text-center animate-fade-in">
            <div className="relative w-48 h-48 mx-auto rounded-2xl border-2 border-dashed border-sky-400 flex items-center justify-center bg-slate-900/60 overflow-hidden mb-3">
              <div className="absolute inset-x-0 h-1 bg-sky-400 shadow-lg shadow-sky-400 animate-pulse"></div>
              <Camera className="w-10 h-10 text-sky-400 animate-bounce-slow" />
            </div>
            <p className="text-xs text-slate-300 font-medium">Alignez le QR Code dans le cadre de scan</p>
            <p className="text-[11px] text-slate-500 mt-1">Simulateur actif : détection automatique du code course AVE2027, SAP2027 ou ALP2027</p>
          </div>
        )}

        {/* Code Form Input */}
        <form onSubmit={handleJoinByCode} className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="Saisissez votre code course (ex: AVE2027)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-sm tracking-wider focus:outline-none focus:border-sky-500 transition"
            />
            <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition active:scale-95 shrink-0 shadow-lg shadow-sky-950/40"
          >
            Accéder à la course
          </button>
        </form>

        {/* Quick Example Code Chips */}
        <div className="flex items-center gap-2 pt-2 text-xs text-slate-400 overflow-x-auto">
          <span className="shrink-0 text-[11px] font-semibold text-slate-500">Exemples rapides :</span>
          <button
            onClick={() => {
              setInputCode('AVE2027');
              setRunnerRaceCode('AVE2027');
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 font-mono hover:border-emerald-500 transition"
          >
            AVE2027 (Rodez)
          </button>
          <button
            onClick={() => {
              setInputCode('SAP2027');
              setRunnerRaceCode('SAP2027');
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-amber-400 font-mono hover:border-amber-500 transition"
          >
            SAP2027 (Jura)
          </button>
          <button
            onClick={() => {
              setInputCode('ALP2027');
              setRunnerRaceCode('ALP2027');
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-sky-400 font-mono hover:border-sky-500 transition"
          >
            ALP2027 (Alpes)
          </button>
        </div>
      </div>

      {/* RACE DETAILS & GPX PREVIEW FOR RUNNER */}
      {activeRace ? (
        <div className="space-y-6">
          {/* Race Header Banner */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 font-mono font-bold text-xs border border-sky-500/30">
                Code : {activeRace.code}
              </span>
              <span className="text-xs text-slate-400">
                Organisé par : <strong className="text-slate-200">{activeOrg?.name}</strong>
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">{activeRace.title}</h1>
            <p className="text-xs md:text-sm text-slate-300 mb-6">{activeRace.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block">📅 Date & Départ</span>
                <strong className="text-slate-200 block mt-0.5">{activeRace.date} à {activeRace.startTime}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">📍 Lieu</span>
                <strong className="text-slate-200 block mt-0.5">{activeRace.location}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">🏃 Inscrits</span>
                <strong className="text-slate-200 block mt-0.5">{activeRace.runnerCount} / {activeRace.maxRunners}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">💶 Inscription</span>
                <strong className="text-emerald-400 font-bold block mt-0.5">{activeRace.priceEur} €</strong>
              </div>
            </div>
          </div>

          {/* Interactive Map & Elevation Profile */}
          {gpxTrack ? (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400" />
                Parcours GPX & Profil Altimétrique Officiel
              </h3>
              <GPXMap track={gpxTrack} height="h-96" />
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-900 rounded-2xl text-slate-400">
              Le tracé GPX sera mis en ligne très prochainement par l'organisateur.
            </div>
          )}

          {/* Registration Box or Registered Status */}
          {registeredRunner ? (
            <div className="rounded-3xl bg-emerald-500/10 border border-emerald-500/30 p-6 md:p-8 text-emerald-200 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                <div>
                  <h3 className="text-xl font-extrabold text-white">Inscription Confirmée !</h3>
                  <p className="text-xs text-emerald-300">
                    Dossard attribué : <strong className="text-white font-mono text-base">#{registeredRunner.bibNumber}</strong>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
                <p className="font-semibold text-emerald-400">✅ Téléchargement GPX :</p>
                <p>Le fichier GPX de la course a été téléchargé automatiquement sur votre appareil.</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span>Coureur : <strong>{registeredRunner.firstName} {registeredRunner.lastName}</strong></span>
                  <span>Catégorie : <strong>{registeredRunner.category}</strong></span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                S'inscrire à cette épreuve ({activeRace.priceEur} €)
              </h3>

              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jean"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Nom *</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Dupont"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="coureur@email.fr"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Catégorie / Discipline</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Senior H">Senior H</option>
                      <option value="Senior F">Senior F</option>
                      <option value="Master H">Master H</option>
                      <option value="Master F">Master F</option>
                      <option value="VTT Musculaire">VTT Musculaire</option>
                      <option value="VTT Électrique">VTT VTTAE (Électrique)</option>
                      <option value="Cavalier Solo">Cavalier Équestre Solo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Téléphone d'Urgence</label>
                    <input
                      type="text"
                      required
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder="06 00 00 00 00"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-950/50 transition active:scale-95"
                >
                  Valider l'Inscription & Télécharger le GPX
                </button>
              </form>
            </div>
          )}

          {/* Leaderboard & Registered Runners Table */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              Liste des Inscrits & Classement en Direct
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Dossard</th>
                    <th className="p-3">Nom</th>
                    <th className="p-3">Catégorie</th>
                    <th className="p-3">Statut</th>
                    <th className="p-3">Temps Chrono</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {raceRunners.slice(0, 15).map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/50">
                      <td className="p-3 font-mono font-bold text-sky-400">#{r.bibNumber}</td>
                      <td className="p-3 font-semibold text-white">{r.firstName} {r.lastName}</td>
                      <td className="p-3">{r.category}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-950 text-[10px]">
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono">{r.finishTime || '--:--:--'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 space-y-2">
          <AlertTriangle className="w-10 h-10 mx-auto text-amber-400" />
          <h3 className="text-lg font-bold text-white">Course Introuvable</h3>
          <p className="text-xs">Veuillez vérifier le code saisi (ex. AVE2027, SAP2027, ALP2027).</p>
        </div>
      )}
    </div>
  );
};
