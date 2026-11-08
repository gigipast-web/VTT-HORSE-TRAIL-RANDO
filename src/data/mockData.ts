import { Organizer, Race, GPXTrack, Runner, PastEditionArchive, PlatformStats } from '../types';

// GPX Track generator helper for realistic GPS curves & elevation profiles
function generateGpxPoints(centerLat: number, centerLng: number, numPoints: number, baseEle: number, eleDelta: number) {
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const progress = i / (numPoints - 1);
    const angle = progress * Math.PI * 2;
    // Spiral loop track shape
    const latOffset = Math.sin(angle) * 0.04 + Math.sin(angle * 3) * 0.015;
    const lngOffset = Math.cos(angle) * 0.05 + Math.cos(angle * 2) * 0.02;
    const ele = Math.round(baseEle + Math.sin(progress * Math.PI * 3) * eleDelta + Math.cos(progress * Math.PI * 7) * (eleDelta * 0.3));
    points.push({
      lat: Number((centerLat + latOffset).toFixed(5)),
      lng: Number((centerLng + lngOffset).toFixed(5)),
      ele: ele,
      time: new Date(Date.now() - (numPoints - i) * 120000).toISOString()
    });
  }
  return points;
}

// 1. ORGANIZERS (Exact prompt presets)
export const INITIAL_ORGANIZERS: Organizer[] = [
  {
    id: 'org-rodez',
    name: 'Organisateur A – Trail de Rodez',
    organization: 'Club Trail & Outdoor Aveyron',
    code: 'RODEZ',
    contactName: 'Lucie Raynal',
    email: 'contact@trailderodez.fr',
    phone: '06 12 34 56 78',
    region: 'Aveyron (12) - Occitanie',
    status: 'ACTIVE',
    plan: 'PRO',
    memberSince: '2024-03-15',
    logoColor: 'emerald',
    stats: {
      totalRaces: 2,
      totalRunners: 85,
      activeGpx: 2
    }
  },
  {
    id: 'org-jura',
    name: 'Organisateur B – Trail du Jura',
    organization: 'Association Jura Outdoor Events',
    code: 'JURA',
    contactName: 'Mathieu Monnier',
    email: 'info@traildujura.com',
    phone: '06 98 76 54 32',
    region: 'Jura (39) - Bourgogne-Franche-Comté',
    status: 'ACTIVE',
    plan: 'STARTER',
    memberSince: '2024-06-01',
    logoColor: 'amber',
    stats: {
      totalRaces: 2,
      totalRunners: 42,
      activeGpx: 2
    }
  },
  {
    id: 'org-alpes',
    name: 'Organisateur C – Trail des Alpes',
    organization: 'Alpes High Altitude Events',
    code: 'ALPES',
    contactName: 'Sébastien Chamonix',
    email: 'organisation@traildesalpes.fr',
    phone: '06 45 12 89 33',
    region: 'Haute-Savoie (74) - Auvergne-Rhône-Alpes',
    status: 'ACTIVE',
    plan: 'ENTERPRISE',
    memberSince: '2023-11-10',
    logoColor: 'sky',
    stats: {
      totalRaces: 2,
      totalRunners: 110,
      activeGpx: 2
    }
  }
];

// 2. GPX TRACKS
export const INITIAL_GPX_TRACKS: GPXTrack[] = [
  {
    id: 'gpx-aveyron',
    organizerId: 'org-rodez',
    title: 'Boucle des Causses du Grand Rodez',
    discipline: 'TRAIL',
    distanceKm: 34.5,
    elevationGainM: 1280,
    elevationLossM: 1280,
    filename: 'trail_causses_rodez_34k.gpx',
    createdAt: '2025-01-10',
    points: generateGpxPoints(44.3517, 2.5719, 60, 550, 480),
    checkpoints: [
      { id: 'cp1', name: 'Départ - Place d’Armes Rodez', kmLocation: 0, lat: 44.3517, lng: 2.5719 },
      { id: 'cp2', name: 'CP1 - Ravitaillement Sainte-Radegonde', kmLocation: 12.2, lat: 44.332, lng: 2.610, cutoffTime: '11:30' },
      { id: 'cp3', name: 'CP2 - Bellevue Olemps', kmLocation: 24.8, lat: 44.321, lng: 2.540, cutoffTime: '14:00' },
      { id: 'cp4', name: 'Arrivée - Cathédrale de Rodez', kmLocation: 34.5, lat: 44.3517, lng: 2.5719 }
    ]
  },
  {
    id: 'gpx-rando-aveyron',
    organizerId: 'org-rodez',
    title: 'Circuit Panoramique de l’Aveyron',
    discipline: 'RANDO',
    distanceKm: 18.2,
    elevationGainM: 420,
    elevationLossM: 420,
    filename: 'rando_aveyron_18k.gpx',
    createdAt: '2025-02-01',
    points: generateGpxPoints(44.3600, 2.5800, 40, 520, 210),
    checkpoints: [
      { id: 'cp1', name: 'Départ - Belvédère', kmLocation: 0, lat: 44.3600, lng: 2.5800 },
      { id: 'cp2', name: 'Point d’Eau - Viaduc', kmLocation: 9.5, lat: 44.3750, lng: 2.6100 },
      { id: 'cp3', name: 'Arrivée - Belvédère', kmLocation: 18.2, lat: 44.3600, lng: 2.5800 }
    ]
  },
  {
    id: 'gpx-sapins-jura',
    organizerId: 'org-jura',
    title: 'Tour des Sapins et Crêtes du Haut-Jura',
    discipline: 'VTT',
    distanceKm: 46.0,
    elevationGainM: 1650,
    elevationLossM: 1650,
    filename: 'vtt_sapins_jura_46k.gpx',
    createdAt: '2025-01-18',
    points: generateGpxPoints(46.4800, 5.8800, 55, 920, 610),
    checkpoints: [
      { id: 'cp1', name: 'Départ - Station des Rousses', kmLocation: 0, lat: 46.4800, lng: 5.8800 },
      { id: 'cp2', name: 'CP1 - Ravitaillement du Lac', kmLocation: 18.5, lat: 46.5100, lng: 5.9200, cutoffTime: '12:00' },
      { id: 'cp3', name: 'CP2 - Col de la Faucille', kmLocation: 32.0, lat: 46.4400, lng: 5.9500, cutoffTime: '14:30' },
      { id: 'cp4', name: 'Arrivée - Les Rousses Centre', kmLocation: 46.0, lat: 46.4800, lng: 5.8800 }
    ]
  },
  {
    id: 'gpx-lacs-jura',
    organizerId: 'org-jura',
    title: 'Sentier des 4 Lacs du Jura',
    discipline: 'HORSETRAIL',
    distanceKm: 25.0,
    elevationGainM: 580,
    elevationLossM: 580,
    filename: 'horsetrail_lacs_jura_25k.gpx',
    createdAt: '2025-02-14',
    points: generateGpxPoints(46.5500, 5.8200, 42, 780, 290),
    checkpoints: [
      { id: 'cp1', name: 'Départ - Écurie des Lacs', kmLocation: 0, lat: 46.5500, lng: 5.8200 },
      { id: 'cp2', name: 'Relais Équestre - Ilay', kmLocation: 13.0, lat: 46.5800, lng: 5.8500 },
      { id: 'cp3', name: 'Arrivée - Écurie des Lacs', kmLocation: 25.0, lat: 46.5500, lng: 5.8200 }
    ]
  },
  {
    id: 'gpx-ultra-alpes',
    organizerId: 'org-alpes',
    title: 'Ultra Traversée des Crêtes Alpine 80K',
    discipline: 'TRAIL',
    distanceKm: 82.4,
    elevationGainM: 4600,
    elevationLossM: 4600,
    filename: 'ultra_cretes_alpes_82k.gpx',
    createdAt: '2024-12-05',
    points: generateGpxPoints(45.9237, 6.8694, 80, 1030, 1850),
    checkpoints: [
      { id: 'cp1', name: 'Départ - Place de Chamonix', kmLocation: 0, lat: 45.9237, lng: 6.8694 },
      { id: 'cp2', name: 'CP1 - Refuge du Plan de l’Aiguille', kmLocation: 16.0, lat: 45.9000, lng: 6.8800, cutoffTime: '08:30' },
      { id: 'cp3', name: 'CP2 - Col de Balme (Suisse)', kmLocation: 38.0, lat: 46.0300, lng: 6.9800, cutoffTime: '13:00' },
      { id: 'cp4', name: 'CP3 - La Flégère', kmLocation: 62.0, lat: 45.9600, lng: 6.8900, cutoffTime: '18:00' },
      { id: 'cp5', name: 'Arrivée - Chamonix Mont-Blanc', kmLocation: 82.4, lat: 45.9237, lng: 6.8694 }
    ]
  },
  {
    id: 'gpx-trail-blanc',
    organizerId: 'org-alpes',
    title: 'Trail Blanc des Glaciers',
    discipline: 'TRAIL',
    distanceKm: 21.0,
    elevationGainM: 1100,
    elevationLossM: 1100,
    filename: 'trail_blanc_glaciers_21k.gpx',
    createdAt: '2025-01-22',
    points: generateGpxPoints(45.9300, 6.8700, 45, 1250, 680),
    checkpoints: [
      { id: 'cp1', name: 'Départ - Station', kmLocation: 0, lat: 45.9300, lng: 6.8700 },
      { id: 'cp2', name: 'Ravitaillement Chaud - km 11', kmLocation: 11.0, lat: 45.9500, lng: 6.9000 },
      { id: 'cp3', name: 'Arrivée - Station', kmLocation: 21.0, lat: 45.9300, lng: 6.8700 }
    ]
  }
];

// 3. RACES
export const INITIAL_RACES: Race[] = [
  // Organisateur A - Trail de Rodez (85 registered runners total)
  {
    id: 'race-rodez-1',
    organizerId: 'org-rodez',
    code: 'AVE2027',
    title: 'Trail des Causses',
    discipline: 'TRAIL',
    date: '2027-05-15',
    startTime: '08:00',
    location: 'Rodez (Aveyron)',
    description: 'Trail magnifique sur les causses aveyronnais avec passages techniques et panoramas spectaculaires.',
    gpxTrackId: 'gpx-aveyron',
    maxRunners: 200,
    status: 'ONGOING',
    edition: 4,
    priceEur: 28,
    runnerCount: 52
  },
  {
    id: 'race-rodez-2',
    organizerId: 'org-rodez',
    code: 'ROD2027',
    title: "Randonnée de l'Aveyron",
    discipline: 'RANDO',
    date: '2027-06-20',
    startTime: '09:00',
    location: 'Rodez / Olemps',
    description: 'Marche conviviale ouverte à tous à travers le patrimoine naturel de la vallée de l’Aveyron.',
    gpxTrackId: 'gpx-rando-aveyron',
    maxRunners: 150,
    status: 'UPCOMING',
    edition: 2,
    priceEur: 12,
    runnerCount: 33
  },

  // Organisateur B - Trail du Jura (42 registered runners total)
  {
    id: 'race-jura-1',
    organizerId: 'org-jura',
    code: 'SAP2027',
    title: 'Trail des Sapins',
    discipline: 'VTT',
    date: '2027-07-04',
    startTime: '08:30',
    location: 'Les Rousses (Jura)',
    description: 'Parcours VTT exigeant et ludique au cœur des forêts de sapins centenaires du Haut-Jura.',
    gpxTrackId: 'gpx-sapins-jura',
    maxRunners: 120,
    status: 'UPCOMING',
    edition: 3,
    priceEur: 35,
    runnerCount: 26
  },
  {
    id: 'race-jura-2',
    organizerId: 'org-jura',
    code: 'LAC2027',
    title: 'Randonnée Équestre des Lacs',
    discipline: 'HORSETRAIL',
    date: '2027-08-12',
    startTime: '09:30',
    location: 'Grandvaux (Jura)',
    description: 'Parcours équestre guidé autour des lacs jurassiens avec haltes ravitaillement pour cavaliers et montures.',
    gpxTrackId: 'gpx-lacs-jura',
    maxRunners: 50,
    status: 'UPCOMING',
    edition: 1,
    priceEur: 40,
    runnerCount: 16
  },

  // Organisateur C - Trail des Alpes (110 registered runners total)
  {
    id: 'race-alpes-1',
    organizerId: 'org-alpes',
    code: 'ALP2027',
    title: 'Ultra des Crêtes',
    discipline: 'TRAIL',
    date: '2027-09-18',
    startTime: '05:00',
    location: 'Chamonix (Haute-Savoie)',
    description: 'Ultra-trail de haute montagne avec 4600m de D+, traversant les arrêtes mythiques du massif.',
    gpxTrackId: 'gpx-ultra-alpes',
    maxRunners: 300,
    status: 'ONGOING',
    edition: 6,
    priceEur: 85,
    runnerCount: 70
  },
  {
    id: 'race-alpes-2',
    organizerId: 'org-alpes',
    code: 'BLA2027',
    title: 'Trail Blanc des Glaciers',
    discipline: 'TRAIL',
    date: '2027-12-11',
    startTime: '10:00',
    location: 'Argentière (Haute-Savoie)',
    description: 'Course sur neige préparée avec vue panoramique sur la Mer de Glace et la chaîne du Mont-Blanc.',
    gpxTrackId: 'gpx-trail-blanc',
    maxRunners: 200,
    status: 'UPCOMING',
    edition: 5,
    priceEur: 30,
    runnerCount: 40
  }
];

// Helper to generate runners for a race
function generateRunnersForRace(raceId: string, organizerId: string, count: number, startBib: number): Runner[] {
  const firstNames = ['Thomas', 'Sophie', 'Alexandre', 'Camille', 'Julien', 'Élodie', 'Antoine', 'Claire', 'Mathieu', 'Marie', 'Hugo', 'Chloé', 'Nicolas', 'Manon', 'Lucas', 'Léa', 'Pierre', 'Julie', 'Maxime', 'Emma'];
  const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Fournier', 'Morel'];
  const categories = ['Senior H', 'Senior F', 'M1 H', 'M1 F', 'M2 H', 'Master F', 'VTT Électrique', 'Cavalier Solo'];

  const runners: Runner[] = [];
  for (let i = 0; i < count; i++) {
    const fname = firstNames[i % firstNames.length];
    const lname = lastNames[(i * 3) % lastNames.length];
    const bib = startBib + i;
    const isFinished = i < Math.floor(count * 0.4);
    const isOnTrack = i >= Math.floor(count * 0.4) && i < Math.floor(count * 0.85);

    let status: Runner['status'] = 'REGISTERED';
    let finishTime: string | undefined = undefined;
    let finishSecs: number | undefined = undefined;

    if (isFinished) {
      status = 'FINISHED';
      const baseSecs = 3600 * 2 + i * 180 + Math.floor(Math.random() * 60);
      const hrs = String(Math.floor(baseSecs / 3600)).padStart(2, '0');
      const mins = String(Math.floor((baseSecs % 3600) / 60)).padStart(2, '0');
      const secs = String(baseSecs % 60).padStart(2, '0');
      finishTime = `${hrs}:${mins}:${secs}`;
      finishSecs = baseSecs;
    } else if (isOnTrack) {
      status = 'ON_TRACK';
    }

    runners.push({
      id: `runner-${raceId}-${i + 1}`,
      raceId,
      organizerId,
      bibNumber: bib,
      firstName: fname,
      lastName: lname,
      email: `${fname.toLowerCase()}.${lname.toLowerCase()}@email.com`,
      category: categories[i % categories.length],
      emergencyContact: `Contact ${lname}`,
      emergencyPhone: `06 00 ${10 + i} ${20 + i} ${30 + i}`,
      registeredAt: new Date(Date.now() - (30 - i) * 86400000).toISOString().split('T')[0],
      status,
      checkInTimes: {
        cp1: '08:15',
        cp2: isFinished || isOnTrack ? '10:45' : ''
      },
      finishTime,
      finishTimeSeconds: finishSecs,
      rankOverall: isFinished ? i + 1 : undefined,
      rankCategory: isFinished ? Math.floor(i / 2) + 1 : undefined
    });
  }
  return runners;
}

// 4. RUNNERS (Exact counts matching 85 for Rodez, 42 for Jura, 110 for Alpes)
export const INITIAL_RUNNERS: Runner[] = [
  ...generateRunnersForRace('race-rodez-1', 'org-rodez', 52, 101),
  ...generateRunnersForRace('race-rodez-2', 'org-rodez', 33, 201),
  ...generateRunnersForRace('race-jura-1', 'org-jura', 26, 301),
  ...generateRunnersForRace('race-jura-2', 'org-jura', 16, 401),
  ...generateRunnersForRace('race-alpes-1', 'org-alpes', 70, 501),
  ...generateRunnersForRace('race-alpes-2', 'org-alpes', 40, 601),
];

// 5. PAST EDITIONS ARCHIVES
export const INITIAL_PAST_EDITIONS: PastEditionArchive[] = [
  {
    id: 'past-rodez-2026',
    raceId: 'race-rodez-1',
    organizerId: 'org-rodez',
    editionYear: 2026,
    title: 'Trail des Causses - Édition 2026',
    discipline: 'TRAIL',
    totalRunners: 142,
    winnerName: 'Benjamin Vaysse',
    winnerTime: '02:48:12',
    date: '2026-05-17',
    gpxPreserved: true,
    distanceKm: 34.5,
    elevationGainM: 1280
  },
  {
    id: 'past-jura-2026',
    raceId: 'race-jura-1',
    organizerId: 'org-jura',
    editionYear: 2026,
    title: 'Trail des Sapins VTT - Édition 2026',
    discipline: 'VTT',
    totalRunners: 98,
    winnerName: 'Cédric Vuillermoz',
    winnerTime: '01:52:40',
    date: '2026-07-05',
    gpxPreserved: true,
    distanceKm: 46.0,
    elevationGainM: 1650
  },
  {
    id: 'past-alpes-2026',
    raceId: 'race-alpes-1',
    organizerId: 'org-alpes',
    editionYear: 2026,
    title: 'Ultra des Crêtes 80K - Édition 2026',
    discipline: 'TRAIL',
    totalRunners: 240,
    winnerName: 'Ludovic Pommeret',
    winnerTime: '09:14:05',
    date: '2026-09-19',
    gpxPreserved: true,
    distanceKm: 82.4,
    elevationGainM: 4600
  }
];

// 6. INITIAL PLATFORM GLOBAL STATS
export const INITIAL_PLATFORM_STATS: PlatformStats = {
  totalOrganizers: 3,
  activeOrganizers: 3,
  totalRaces: 6,
  totalRunners: 237,
  totalGpxTracks: 6,
  monthlyRevenueEur: 840
};
