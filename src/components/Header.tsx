import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Building2,
  UserCheck,
  Key,
  Plus,
  ChevronDown,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  QrCode
} from 'lucide-react';

interface HeaderProps {
  onOpenNewRaceModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewRaceModal }) => {
  const {
    role,
    setRole,
    organizers,
    activeOrganizerId,
    setActiveOrganizerId,
    activeOrganizer,
    getRaceByCode,
    setRunnerRaceCode
  } = useApp();

  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [quickCodeInput, setQuickCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');

  const handleQuickJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCodeInput.trim()) return;
    const race = getRaceByCode(quickCodeInput);
    if (race) {
      setRunnerRaceCode(race.code);
      setRole('RUNNER');
      setQuickCodeInput('');
      setCodeError('');
    } else {
      setCodeError(`Code ${quickCodeInput.toUpperCase()} introuvable`);
      setTimeout(() => setCodeError(''), 3000);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 p-0.5 shadow-lg shadow-emerald-950/50 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <span className="font-black text-xs text-emerald-400 tracking-tighter">VTT</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-white tracking-tight leading-none">
                VTT HORSETRAIL-RANDO
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                Multi-Tenant
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none mt-1">
              Plateforme privée de gestion de courses & GPX
            </p>
          </div>
        </div>

        {/* Quick Join Code Bar for Runners / Search */}
        <form onSubmit={handleQuickJoin} className="hidden md:flex items-center relative max-w-xs w-full">
          <input
            type="text"
            value={quickCodeInput}
            onChange={(e) => setQuickCodeInput(e.target.value.toUpperCase())}
            placeholder="Code course (ex: AVE2027)..."
            className="w-full pl-9 pr-16 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
          <Key className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <button
            type="submit"
            className="absolute right-1 top-1 bottom-1 px-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition active:scale-95"
          >
            Rejoindre
          </button>
          {codeError && (
            <span className="absolute left-0 -bottom-5 text-[10px] text-red-400 font-medium">
              {codeError}
            </span>
          )}
        </form>

        {/* Tenant / Role Selector Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Switcher Tabs */}
          <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 p-1 text-xs font-medium">
            <button
              onClick={() => setRole('ORGANIZER')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                role === 'ORGANIZER'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Organisateur</span>
            </button>

            <button
              onClick={() => setRole('ADMIN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                role === 'ADMIN'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin Général</span>
            </button>

            <button
              onClick={() => setRole('RUNNER')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                role === 'RUNNER'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Coureur</span>
            </button>
          </div>

          {/* Active Tenant / Organizer Dropdown (Only in Organizer mode) */}
          {role === 'ORGANIZER' && (
            <div className="relative">
              <button
                onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700/80 hover:bg-slate-700/80 text-white text-xs font-semibold transition"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="max-w-[140px] sm:max-w-[180px] truncate">
                  {activeOrganizer ? activeOrganizer.name : 'Sélectionner...'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {orgDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-fade-in">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1">
                    Changer d'espace Organisateur Privé
                  </div>
                  <div className="space-y-1">
                    {organizers.map((org) => {
                      const isSelected = org.id === activeOrganizerId;
                      return (
                        <button
                          key={org.id}
                          onClick={() => {
                            setActiveOrganizerId(org.id);
                            setOrgDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between text-xs transition ${
                            isSelected
                              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold'
                              : 'hover:bg-slate-800/80 text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span>{org.name}</span>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                            </div>
                            <span className="text-[10px] text-slate-500 block">
                              {org.stats.totalRaces} courses • {org.stats.totalRunners} coureurs
                            </span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                            {org.code}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
