import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { COUNTRIES_DATA } from '../data/countries';
import { sfx } from '../lib/audio';
import { Plus, Minus, RotateCcw, MapPin, ZoomIn, Compass } from 'lucide-react';

interface InteractiveWorldMapProps {
  activeCountryId: string;
  onCountrySelect: (id: string) => void;
}

export const InteractiveWorldMap: React.FC<InteractiveWorldMapProps> = ({
  activeCountryId,
  onCountrySelect,
}) => {
  const { currentUser } = useGame();
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Zoom and pan state
  const [zoom, setZoom] = useState(1.1);
  const [pan, setPan] = useState({ x: -20, y: 15 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const mapRef = useRef<SVGSVGElement | null>(null);

  // Width and height of initial projection canvas
  const width = 800;
  const height = 480;

  // Track coordinates and projections
  useEffect(() => {
    let active = true;
    const fetchGeoJSON = async () => {
      try {
        setLoading(true);
        // Load clean, lightweight, custom countries coordinates geojson
        const response = await fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json');
        if (!response.ok) throw new Error('Failed to fetch map data');
        const data = await response.json();
        if (active) {
          setGeoData(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading world map GeoJSON, attempting fallback Highcharts URL', err);
        // Fallback to Highcharts world map collection in case of CDN limits
        try {
          const fbResponse = await fetch('https://code.highcharts.com/mapdata/custom/world.geo.json');
          if (!fbResponse.ok) throw new Error('Fallback failed');
          const fbData = await fbResponse.json();
          if (active) {
            setGeoData(fbData);
            setLoading(false);
          }
        } catch (fbErr) {
          console.error('All GeoJSON fetches failed, using fallback mock coordinates', fbErr);
          if (active) {
            setError(true);
            setLoading(false);
          }
        }
      }
    };

    fetchGeoJSON();
    return () => {
      active = false;
    };
  }, []);

  // Map latitude and longitude to Mercator coordinates (scaled for our SVG)
  const project = (lat: number, lng: number) => {
    // Equirectangular / Miller projection approximation for children learning geography
    // This maintains excellent horizontal layout, perfectly lining up flags to children expectations
    const x = ((lng + 180) * width) / 360;
    
    // Latitude scaling with standard limits to prevent infinity
    let latRad = (lat * Math.PI) / 180;
    if (lat > 84) lat = 84;
    if (lat < -80) lat = -80;
    latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = height / 2 - (width * mercN) / (2 * Math.PI);
    
    // Adjust height offset to fit comfortably on screen
    return [x, y * 0.95 + 40];
  };

  // Convert geometry into SVG Path string
  const getPathData = (geometry: any): string => {
    if (!geometry) return '';
    const { type, coordinates } = geometry;

    const projectPoint = (pt: number[]) => {
      const [x, y] = project(pt[1], pt[0]);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    };

    if (type === 'Polygon') {
      return coordinates
        .map((ring: any) => 'M' + ring.map(projectPoint).join(' L') + ' Z')
        .join(' ');
    } else if (type === 'MultiPolygon') {
      return coordinates
        .map((polygon: any) =>
          polygon.map((ring: any) => 'M' + ring.map(projectPoint).join(' L') + ' Z').join(' ')
        )
        .join(' ');
    }
    return '';
  };

  // Match GeoJSON country with our WC dataset
  const getMatchingWCCountry = (feature: any) => {
    const props = feature.properties;
    if (!props) return null;

    // Standard properties inside standard GeoJSONs: iso_a2, iso2, id, hc-key
    const iso2 = (
      props.iso_a2 ||
      props.iso_a2_eh ||
      props.iso2 ||
      props['iso-a2'] ||
      props.id ||
      props['hc-key'] ||
      ''
    ).toLowerCase();

    if (iso2) {
      const match = COUNTRIES_DATA.find((c) => c.id === iso2);
      if (match) return match;
    }

    const name = (props.name || props.NAME || props.country || '').toLowerCase();
    if (name) {
      const match = COUNTRIES_DATA.find((c) => c.name.toLowerCase() === name);
      if (match) return match;
    }

    return null;
  };

  // Dragging event handlers for pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (factor: number) => {
    sfx.playCoin();
    setZoom((prev) => Math.min(Math.max(prev * factor, 0.5), 6));
  };

  const handleReset = () => {
    sfx.playCoin();
    setZoom(1.1);
    setPan({ x: -20, y: 15 });
  };

  return (
    <div className="relative w-full bg-slate-900 rounded-[32px] overflow-hidden border border-slate-800 shadow-2xl flex flex-col h-[400px]">
      {/* Map Control Headers */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-800">
        <Compass className="w-4 h-4 text-sky-400 animate-spin-gentle" />
        <span className="text-xs font-mono font-black text-white uppercase tracking-wider">
          Real Geography Map
        </span>
      </div>

      {/* Floating Action Map tools */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-1.5">
        <button
          onClick={() => handleZoom(1.2)}
          className="p-2.5 bg-slate-950/90 hover:bg-indigo-600 text-white rounded-xl border border-slate-800 hover:border-indigo-500 transition shadow hover:scale-105 active:scale-95 cursor-pointer"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(0.8)}
          className="p-2.5 bg-slate-950/90 hover:bg-indigo-600 text-white rounded-xl border border-slate-800 hover:border-indigo-500 transition shadow hover:scale-105 active:scale-95 cursor-pointer"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="p-2.5 bg-slate-950/90 hover:bg-indigo-600 text-white rounded-xl border border-slate-800 hover:border-indigo-500 transition shadow hover:scale-105 active:scale-95 cursor-pointer"
          title="Reset Map View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Actual SVG World Map Frame */}
      <div
        className={`w-full h-full relative cursor-grab select-none ${isDragging ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-white gap-3 z-15">
            <div className="relative">
              <span className="text-5xl animate-bounce inline-block">⚽</span>
              <span className="absolute -right-2 -bottom-2 text-2xl animate-spin-gentle inline-block">🌍</span>
            </div>
            <p className="text-xs font-mono font-extrabold text-indigo-400 uppercase tracking-widest animate-pulse mt-2">
              Plotting Continents & Borders...
            </p>
          </div>
        ) : error || !geoData ? (
          // Beautiful interactive fallback representation of coordinates
          <div className="absolute inset-0 bg-slate-950 flex flex-col justify-between p-6">
            <div className="text-center mt-6">
              <span className="text-4xl block mb-2">🗺️</span>
              <p className="text-sm font-display font-black text-white">WORLD CUP EXPLORER GRID</p>
              <p className="text-[10px] text-slate-400 max-w-xs mx-auto mt-1">
                Pinpointing competitive countries in our system. Tap a coordinate node:
              </p>
            </div>
            
            <div className="relative flex-1 bg-indigo-950/30 border border-slate-800/80 rounded-2xl p-4 my-4 overflow-hidden shadow-inner flex items-center justify-center">
              {/* Fallback stylized nodes layout */}
              <div className="absolute inset-0 opacity-20 border-2 border-dashed border-slate-800 rounded-full scale-75 animate-pulse" />
              {COUNTRIES_DATA.map((c) => {
                const isActive = c.id === activeCountryId;
                const explored = currentUser?.exploredCountries.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => onCountrySelect(c.id)}
                    style={{ left: `${c.coordinates.x}%`, top: `${c.coordinates.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-25"
                  >
                    <span className="relative flex h-4 w-4">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isActive ? 'bg-rose-500' : 'bg-amber-400'
                      }`} />
                      <span className={`relative inline-flex rounded-full h-4 w-4 border-2 border-white ${
                        isActive ? 'bg-rose-500' : explored ? 'bg-emerald-400' : 'bg-amber-400'
                      }`} />
                    </span>
                    <span className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-750 text-white font-mono text-[9px] px-2 py-0.5 rounded shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-150 z-30 font-black">
                      {c.flag} {c.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <svg
            ref={mapRef}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full bg-[#1e293b]"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Ambient Map Grids (Meridians) */}
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} className="opacity-15">
              {Array.from({ length: 18 }).map((_, i) => {
                const lng = -180 + i * 20;
                const [x1] = project(90, lng);
                const [x2] = project(-90, lng);
                return (
                  <line
                    key={`meridian-${i}`}
                    x1={x1}
                    y1={10}
                    x2={x2}
                    y2={height - 10}
                    stroke="#ffffff"
                    strokeWidth="0.5"
                    strokeDasharray="4,4"
                  />
                );
              })}
              {Array.from({ length: 10 }).map((_, i) => {
                const lat = -80 + i * 16;
                const [, y1] = project(lat, -180);
                const [, y2] = project(lat, 180);
                return (
                  <line
                    key={`parallel-${i}`}
                    x1={10}
                    y1={y1}
                    x2={width - 10}
                    y2={y2}
                    stroke="#ffffff"
                    strokeWidth="0.5"
                    strokeDasharray="4,4"
                  />
                );
              })}
            </g>

            {/* Main Interactive Map Layer */}
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {geoData.features.map((feature: any, index: number) => {
                const wcCountry = getMatchingWCCountry(feature);
                const isSelected = wcCountry ? wcCountry.id === activeCountryId : false;
                const isExplored = wcCountry ? currentUser?.exploredCountries.includes(wcCountry.id) : false;

                // Color configuration: Sleek high-fidelity theme colors
                let fill = '#334155'; // Non-WCCountry slate-700
                let stroke = '#1e293b'; // Slate-800 edge lines
                let strokeWidth = '0.5';

                if (wcCountry) {
                  strokeWidth = isSelected ? '1.5' : '1';
                  stroke = isSelected ? '#f43f5e' : '#ffffff'; // Rose red for active, white border for WC

                  // Color gradient states based on game progress
                  if (isSelected) {
                    fill = '#ef4444'; // Bright Crimson Active selection
                  } else if (isExplored) {
                    fill = '#10b981'; // Green explored stamp
                  } else {
                    fill = '#eab308'; // Amber ready-to-test
                  }
                }

                const pathString = getPathData(feature.geometry);
                if (!pathString) return null;

                return (
                  <path
                    key={`country-${index}`}
                    d={pathString}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    className={`transition-all duration-200 ${
                      wcCountry
                        ? 'cursor-pointer hover:fill-indigo-400 hover:stroke-white'
                        : 'opacity-70'
                    }`}
                    onClick={() => {
                      if (wcCountry) {
                        onCountrySelect(wcCountry.id);
                      }
                    }}
                  >
                    <title>
                      {feature.properties?.name || 'Unknown Country'}
                      {wcCountry ? ` (⚽ World Cup Competing!)` : ''}
                    </title>
                  </path>
                );
              })}

              {/* Floating Pins for the Competitors for tactile selection */}
              {COUNTRIES_DATA.map((c) => {
                const isActive = c.id === activeCountryId;
                const explored = currentUser?.exploredCountries.includes(c.id);
                const [px, py] = project(c.coordinates.lat, c.coordinates.lng);

                return (
                  <g
                    key={`pin-${c.id}`}
                    transform={`translate(${px}, ${py})`}
                    className="cursor-pointer"
                    onClick={() => {
                      onCountrySelect(c.id);
                    }}
                  >
                    {/* Ring glow */}
                    <circle
                      r={isActive ? 12 : 6}
                      fill="none"
                      stroke={isActive ? '#ef4444' : '#eab308'}
                      strokeWidth={isActive ? '2' : '1.5'}
                      className={isActive ? 'animate-ping' : ''}
                      opacity={isActive ? 0.6 : 0.8}
                    />
                    {/* Small inner map pin head */}
                    <circle
                      r={explored ? 4 : isActive ? 5 : 3.5}
                      fill={isActive ? '#ef4444' : explored ? '#10b981' : '#f59e0b'}
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                  </g>
                );
              })}
            </g>
          </svg>
        )}
      </div>

      {/* Quick Interactive Map Footer Bar */}
      <div className="h-12 bg-slate-950 shrink-0 border-t border-slate-800 flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-slate-800" />
          <span>Locked Goal</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-800 ml-2" />
          <span>Explored/Stamped</span>
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-slate-800 ml-2 animate-pulse" />
          <span className="font-bold text-white">Active selection</span>
        </div>
        <span className="hidden sm:inline text-[10px] font-mono text-slate-500">
          Tip: Grab / drag to pan, scroll to zoom!
        </span>
      </div>
    </div>
  );
};
