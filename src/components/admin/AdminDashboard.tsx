import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LicensePlan, Organizer } from '../../types';
import {
  ShieldCheck,
  Building2,
  Users,
  Flag,
  DollarSign,
  Plus,
  Power,
  Trash2,
  Edit,
  ExternalLink,
  Search,
  CheckCircle,
  AlertOctagon,
  Layers,
  Sparkles,
  FileText,
  X
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    organizers,
    races,
    runners,
    gpxTracks,
    platformStats,
    createOrganizer,
    toggleOrganizerStatus,
    deleteOrganizer,
    updateOrganizerPlan,
    setActiveOrganizerId,
    setRole
  } = useApp();

  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for new organizer
  const [orgName, setOrgName] = useState('');
  const [orgCode, setOrgCode] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState('');
  const [plan, setPlan] = useState<LicensePlan>('PRO');

  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !email.trim()) return;

    createOrganizer({
      name: orgName.trim(),
      organization: orgName.trim(),
      code: orgCode.trim() ? orgCode.trim().toUpperCase() : orgName.slice(0, 4).toUpperCase(),
      contactName: contactName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      region: region.trim(),
      status: 'ACTIVE',
      plan,
      logoColor: 'emerald'
    });

    setShowCreateOrgModal(false);
    setOrgName('');
    setEmail('');
  };

  const filteredOrganizers = organizers.filter((o) =>
    `${o.name} ${o.contactName} ${o.region}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Super Admin Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-4 h-4" /> Espace Administrateur Général de la Plateforme
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Supervision Global & Gestion des Licences
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Gestion centralisée des comptes organisateurs, licences, abonnements et assistance technique globale.
            </p>
          </div>

          <button
            onClick={() => setShowCreateOrgModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Créer un Organisateur</span>
          </button>
        </div>

        {/* Global Platform KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">🏢 Organisateurs Total</span>
            <span className="text-xl font-bold text-white">{platformStats.totalOrganizers}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">🟢 Comptes Actifs</span>
            <span className="text-xl font-bold text-emerald-400">{platformStats.activeOrganizers}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">🏁 Courses sur la Plateforme</span>
            <span className="text-xl font-bold text-amber-400">{platformStats.totalRaces}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">👥 Coureurs Totaux</span>
            <span className="text-xl font-bold text-sky-400">{platformStats.totalRunners}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">📁 Fichiers GPX Actifs</span>
            <span className="text-xl font-bold text-teal-400">{platformStats.totalGpxTracks}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">💶 Abonnements Recurrents</span>
            <span className="text-xl font-bold text-emerald-300">{platformStats.monthlyRevenueEur} €/mois</span>
          </div>
        </div>
      </div>

      {/* ORGANIZER ACCOUNTS MANAGEMENT TABLE */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Comptes Organisateurs Privés (Multi-Tenant)</h3>
            <p className="text-xs text-slate-400">
              Chaque organisateur possède un espace totalement isolé des autres.
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher organisateur..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Organisateur</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Région</th>
                  <th className="p-4">Statut Compte</th>
                  <th className="p-4">Licence / Offre</th>
                  <th className="p-4">Activité</th>
                  <th className="p-4 text-right">Actions Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrganizers.map((org) => {
                  const isActive = org.status === 'ACTIVE';

                  return (
                    <tr key={org.id} className="hover:bg-slate-800/50 transition">
                      <td className="p-4">
                        <strong className="text-white text-sm block">{org.name}</strong>
                        <span className="text-[10px] font-mono text-slate-500">ID: {org.id}</span>
                      </td>

                      <td className="p-4">
                        <span className="text-slate-200 block font-medium">{org.contactName}</span>
                        <span className="text-[11px] text-slate-400">{org.email}</span>
                      </td>

                      <td className="p-4 text-slate-300">
                        {org.region}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                            isActive
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                          {isActive ? 'Actif' : 'Suspendu'}
                        </span>
                      </td>

                      <td className="p-4">
                        <select
                          value={org.plan}
                          onChange={(e) => updateOrganizerPlan(org.id, e.target.value as LicensePlan)}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold text-amber-400 focus:outline-none"
                        >
                          <option value="STARTER">Starter (19€)</option>
                          <option value="PRO">Pro (49€)</option>
                          <option value="ENTERPRISE">Enterprise (149€)</option>
                        </select>
                      </td>

                      <td className="p-4 text-slate-300">
                        <span className="block font-semibold text-white">{org.stats.totalRaces} courses</span>
                        <span className="text-[11px] text-slate-400">{org.stats.totalRunners} coureurs</span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Inspect Private Workspace */}
                          <button
                            onClick={() => {
                              setActiveOrganizerId(org.id);
                              setRole('ORGANIZER');
                            }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-[11px] transition"
                            title="Superviser pour assistance technique"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Accéder
                          </button>

                          {/* Toggle Suspend / Activate */}
                          <button
                            onClick={() => toggleOrganizerStatus(org.id)}
                            className={`p-1.5 rounded-lg border transition ${
                              isActive
                                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            }`}
                            title={isActive ? 'Suspendre le compte' : 'Activer le compte'}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Organizer */}
                          <button
                            onClick={() => {
                              if (confirm(`Supprimer définitivement l'organisateur ${org.name} ?`)) {
                                deleteOrganizer(org.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-950 text-red-400 border border-red-800/40 transition"
                            title="Supprimer l'organisateur"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* GLOBAL TECHNICAL RACE SUPERVISION TABLE */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white">Supervision Technique Global de Toutes les Courses</h3>
          <p className="text-xs text-slate-400">
            Consultation technique multi-organisateurs exclusive à l'assistance administrateur.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Code</th>
                  <th className="p-3.5">Course</th>
                  <th className="p-3.5">Organisateur</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Discipline</th>
                  <th className="p-3.5">Inscrits</th>
                  <th className="p-3.5">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {races.map((race) => {
                  const org = organizers.find((o) => o.id === race.organizerId);
                  return (
                    <tr key={race.id} className="hover:bg-slate-800/50 transition">
                      <td className="p-3.5 font-mono font-bold text-amber-400">{race.code}</td>
                      <td className="p-3.5 font-semibold text-white">{race.title}</td>
                      <td className="p-3.5 text-slate-300">{org ? org.name : 'Inconnu'}</td>
                      <td className="p-3.5 text-slate-400">{race.date}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px]">
                          {race.discipline}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono">{race.runnerCount} / {race.maxRunners}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            race.status === 'ONGOING'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {race.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal to Create New Organizer */}
      {showCreateOrgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100">
            <button
              onClick={() => setShowCreateOrgModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Créer un Nouvel Organisateur</h3>
            <p className="text-xs text-slate-400 mb-5">
              Un espace totalement privé et sécurisé sera attribué à cet organisateur.
            </p>

            <form onSubmit={handleCreateOrg} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nom du Club / Organisateur *</label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="ex. Trail de Bordeaux, VTT des Vosges..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nom du Responsable</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Jean Dupont"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email de contact *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@org.fr"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="06 12 34 56 78"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Région / Département</label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="ex. Gironde (33)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Plan Licence Initiale</label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value as LicensePlan)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="STARTER">Starter (19€/mois)</option>
                  <option value="PRO">Pro (49€/mois)</option>
                  <option value="ENTERPRISE">Enterprise (149€/mois)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateOrgModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Créer l'espace privé
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
