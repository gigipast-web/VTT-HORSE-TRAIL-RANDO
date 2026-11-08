export type Discipline = 'TRAIL' | 'VTT' | 'HORSETRAIL' | 'RANDO';

export type RaceStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'ARCHIVED';

export type LicensePlan = 'STARTER' | 'PRO' | 'ENTERPRISE';

export type OrganizerStatus = 'ACTIVE' | 'SUSPENDED';

export interface Organizer {
  id: string;
  name: string; // e.g. "Organisateur A – Trail de Rodez"
  organization: string; // e.g. "Trail de Rodez"
  code: string;
  contactName: string;
  email: string;
  phone: string;
  region: string;
  status: OrganizerStatus;
  plan: LicensePlan;
  memberSince: string;
  logoColor: string;
  stats: {
    totalRaces: number;
    totalRunners: number;
    activeGpx: number;
  };
}

export interface GPXPoint {
  lat: number;
  lng: number;
  ele?: number;
  time?: string;
}

export interface Checkpoint {
  id: string;
  name: string;
  kmLocation: number;
  lat: number;
  lng: number;
  cutoffTime?: string;
}

export interface GPXTrack {
  id: string;
  organizerId: string;
  title: string;
  discipline: Discipline;
  distanceKm: number;
  elevationGainM: number;
  elevationLossM: number;
  points: GPXPoint[];
  checkpoints: Checkpoint[];
  filename: string;
  createdAt: string;
}

export interface Runner {
  id: string;
  raceId: string;
  organizerId: string;
  bibNumber: number;
  firstName: string;
  lastName: string;
  email: string;
  category: string; // e.g., "Senior H", "M1F", "Cavalier Solo", "VTT VTTAE"
  emergencyContact: string;
  emergencyPhone: string;
  registeredAt: string;
  status: 'REGISTERED' | 'CHECKED_IN' | 'ON_TRACK' | 'FINISHED' | 'DNF' | 'DNS';
  checkInTimes: Record<string, string>; // checkpointId -> timestamp string
  finishTime?: string; // e.g., "02:14:35"
  finishTimeSeconds?: number;
  rankOverall?: number;
  rankCategory?: number;
}

export interface Race {
  id: string;
  organizerId: string;
  code: string; // e.g. "AVE2027"
  title: string;
  discipline: Discipline;
  date: string;
  startTime: string;
  location: string;
  description: string;
  gpxTrackId?: string;
  maxRunners: number;
  status: RaceStatus;
  edition: number;
  priceEur: number;
  runnerCount: number;
}

export interface PastEditionArchive {
  id: string;
  raceId: string;
  organizerId: string;
  editionYear: number;
  title: string;
  discipline: Discipline;
  totalRunners: number;
  winnerName: string;
  winnerTime: string;
  date: string;
  gpxPreserved: boolean;
  distanceKm: number;
  elevationGainM: number;
}

export interface PlatformStats {
  totalOrganizers: number;
  activeOrganizers: number;
  totalRaces: number;
  totalRunners: number;
  totalGpxTracks: number;
  monthlyRevenueEur: number;
}

export type UserRole = 'ADMIN' | 'ORGANIZER' | 'RUNNER';
