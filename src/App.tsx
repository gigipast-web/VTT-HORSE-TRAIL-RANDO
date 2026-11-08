import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { OrganizerDashboard } from './components/organizer/OrganizerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { RunnerView } from './components/runner/RunnerView';
import { ShieldCheck, Layers, Sparkles } from 'lucide-react';

const MainContent: React.FC = () => {
  const { role } = useApp();

  return (
    <main className="min-h-screen pb-16">
      {role === 'ORGANIZER' && <OrganizerDashboard />}
      {role === 'ADMIN' && <AdminDashboard />}
      {role === 'RUNNER' && <RunnerView />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
        <Header />
        <div className="flex-1">
          <MainContent />
        </div>

        {/* Global Footer */}
        <footer className="border-t border-slate-800 bg-slate-900/80 py-6 px-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-300">VTT HORSETRAIL-RANDO</span>
              <span className="text-slate-600">•</span>
              <span>Plateforme Privée Multi-Organisateurs</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Chaque organisateur possède son propre espace sécurisé totalement indépendant.
            </p>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}
