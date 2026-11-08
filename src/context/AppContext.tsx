import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserRole,
  Organizer,
  Race,
  GPXTrack,
  Runner,
  PastEditionArchive,
  PlatformStats,
  LicensePlan
} from '../types';
import {
  INITIAL_ORGANIZERS,
  INITIAL_RACES,
  INITIAL_GPX_TRACKS,
  INITIAL_RUNNERS,
  INITIAL_PAST_EDITIONS,
  INITIAL_PLATFORM_STATS
} from '../data/mockData';

interface ResetRaceOptions {
  clearRunners: boolean;
  resetTimes: boolean;
  clearCheckpoints: boolean;
  keepGpx: boolean;
  archiveEdition: boolean;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeOrganizerId: string;
  setActiveOrganizerId: (id: string) => void;
  activeOrganizer: Organizer | undefined;
  organizers: Organizer[];
  races: Race[];
  gpxTracks: GPXTrack[];
  runners: Runner[];
  pastEditions: PastEditionArchive[];
  platformStats: PlatformStats;
  runnerRaceCode: string;
  setRunnerRaceCode: (code: string) => void;
  
  // Actions for Organizers
  createOrganizer: (newOrg: Omit<Organizer, 'id' | 'memberSince' | 'stats'>) => void;
  toggleOrganizerStatus: (id: string) => void;
  deleteOrganizer: (id: string) => void;
  updateOrganizerPlan: (id: string, plan: LicensePlan) => void;
  
  // Actions for Races
  createRace: (newRace: Omit<Race, 'id' | 'runnerCount'>) => void;
  updateRace: (race: Race) => void;
  deleteRace: (id: string) => void;
  resetRace: (raceId: string, options: ResetRaceOptions) => void;
  
  // Actions for GPX
  addGpxTrack: (newTrack: Omit<GPXTrack, 'id' | 'createdAt'>) => GPXTrack;
  deleteGpxTrack: (id: string) => void;
  
  // Actions for Runners
  registerRunner: (newRunner: Omit<Runner, 'id' | 'registeredAt' | 'bibNumber' | 'status' | 'checkInTimes'>) => Runner;
  updateRunnerStatus: (runnerId: string, status: Runner['status'], checkpointId?: string) => void;

  // Search/Filter helper
  getRaceByCode: (code: string) => Race | undefined;
  getGpxForRace: (raceId: string) => GPXTrack | undefined;
  getRunnersForRace: (raceId: string) => Runner[];
  getOrganizerRaces: (organizerId: string) => Race[];
  getOrganizerGpxTracks: (organizerId: string) => GPXTrack[];
  getOrganizerRunners: (organizerId: string) => Runner[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'vtt_horsetrail_rando_platform_v1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('ORGANIZER');
  const [activeOrganizerId, setActiveOrganizerId] = useState<string>('org-rodez');
  const [runnerRaceCode, setRunnerRaceCode] = useState<string>('AVE2027');

  const [organizers, setOrganizers] = useState<Organizer[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_organizers`);
    return saved ? JSON.parse(saved) : INITIAL_ORGANIZERS;
  });

  const [races, setRaces] = useState<Race[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_races`);
    return saved ? JSON.parse(saved) : INITIAL_RACES;
  });

  const [gpxTracks, setGpxTracks] = useState<GPXTrack[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_gpx`);
    return saved ? JSON.parse(saved) : INITIAL_GPX_TRACKS;
  });

  const [runners, setRunners] = useState<Runner[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_runners`);
    return saved ? JSON.parse(saved) : INITIAL_RUNNERS;
  });

  const [pastEditions, setPastEditions] = useState<PastEditionArchive[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_pastEditions`);
    return saved ? JSON.parse(saved) : INITIAL_PAST_EDITIONS;
  });

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_organizers`, JSON.stringify(organizers));
  }, [organizers]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_races`, JSON.stringify(races));
  }, [races]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_gpx`, JSON.stringify(gpxTracks));
  }, [gpxTracks]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_runners`, JSON.stringify(runners));
  }, [runners]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_pastEditions`, JSON.stringify(pastEditions));
  }, [pastEditions]);

  const activeOrganizer = organizers.find((o) => o.id === activeOrganizerId);

  // Computed Platform Stats
  const platformStats: PlatformStats = {
    totalOrganizers: organizers.length,
    activeOrganizers: organizers.filter((o) => o.status === 'ACTIVE').length,
    totalRaces: races.length,
    totalRunners: runners.length,
    totalGpxTracks: gpxTracks.length,
    monthlyRevenueEur: organizers.reduce((acc, org) => {
      if (org.plan === 'PRO') return acc + 49;
      if (org.plan === 'ENTERPRISE') return acc + 149;
      return acc + 19;
    }, 0)
  };

  // ORGANIZER MANAGEMENT (ADMIN)
  const createOrganizer = (newOrg: Omit<Organizer, 'id' | 'memberSince' | 'stats'>) => {
    const id = `org-${Date.now()}`;
    const created: Organizer = {
      ...newOrg,
      id,
      memberSince: new Date().toISOString().split('T')[0],
      stats: {
        totalRaces: 0,
        totalRunners: 0,
        activeGpx: 0
      }
    };
    setOrganizers((prev) => [created, ...prev]);
  };

  const toggleOrganizerStatus = (id: string) => {
    setOrganizers((prev) =>
      prev.map((org) =>
        org.id === id
          ? { ...org, status: org.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }
          : org
      )
    );
  };

  const deleteOrganizer = (id: string) => {
    setOrganizers((prev) => prev.filter((o) => o.id !== id));
    setRaces((prev) => prev.filter((r) => r.organizerId !== id));
    setGpxTracks((prev) => prev.filter((g) => g.organizerId !== id));
    setRunners((prev) => prev.filter((r) => r.organizerId !== id));
    if (activeOrganizerId === id) {
      const remaining = organizers.filter((o) => o.id !== id);
      if (remaining.length > 0) {
        setActiveOrganizerId(remaining[0].id);
      }
    }
  };

  const updateOrganizerPlan = (id: string, plan: LicensePlan) => {
    setOrganizers((prev) =>
      prev.map((org) => (org.id === id ? { ...org, plan } : org))
    );
  };

  // RACE MANAGEMENT
  const createRace = (newRaceData: Omit<Race, 'id' | 'runnerCount'>) => {
    const id = `race-${Date.now()}`;
    const newRace: Race = {
      ...newRaceData,
      id,
      runnerCount: 0
    };
    setRaces((prev) => [newRace, ...prev]);

    // Update organizer stats
    setOrganizers((prev) =>
      prev.map((org) =>
        org.id === newRaceData.organizerId
          ? {
              ...org,
              stats: {
                ...org.stats,
                totalRaces: org.stats.totalRaces + 1
              }
            }
          : org
      )
    );
  };

  const updateRace = (updated: Race) => {
    setRaces((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const deleteRace = (id: string) => {
    const raceToDelete = races.find((r) => r.id === id);
    if (raceToDelete) {
      setRaces((prev) => prev.filter((r) => r.id !== id));
      setRunners((prev) => prev.filter((ru) => ru.raceId !== id));
    }
  };

  // RACE RESET FEATURE ("Réinitialiser la course")
  const resetRace = (raceId: string, options: ResetRaceOptions) => {
    const race = races.find((r) => r.id === raceId);
    if (!race) return;

    // Optional archiving of finished edition before wiping
    if (options.archiveEdition) {
      const raceRunners = runners.filter((r) => r.raceId === raceId);
      const finishedRunners = raceRunners.filter((r) => r.status === 'FINISHED');
      const winner = finishedRunners.sort((a, b) => (a.finishTimeSeconds || 999999) - (b.finishTimeSeconds || 999999))[0];

      const archive: PastEditionArchive = {
        id: `archive-${Date.now()}`,
        raceId: race.id,
        organizerId: race.organizerId,
        editionYear: new Date().getFullYear(),
        title: `${race.title} - Édition ${race.edition}`,
        discipline: race.discipline,
        totalRunners: raceRunners.length,
        winnerName: winner ? `${winner.firstName} ${winner.lastName}` : 'N/A',
        winnerTime: winner ? winner.finishTime || 'N/A' : 'N/A',
        date: race.date,
        gpxPreserved: options.keepGpx,
        distanceKm: race.gpxTrackId ? gpxTracks.find(g => g.id === race.gpxTrackId)?.distanceKm || 0 : 0,
        elevationGainM: race.gpxTrackId ? gpxTracks.find(g => g.id === race.gpxTrackId)?.elevationGainM || 0 : 0
      };

      setPastEditions((prev) => [archive, ...prev]);
    }

    // Clear runners if selected
    if (options.clearRunners) {
      setRunners((prev) => prev.filter((r) => r.raceId !== raceId));
    }

    // Reset race object
    setRaces((prev) =>
      prev.map((r) => {
        if (r.id === raceId) {
          return {
            ...r,
            runnerCount: options.clearRunners ? 0 : r.runnerCount,
            status: 'UPCOMING',
            edition: r.edition + 1,
            gpxTrackId: options.keepGpx ? r.gpxTrackId : undefined
          };
        }
        return r;
      })
    );

    // Update organizer runner count stats
    const raceRunnersCount = runners.filter((r) => r.raceId === raceId).length;
    setOrganizers((prev) =>
      prev.map((org) => {
        if (org.id === race.organizerId) {
          return {
            ...org,
            stats: {
              ...org.stats,
              totalRunners: Math.max(0, org.stats.totalRunners - raceRunnersCount)
            }
          };
        }
        return org;
      })
    );
  };

  // GPX TRACK MANAGEMENT
  const addGpxTrack = (newTrackData: Omit<GPXTrack, 'id' | 'createdAt'>): GPXTrack => {
    const id = `gpx-${Date.now()}`;
    const newTrack: GPXTrack = {
      ...newTrackData,
      id,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setGpxTracks((prev) => [newTrack, ...prev]);

    setOrganizers((prev) =>
      prev.map((org) =>
        org.id === newTrackData.organizerId
          ? {
              ...org,
              stats: { ...org.stats, activeGpx: org.stats.activeGpx + 1 }
            }
          : org
      )
    );

    return newTrack;
  };

  const deleteGpxTrack = (id: string) => {
    const track = gpxTracks.find((g) => g.id === id);
    if (track) {
      setGpxTracks((prev) => prev.filter((g) => g.id !== id));
      setRaces((prev) =>
        prev.map((r) => (r.gpxTrackId === id ? { ...r, gpxTrackId: undefined } : r))
      );
    }
  };

  // RUNNER REGISTRATION & TIMING
  const registerRunner = (
    newRunnerData: Omit<Runner, 'id' | 'registeredAt' | 'bibNumber' | 'status' | 'checkInTimes'>
  ): Runner => {
    const raceRunners = runners.filter((r) => r.raceId === newRunnerData.raceId);
    const bibNumber = 100 + raceRunners.length + 1;
    const newRunner: Runner = {
      ...newRunnerData,
      id: `runner-${Date.now()}`,
      bibNumber,
      registeredAt: new Date().toISOString().split('T')[0],
      status: 'REGISTERED',
      checkInTimes: {}
    };

    setRunners((prev) => [newRunner, ...prev]);

    // Increment race runner count
    setRaces((prev) =>
      prev.map((r) => (r.id === newRunnerData.raceId ? { ...r, runnerCount: r.runnerCount + 1 } : r))
    );

    // Update organizer runner count stat
    setOrganizers((prev) =>
      prev.map((org) =>
        org.id === newRunnerData.organizerId
          ? { ...org, stats: { ...org.stats, totalRunners: org.stats.totalRunners + 1 } }
          : org
      )
    );

    return newRunner;
  };

  const updateRunnerStatus = (runnerId: string, newStatus: Runner['status'], checkpointId?: string) => {
    setRunners((prev) =>
      prev.map((r) => {
        if (r.id === runnerId) {
          const updatedCheckIns = { ...r.checkInTimes };
          if (checkpointId) {
            const timeStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            updatedCheckIns[checkpointId] = timeStr;
          }
          return {
            ...r,
            status: newStatus,
            checkInTimes: updatedCheckIns,
            finishTime: newStatus === 'FINISHED' && !r.finishTime ? new Date().toLocaleTimeString('fr-FR') : r.finishTime
          };
        }
        return r;
      })
    );
  };

  // HELPERS
  const getRaceByCode = (code: string) => {
    return races.find((r) => r.code.toUpperCase() === code.trim().toUpperCase());
  };

  const getGpxForRace = (raceId: string) => {
    const race = races.find((r) => r.id === raceId);
    if (!race || !race.gpxTrackId) return undefined;
    return gpxTracks.find((g) => g.id === race.gpxTrackId);
  };

  const getRunnersForRace = (raceId: string) => {
    return runners.filter((r) => r.raceId === raceId);
  };

  const getOrganizerRaces = (organizerId: string) => {
    return races.filter((r) => r.organizerId === organizerId);
  };

  const getOrganizerGpxTracks = (organizerId: string) => {
    return gpxTracks.filter((g) => g.organizerId === organizerId);
  };

  const getOrganizerRunners = (organizerId: string) => {
    return runners.filter((r) => r.organizerId === organizerId);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeOrganizerId,
        setActiveOrganizerId,
        activeOrganizer,
        organizers,
        races,
        gpxTracks,
        runners,
        pastEditions,
        platformStats,
        runnerRaceCode,
        setRunnerRaceCode,
        createOrganizer,
        toggleOrganizerStatus,
        deleteOrganizer,
        updateOrganizerPlan,
        createRace,
        updateRace,
        deleteRace,
        resetRace,
        addGpxTrack,
        deleteGpxTrack,
        registerRunner,
        updateRunnerStatus,
        getRaceByCode,
        getGpxForRace,
        getRunnersForRace,
        getOrganizerRaces,
        getOrganizerGpxTracks,
        getOrganizerRunners
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
