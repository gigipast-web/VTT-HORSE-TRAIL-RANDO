import React, { useState } from 'react';
import { Race } from '../types';
import { QrCode, Copy, Check, Share2, Download, ExternalLink, X } from 'lucide-react';

interface QRCodeModalProps {
  race: Race;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ race, onClose }) => {
  const [copied, setCopied] = useState(false);

  const inviteUrl = `${window.location.origin}?code=${race.code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden p-6 text-slate-100 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          QR Code & Lien d'Invitation
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Permet aux coureurs de rejoindre instantanément <strong className="text-slate-200">{race.title}</strong>
        </p>

        {/* Generated Simulated High-Quality QR Code Graphic */}
        <div className="mx-auto w-56 h-56 p-4 rounded-2xl bg-white shadow-xl flex flex-col items-center justify-center mb-5 border-4 border-emerald-500/30">
          <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950">
            {/* Corner position squares */}
            <rect x="5" y="5" width="26" height="26" fill="black" />
            <rect x="9" y="9" width="18" height="18" fill="white" />
            <rect x="13" y="13" width="10" height="10" fill="black" />

            <rect x="69" y="5" width="26" height="26" fill="black" />
            <rect x="73" y="9" width="18" height="18" fill="white" />
            <rect x="77" y="13" width="10" height="10" fill="black" />

            <rect x="5" y="69" width="26" height="26" fill="black" />
            <rect x="9" y="73" width="18" height="18" fill="white" />
            <rect x="13" y="77" width="10" height="10" fill="black" />

            {/* Random stylized QR data cells */}
            <rect x="35" y="8" width="6" height="6" fill="black" />
            <rect x="45" y="8" width="6" height="6" fill="black" />
            <rect x="55" y="12" width="6" height="6" fill="black" />
            <rect x="38" y="22" width="6" height="6" fill="black" />
            <rect x="52" y="24" width="6" height="6" fill="black" />

            <rect x="8" y="38" width="6" height="6" fill="black" />
            <rect x="22" y="42" width="6" height="6" fill="black" />
            <rect x="38" y="38" width="12" height="12" fill="black" />
            <rect x="54" y="38" width="6" height="6" fill="black" />
            <rect x="68" y="40" width="8" height="8" fill="black" />
            <rect x="82" y="38" width="6" height="6" fill="black" />

            <rect x="38" y="56" width="6" height="6" fill="black" />
            <rect x="48" y="52" width="6" height="6" fill="black" />
            <rect x="60" y="56" width="12" height="6" fill="black" />

            <rect x="38" y="72" width="6" height="6" fill="black" />
            <rect x="52" y="78" width="8" height="8" fill="black" />
            <rect x="68" y="70" width="6" height="6" fill="black" />
            <rect x="80" y="78" width="6" height="6" fill="black" />
          </svg>
          <span className="font-mono font-bold text-xs text-slate-900 mt-1 uppercase tracking-widest">
            {race.code}
          </span>
        </div>

        {/* Code Highlight Box */}
        <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 mb-4 text-left">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold mb-1">
            Code de course pour l'application
          </span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-mono font-extrabold text-emerald-400">
              {race.code}
            </span>
            <span className="text-xs text-slate-400">
              Discipline : <strong className="text-slate-200">{race.discipline}</strong>
            </span>
          </div>
        </div>

        {/* Link Share input */}
        <div className="flex items-center gap-2 mb-5">
          <input
            type="text"
            readOnly
            value={inviteUrl}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono truncate"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition active:scale-95 shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copié !' : 'Copier'}</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};
