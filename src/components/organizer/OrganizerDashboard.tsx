import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Race, GPXTrack, Runner, PastEditionArchive } from '../../types';
import { GPXMap } from '../GPXMap';
import { CreateRaceModal } from './CreateRaceModal';
import { GPXUploadModal } from './GPXUploadModal';
import { ResetRaceModal } from '../ResetRaceModal';
import { QRCodeModal } from '../QRCodeModal';
import {
  Calendar,
  Flag,
  FileText,
  Users,
  BarChart3,
  Trophy,
  Plus,
  QrCode,
  RefreshCw,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  MapPin,
  Download,
  Share2,
  Search,
  Filter,
  ShieldCheck,
  Building2,
  Award,
  ChevronRight,
  Activity,
  UserPlus
} from 'lucide-react';

export const OrganizerDashboard: React.FC = () => {
  const {
    activeOrganizer,
    getOrganizerRaces,
    getOrganizerGpxTracks,
    getOrganizerRunners,
    pastEditions,
    deleteRace,
    resetRace,
    deleteGpxTrack,
    updateRunnerStatus,
    setRole,
    setRunnerRaceCode
  } = useApp();

  const [activeTab, setActiveTab] = useState<'RACES' | 'GPX' | 'RUNNERS' | 'STATS' | 'ARCHIVES'>('RACES');
  const [showCreateRaceModal, setShowCreateRaceModal] = useState(false);
  const [showUploadGpxModal, setShowUploadGpxModal] = useState(false);
  const [resetModalRace, setResetModalRace] = useState<Race | null>(null);
  const [qrModalRace, setQrModalRace] = useState<Race | null>(null);
  const [selectedRaceDetail, setSelectedRaceDetail] = useState<Race | null>(null);
  const [runnerSearch, setRunnerSearch] = useState('');

  if (!activeOrganizer) {
    return (
      <div className="p-12 text-center text-slate-400">
        <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-600" />
        <p>Veuillez sélectionner un espace organisateur dans le menu supérieur.</p>
      </div>
    );
  }

  // Multi-Tenant Isolation Data
  const orgRaces = getOrganizerRaces(activeOrganizer.id);
  const orgGpxTracks = getOrganizerGpxTracks(activeOrganizer.id);
  const orgRunners = getOrganizerRunners(activeOrganizer.id);
  const orgPastEditions = pastEditions.filter((p) => p.organizerId === activeOrganizer.id);

  // Computed Statistics
  const upcomingRaces = orgRaces.filter((r) => r.status === 'UPCOMING');
  const ongoingRaces = orgRaces.filter((r) => r.status === 'ONGOING');
  const totalRunnersCount = orgRaces.reduce((acc, r) => acc + r.runnerCount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Organizer Workspace Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Espace Privé Organisateur
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700">
                Licence {activeOrganizer.plan}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {activeOrganizer.name}
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1 flex items-center gap-3">
              <span>🏢 {activeOrganizer.organization}</span>
              <span>📍 {activeOrganizer.region}</span>
              <span>✉️ {activeOrganizer.email}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUploadGpxModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 shadow-md transition active:scale-95"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Nouveau GPX</span>
            </button>

            <button
              onClick={() => setShowCreateRaceModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/40 transition active:scale-95"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Créer une Course</span>
            </button>
          </div>
        </div>

        {/* 6 Metric Cards specified in Cahier des Charges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">📅 Prochaines courses</span>
            <span className="text-xl font-bold text-white">{upcomingRaces.length}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">🏁 Courses en cours</span>
            <span className="text-xl font-bold text-emerald-400">{ongoingRaces.length}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">📁 Parcours GPX</span>
            <span className="text-xl font-bold text-sky-400">{orgGpxTracks.length}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">👥 Coureurs inscrits</span>
            <span className="text-xl font-bold text-amber-400">{totalRunnersCount}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">📊 Taux Remplissage</span>
            <span className="text-xl font-bold text-teal-400">
              {orgRaces.length > 0
                ? `${Math.round((totalRunnersCount / orgRaces.reduce((a, b) => a + b.maxRunners, 0)) * 100)}%`
                : '0%'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">🏆 Éditions archivées</span>
            <span className="text-xl font-bold text-purple-400">{orgPastEditions.length}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('RACES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'RACES'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Ses Courses ({orgRaces.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('GPX')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'GPX'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Ses Parcours GPX ({orgGpxTracks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('RUNNERS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'RUNNERS'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Ses Coureurs ({orgRunners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('STATS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'STATS'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Statistiques de Participation</span>
        </button>

        <button
          onClick={() => setActiveTab('ARCHIVES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'ARCHIVES'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Archives & Résultats ({orgPastEditions.length})</span>
        </button>
      </div>

      {/* TAB 1: RACES MANAGEMENT */}
      {activeTab === 'RACES' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Gestion des Courses & Événements</h3>
              <p className="text-xs text-slate-400">
                Aperçu exclusif des épreuves de <strong className="text-slate-200">{activeOrganizer.name}</strong>
              </p>
            </div>
            <button
              onClick={() => setShowCreateRaceModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Ajouter une course
            </button>
          </div>

          {/* Races Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orgRaces.map((race) => {
              const gpx = orgGpxTracks.find((g) => g.id === race.gpxTrackId);
              const isFull = race.runnerCount >= race.maxRunners;
              const fillPct = Math.min(100, Math.round((race.runnerCount / race.maxRunners) * 100));

              return (
                <div
                  key={race.id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl hover:border-slate-700 transition flex flex-col justify-between"
                >
                  <div>
                    {/* Race Top Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold text-xs">
                        {race.code}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          race.status === 'ONGOING'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                            : race.status === 'UPCOMING'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {race.status === 'ONGOING' ? '🏁 En cours' : race.status === 'UPCOMING' ? '📅 À venir' : 'Terminée'}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                      {race.title}
                      <span className="text-xs text-slate-400 font-normal">Ed. {race.edition}</span>
                    </h4>

                    <p className="text-xs text-slate-400 mb-4 line-clamp-2">{race.description}</p>

                    {/* Metadata list */}
                    <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{race.date} à {race.startTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{race.location}</span>
                      </div>
                      {gpx && (
                        <div className="flex items-center gap-2 text-emerald-400 font-medium">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{gpx.distanceKm} km • D+ {gpx.elevationGainM}m ({gpx.discipline})</span>
                        </div>
                      )}
                    </div>

                    {/* Runner Progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Inscrits: <strong className="text-white">{race.runnerCount}</strong> / {race.maxRunners}</span>
                        <span className="font-bold text-emerald-400">{fillPct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                          style={{ width: `${fillPct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Race Action Buttons */}
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedRaceDetail(race)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        Détails & GPX
                      </button>

                      <button
                        onClick={() => setQrModalRace(race)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                      >
                        <QrCode className="w-3.5 h-3.5 text-sky-400" />
                        QR Code
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      {/* MANDATORY RESET RACE BUTTON */}
                      <button
                        onClick={() => setResetModalRace(race)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-bold transition active:scale-95"
                        title="Réinitialiser la course (Supprimer coureurs, remettre temps à zéro, préparer nouvelle édition)"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Réinitialiser la course
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Supprimer définitivement la course ${race.title} ?`)) {
                            deleteRace(race.id);
                          }
                        }}
                        className="p-1.5 rounded-xl bg-slate-950 hover:bg-red-950/60 text-slate-500 hover:text-red-400 border border-slate-800 transition"
                        title="Supprimer la course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: GPX TRACKS MANAGEMENT */}
      {activeTab === 'GPX' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Bibliothèque GPX Privée</h3>
              <p className="text-xs text-slate-400">
                Fichiers GPX et profils altimétriques enregistrés pour <strong className="text-slate-200">{activeOrganizer.name}</strong>
              </p>
            </div>
            <button
              onClick={() => setShowUploadGpxModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Importer un fichier GPX
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {orgGpxTracks.map((track) => (
              <div key={track.id} className="space-y-3">
                <GPXMap track={track} height="h-72" />
                <div className="flex items-center justify-between text-xs px-2">
                  <span className="text-slate-400 font-mono">Fichier: {track.filename}</span>
                  <button
                    onClick={() => {
                      if (confirm(`Supprimer le tracé GPX ${track.title} ?`)) {
                        deleteGpxTrack(track.id);
                      }
                    }}
                    className="text-red-400 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Supprimer ce tracé
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RUNNER MANAGEMENT */}
      {activeTab === 'RUNNERS' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Coureurs Inscrits par Course</h3>
              <p className="text-xs text-slate-400">
                Base de données coureurs de <strong className="text-slate-200">{activeOrganizer.name}</strong> ({orgRunners.length} inscrits)
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <input
                type="text"
                value={runnerSearch}
                onChange={(e) => setRunnerSearch(e.target.value)}
                placeholder="Rechercher coureur, dossard..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Runners Table */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Dossard</th>
                    <th className="p-3.5">Coureur</th>
                    <th className="p-3.5">Course</th>
                    <th className="p-3.5">Catégorie</th>
                    <th className="p-3.5">Urgence</th>
                    <th className="p-3.5">Statut</th>
                    <th className="p-3.5">Temps Final</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orgRunners
                    .filter((r) =>
                      `${r.firstName} ${r.lastName} ${r.bibNumber}`
                        .toLowerCase()
                        .includes(runnerSearch.toLowerCase())
                    )
                    .map((runner) => {
                      const race = orgRaces.find((r) => r.id === runner.raceId);
                      return (
                        <tr key={runner.id} className="hover:bg-slate-800/50 transition">
                          <td className="p-3.5 font-mono font-extrabold text-emerald-400">
                            #{runner.bibNumber}
                          </td>
                          <td className="p-3.5">
                            <strong className="text-white block">{runner.firstName} {runner.lastName}</strong>
                            <span className="text-[10px] text-slate-500">{runner.email}</span>
                          </td>
                          <td className="p-3.5 font-medium text-slate-200">
                            {race ? race.title : 'N/A'}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px]">
                              {runner.category}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-400">
                            {runner.emergencyPhone}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                runner.status === 'FINISHED'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : runner.status === 'ON_TRACK'
                                  ? 'bg-sky-500/20 text-sky-400'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {runner.status}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-white">
                            {runner.finishTime || '--:--:--'}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STATS */}
      {activeTab === 'STATS' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white">Statistiques de Participation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
              <h4 className="text-sm font-bold text-slate-200 mb-3">Répartition par Course</h4>
              <div className="space-y-3">
                {orgRaces.map((race) => (
                  <div key={race.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{race.title}</span>
                      <span className="font-bold text-emerald-400">{race.runnerCount} inscrits</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min(100, (race.runnerCount / race.maxRunners) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
              <h4 className="text-sm font-bold text-slate-200 mb-3">Disciplines Organisées</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex justify-between p-2 rounded bg-slate-950">
                  <span>🏃 Trail / Course</span>
                  <strong className="text-white">{orgRaces.filter((r) => r.discipline === 'TRAIL').length} courses</strong>
                </li>
                <li className="flex justify-between p-2 rounded bg-slate-950">
                  <span>🚴 VTT</span>
                  <strong className="text-white">{orgRaces.filter((r) => r.discipline === 'VTT').length} courses</strong>
                </li>
                <li className="flex justify-between p-2 rounded bg-slate-950">
                  <span>🐴 Horsetrail Équestre</span>
                  <strong className="text-white">{orgRaces.filter((r) => r.discipline === 'HORSETRAIL').length} courses</strong>
                </li>
                <li className="flex justify-between p-2 rounded bg-slate-950">
                  <span>🥾 Randonnée Pedestre</span>
                  <strong className="text-white">{orgRaces.filter((r) => r.discipline === 'RANDO').length} courses</strong>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
              <h4 className="text-sm font-bold text-slate-200 mb-3">Revenus Inscriptions ESTIMÉS</h4>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-3xl font-black text-emerald-400">
                  {orgRaces.reduce((acc, r) => acc + r.runnerCount * r.priceEur, 0)} €
                </span>
                <span className="block text-xs text-slate-400 mt-1">Générés par les coureurs inscrits</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ARCHIVES */}
      {activeTab === 'ARCHIVES' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white">Résultats & Archives Éditions Précédentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orgPastEditions.map((archive) => (
              <div key={archive.id} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-slate-950 text-emerald-400 text-xs font-mono font-bold">
                    Édition {archive.editionYear}
                  </span>
                  <span className="text-xs text-slate-400">{archive.date}</span>
                </div>
                <h4 className="text-base font-bold text-white">{archive.title}</h4>
                <p className="text-xs text-slate-300">
                  🥇 Vainqueur : <strong className="text-amber-400">{archive.winnerName}</strong> ({archive.winnerTime})
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span>👥 {archive.totalRunners} coureurs au départ</span>
                  <span>📏 {archive.distanceKm} km • D+ {archive.elevationGainM}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RACE DETAIL DRAWER MODAL */}
      {selectedRaceDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100">
            <button
              onClick={() => setSelectedRaceDetail(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-sm">
                {selectedRaceDetail.code}
              </span>
              <h3 className="text-2xl font-bold text-white">{selectedRaceDetail.title}</h3>
            </div>

            {/* GPX Map preview */}
            {orgGpxTracks.find((g) => g.id === selectedRaceDetail.gpxTrackId) ? (
              <GPXMap track={orgGpxTracks.find((g) => g.id === selectedRaceDetail.gpxTrackId)!} height="h-80" />
            ) : (
              <div className="p-8 text-center bg-slate-950 rounded-2xl text-slate-500">
                Aucun fichier GPX assigné à cette course.
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedRaceDetail(null);
                  setResetModalRace(selectedRaceDetail);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
              >
                Réinitialiser cette course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreateRaceModal && <CreateRaceModal onClose={() => setShowCreateRaceModal(false)} />}
      {showUploadGpxModal && <GPXUploadModal onClose={() => setShowUploadGpxModal(false)} />}
      {resetModalRace && (
        <ResetRaceModal
          race={resetModalRace}
          onClose={() => setResetModalRace(null)}
          onConfirm={(opts) => resetRace(resetModalRace.id, opts)}
        />
      )}
      {qrModalRace && <QRCodeModal race={qrModalRace} onClose={() => setQrModalRace(null)} />}
    </div>
  );
};
