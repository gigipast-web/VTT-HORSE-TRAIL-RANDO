import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { GPXTrack, Checkpoint } from '../types';
import { Download, MapPin, Navigation, Flag, Mountain, Layers, Eye } from 'lucide-react';

interface GPXMapProps {
  track: GPXTrack;
  checkpoints?: Checkpoint[];
  interactive?: boolean;
  height?: string;
}

export const GPXMap: React.FC<GPXMapProps> = ({
  track,
  checkpoints = track.checkpoints,
  interactive = true,
  height = 'h-80'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [activeTile, setActiveTile] = useState<'dark' | 'topo' | 'osm'>('dark');
  const [hoverPoint, setHoverPoint] = useState<{ lat: number; lng: number; ele?: number; km: number } | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing map instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    if (!track.points || track.points.length === 0) return;

    // Calculate map center & bounds
    const latLngs: [number, number][] = track.points.map((p) => [p.lat, p.lng]);
    const firstPoint = latLngs[0];
    const map = L.map(mapContainerRef.current, {
      zoomControl: interactive,
      scrollWheelZoom: interactive,
      dragging: interactive,
      touchZoom: interactive
    }).setView(firstPoint, 12);

    mapInstanceRef.current = map;

    // Tile layers
    let tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    if (activeTile === 'topo') {
      tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    } else if (activeTile === 'osm') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }

    L.tileLayer(tileUrl, {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map);

    // Draw track polyline
    const polyline = L.polyline(latLngs, {
      color: '#10b981', // emerald-500
      weight: 4,
      opacity: 0.9,
      lineJoin: 'round'
    }).addTo(map);

    // Fit bounds to polyline
    map.fitBounds(polyline.getBounds(), { padding: [30, 30] });

    // Custom Icon Generator
    const createCustomIcon = (bgColor: string, text: string, iconSymbol: string) => {
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="background-color:${bgColor};" class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white transition-transform hover:scale-110">
          <span>${iconSymbol}</span>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    };

    // Start Marker
    if (latLngs.length > 0) {
      const startPoint = latLngs[0];
      L.marker(startPoint, {
        icon: createCustomIcon('#059669', 'S', '🏁')
      })
        .addTo(map)
        .bindPopup(`<b>Départ</b><br/>${track.title}`);
    }

    // Finish Marker
    if (latLngs.length > 1) {
      const finishPoint = latLngs[latLngs.length - 1];
      L.marker(finishPoint, {
        icon: createCustomIcon('#dc2626', 'F', '🏆')
      })
        .addTo(map)
        .bindPopup(`<b>Arrivée (${track.distanceKm} km)</b><br/>D+: ${track.elevationGainM}m`);
    }

    // Checkpoint Markers
    if (checkpoints && checkpoints.length > 0) {
      checkpoints.forEach((cp, idx) => {
        if (cp.kmLocation > 0 && cp.kmLocation < track.distanceKm) {
          L.marker([cp.lat, cp.lng], {
            icon: createCustomIcon('#2563eb', `CP${idx}`, '📍')
          })
            .addTo(map)
            .bindPopup(
              `<b>${cp.name}</b><br/>
               Ravitaillement km ${cp.kmLocation}<br/>
               ${cp.cutoffTime ? `<span style="color:#f59e0b;">Barrière horaire: ${cp.cutoffTime}</span>` : ''}`
            );
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [track, checkpoints, activeTile, interactive]);

  // Download raw GPX XML file
  const handleDownloadGpx = () => {
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="VTT HORSETRAIL-RANDO Platform">
  <metadata>
    <name>${track.title}</name>
    <desc>${track.discipline} - Distance: ${track.distanceKm}km, D+: ${track.elevationGainM}m</desc>
  </metadata>
  <trk>
    <name>${track.title}</name>
    <type>${track.discipline}</type>
    <trkseg>`;

    track.points.forEach((pt) => {
      xmlContent += `\n      <trkpt lat="${pt.lat}" lon="${pt.lng}">${pt.ele !== undefined ? `<ele>${pt.ele}</ele>` : ''}</trkpt>`;
    });

    xmlContent += `\n    </trkseg>\n  </trk>\n</gpx>`;

    const blob = new Blob([xmlContent], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = track.filename || `${track.title.toLowerCase().replace(/\s+/g, '_')}.gpx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Elevation SVG graph generator
  const minEle = Math.min(...track.points.map((p) => p.ele || 0));
  const maxEle = Math.max(...track.points.map((p) => p.ele || 100));
  const eleRange = Math.max(100, maxEle - minEle);

  const svgWidth = 600;
  const svgHeight = 100;

  const svgPoints = track.points
    .map((pt, idx) => {
      const x = (idx / (track.points.length - 1)) * svgWidth;
      const ele = pt.ele || minEle;
      const y = svgHeight - 10 - ((ele - minEle) / eleRange) * (svgHeight - 20);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const areaPoints = `0,${svgHeight} ${svgPoints} ${svgWidth},${svgHeight}`;

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-slate-950/80 border border-slate-800 p-4 shadow-xl">
      {/* Map Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-100 text-sm md:text-base flex items-center gap-2">
              {track.title}
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono border border-emerald-500/30">
                {track.discipline}
              </span>
            </h4>
            <p className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
              <span>📏 {track.distanceKm} km</span>
              <span>⛰️ D+ {track.elevationGainM} m</span>
              <span>📍 {checkpoints.length} points de passage</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tile Selector */}
          <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs">
            <button
              onClick={() => setActiveTile('dark')}
              className={`px-2.5 py-1 rounded-md transition ${activeTile === 'dark' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Sombre
            </button>
            <button
              onClick={() => setActiveTile('topo')}
              className={`px-2.5 py-1 rounded-md transition ${activeTile === 'topo' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Topo
            </button>
            <button
              onClick={() => setActiveTile('osm')}
              className={`px-2.5 py-1 rounded-md transition ${activeTile === 'osm' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Standard
            </button>
          </div>

          <button
            onClick={handleDownloadGpx}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs shadow-md transition active:scale-95"
            title="Télécharger le fichier GPX officiel"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Fichier GPX</span>
          </button>
        </div>
      </div>

      {/* Map Display */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner">
        <div ref={mapContainerRef} className={`w-full ${height} z-10`} />

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-20 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700/80 text-[11px] flex items-center gap-3 text-slate-300">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Départ
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Checkpoints
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Arrivée
          </span>
        </div>
      </div>

      {/* Elevation Graph */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="flex items-center gap-1 font-medium text-slate-300">
            <Mountain className="w-3.5 h-3.5 text-emerald-400" /> Profil altimétrique GPX
          </span>
          <span className="text-slate-500">
            Alt. min: <strong className="text-slate-300">{minEle}m</strong> | Alt. max: <strong className="text-slate-300">{maxEle}m</strong>
          </span>
        </div>

        <div className="relative w-full h-24 overflow-hidden">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full preserve-3d" preserveAspectRatio="none">
            <defs>
              <linearGradient id="eleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Area fill */}
            <polygon points={areaPoints} fill="url(#eleGradient)" />
            {/* Stroke line */}
            <polyline points={svgPoints} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          {/* Hover overlay stats */}
          {hoverPoint && (
            <div className="absolute top-2 right-2 bg-slate-950/90 border border-slate-700 px-2 py-1 rounded text-xs text-emerald-400 font-mono">
              Km {hoverPoint.km.toFixed(1)} : {hoverPoint.ele}m
            </div>
          )}
        </div>

        <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
          <span>0.0 km (0m)</span>
          <span>{(track.distanceKm / 2).toFixed(1)} km</span>
          <span>{track.distanceKm} km ({maxEle}m)</span>
        </div>
      </div>
    </div>
  );
};
