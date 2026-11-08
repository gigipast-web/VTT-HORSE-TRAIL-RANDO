import React, { useState } from 'react';
import { Race } from '../types';
import { RefreshCw, AlertTriangle, CheckCircle2, ShieldAlert, FileText, Users, Archive, Trash2, X } from 'lucide-react';

interface ResetRaceModalProps {
  race: Race;
  onClose: () => void;
  onConfirm: (options: {
    clearRunners: boolean;
    resetTimes: boolean;
    clearCheckpoints: boolean;
    keepGpx: boolean;
    archiveEdition: boolean;
  }) => void;
}

export const ResetRaceModal: React.FC<ResetRaceModalProps> = ({ race, onClose, onConfirm }) => {
  const [keepGpx, setKeepGpx] = useState<boolean>(true);
  const [archiveEdition, setArchiveEdition] = useState<boolean>(true);
  const [confirmText, setConfirmText] = useState<string>('');

  const isConfirmed = confirmText.trim().toLowerCase() === race.code.toLowerCase() || confirmText.trim().toLowerCase() === 'reset';

  const handleReset = () => {
    if (!isConfirmed) return;
    onConfirm({
      clearRunners: true,
      resetTimes: true,
      clearCheckpoints: true,
      keepGpx,
      archiveEdition
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden p-6 text-slate-100">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
            <RefreshCw className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              Réinitialiser la course
            </h3>
            <p className="text-xs text-slate-400">
              {race.title} ({race.code}) • Édition {race.edition}
            </p>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3.5 mb-5 text-xs text-red-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block text-red-200">Attention : action de réinitialisation d'édition</strong>
            Cette opération permet de préparer la course pour une nouvelle édition.
          </div>
        </div>

        {/* List of actions being performed */}
        <div className="space-y-2 mb-5 text-xs text-slate-300 bg-slate-950/60 rounded-xl p-4 border border-slate-800">
          <p className="font-medium text-slate-200 border-b border-slate-800 pb-2 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Actions automatiques exécutées :
          </p>
          <ul className="space-y-1.5 list-disc pl-5 text-slate-300">
            <li>Suppression de tous les coureurs inscrits ({race.runnerCount} coureurs)</li>
            <li>Effacement complet des noms, emails et numéros de dossards</li>
            <li>Remise à zéro de tous les temps chrono et du classement</li>
            <li>Vidage des heures de passage enregistrées aux checkpoints</li>
            <li>Réinitialisation du statut à « À venir » (Édition {race.edition + 1})</li>
          </ul>
        </div>

        {/* GPX & Archiving Options */}
        <div className="space-y-3 mb-6">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 cursor-pointer hover:bg-slate-800 transition">
            <div className="flex items-center gap-2.5">
              <Archive className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs font-semibold text-white block">Archiver l'édition actuelle</span>
                <span className="text-[11px] text-slate-400">Conserve les résultats actuels dans l'historique des éditions</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={archiveEdition}
              onChange={(e) => setArchiveEdition(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 cursor-pointer hover:bg-slate-800 transition">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-blue-400" />
              <div>
                <span className="text-xs font-semibold text-white block">Conserver le fichier GPX</span>
                <span className="text-[11px] text-slate-400">Garde le tracé cartographique et les checkpoints pour la prochaine édition</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={keepGpx}
              onChange={(e) => setKeepGpx(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700"
            />
          </label>
        </div>

        {/* Type code to confirm */}
        <div className="mb-6">
          <label className="block text-xs text-slate-400 mb-1.5">
            Pour confirmer, saisissez le code de la course <strong className="text-white font-mono">{race.code}</strong> ou <strong className="text-white">reset</strong> :
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={race.code}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-red-500 transition"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
          >
            Annuler
          </button>
          <button
            onClick={handleReset}
            disabled={!isConfirmed}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition ${
              isConfirmed
                ? 'bg-red-600 hover:bg-red-500 text-white cursor-pointer active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            Réinitialiser la course
          </button>
        </div>
      </div>
    </div>
  );
};
