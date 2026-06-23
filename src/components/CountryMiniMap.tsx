import React, { useState, useEffect } from 'react';
import { Country } from '../types';
import { Compass, MapPin, Globe, Loader2 } from 'lucide-react';

interface CountryMiniMapProps {
  country: Country;
}

export const CountryMiniMap: React.FC<CountryMiniMapProps> = ({ country }) => {
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchLocalGeo = async () => {
      try {
        setLoading(true);
        // Load the lightweight world geojson
        const response = await fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json');
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        if (active) {
          setGeoData(data);
          setLoading(false);
        }
      } catch (err) {
        // Fallback to highcharts world map
        try {
          const response = await fetch('https://code.highcharts.com/mapdata/custom/world.geo.json');
          if (!response.ok) throw new Error('Fallback fail');
          const data = await response.json();
          if (active) {
            setGeoData(data);
            setLoading(false);
          }
        } catch (fbErr) {
          console.error("Could not fetch mini-map geometry:", fbErr);
          if (active) setLoading(false);
        }
      }
    };

    fetchLocalGeo();
    return () => {
      active = false;
    };
  }, []);

  const width = 360;
  const height = 200;

  // Simple Mercator Projection local to this mini-map box
  const project = (lat: number, lng: number, centerLat: number, centerLng: number, zoomFactor: number) => {
    // Difference from center in degrees
    const dLng = lng - centerLng;
    const dLat = lat - centerLat;

    // Scale differences to fit coordinate canvas
    const x = width / 2 + dLng * zoomFactor;
    // Note latitude is inverted in SVG y-axis
    const y = height / 2 - dLat * zoomFactor * 1.25;

    return [x, y];
  };

  // Estimate zoom factor based on country area or default
  const getZoomFactor = (areaStr: string) => {
    const area = parseFloat(areaStr.replace(/[^0-9.]/g, ''));
    if (isNaN(area)) return 4;
    if (area > 5000000) return 0.8; // Very large countries (Russia, Canada, Brazil, USA, China)
    if (area > 1000000) return 2.2; // Large countries Maximize
    if (area > 300000) return 4.5;  // Medium countries
    return 8; // Small countries (like Switzerland, Belgium, Denmark, Croatia)
  };

  const centerLat = country.coordinates.lat;
  const centerLng = country.coordinates.lng;
  const zoomFactor = getZoomFactor(country.area);

  // Parse path data for matching country or neighbors
  const getCountryPath = (geom: any) => {
    if (!geom) return '';
    const { type, coordinates } = geom;

    const projectPoint = (pt: number[]) => {
      const [x, y] = project(pt[1], pt[0], centerLat, centerLng, zoomFactor);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    };

    if (type === 'Polygon') {
      return coordinates
        .map((ring: any[]) => 'M ' + ring.map(projectPoint).join(' L ') + ' Z')
        .join(' ');
    } else if (type === 'MultiPolygon') {
      return coordinates
        .map((poly: any[][]) =>
          poly.map((ring) => 'M ' + ring.map(projectPoint).join(' L ') + ' Z').join(' ')
        )
        .join(' ');
    }
    return '';
  };

  // Find country features that lie in the bounding box around our active country
  const renderedFeatures = React.useMemo(() => {
    if (!geoData || !geoData.features) return [];
    
    // Sort so matching active country is drawn last/on top of neighbors
    return [...geoData.features].sort((a: any, b: any) => {
      const isAActive = checkFeatureMatch(a, country);
      const isBActive = checkFeatureMatch(b, country);
      if (isAActive && !isBActive) return 1;
      if (!isAActive && isBActive) return -1;
      return 0;
    });
  }, [geoData, country]);

  function checkFeatureMatch(feat: any, target: Country) {
    const iso2 = feat.properties?.iso_a2?.toLowerCase() || feat.id?.toLowerCase() || '';
    const name = (feat.properties?.name || '').toLowerCase();
    return iso2 === target.id.toLowerCase() || name === target.name.toLowerCase();
  }

  return (
    <div className="relative rounded-[24px] border-2 border-slate-900 bg-sky-50 shadow-md h-[240px] overflow-hidden group select-none">
      {/* Blueprint Grid Lines for Explorer Vibe */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:16px_16px]" />

      {/* Title Bar */}
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800 flex items-center gap-1.5 shadow-sm">
          <Compass className="w-3.5 h-3.5 text-yellow-400 animate-[spin_10s_linear_infinite]" />
          <span className="font-mono text-[9px] font-black text-white uppercase tracking-wider">
            {country.name} Geo-Spotlight
          </span>
        </div>

        <div className="bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-slate-200 text-slate-700 font-mono text-[8px] font-bold shadow-sm">
          LAT: {country.coordinates.lat.toFixed(2)}° | LNG: {country.coordinates.lng.toFixed(2)}°
        </div>
      </div>

      {loading ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
          <span className="text-[10px] font-mono font-bold text-slate-500">Loading radar coordinates...</span>
        </div>
      ) : (
        <svg className="w-full h-[200px]" viewBox={`0 0 ${width} ${height}`}>
          {/* Compass Rose Decoration */}
          <g transform={`translate(${width - 40}, ${height - 40})`} className="opacity-15 pointer-events-none">
            <circle r="25" fill="none" stroke="#0f172a" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="-30" y1="0" x2="30" y2="0" stroke="#0f172a" strokeWidth="1.5" />
            <line x1="0" y1="-30" x2="0" y2="30" stroke="#0f172a" strokeWidth="1.5" />
            <polygon points="0,-25 5,0 0,-3 -5,0" fill="#0f172a" />
            <polygon points="0,25 5,0 0,3 -5,0" fill="#0f172a" />
            <polygon points="-25,0 0,-5 -3,0 0,5" fill="#0f172a" />
            <polygon points="25,0 0,-5 3,0 0,5" fill="#0f172a" />
          </g>

          {/* Render Countries GeoJSON paths */}
          <g>
            {renderedFeatures.map((feat: any, idx: number) => {
              const isMatch = checkFeatureMatch(feat, country);
              const path = getCountryPath(feat.geometry);
              if (!path) return null;

              return (
                <path
                  key={idx}
                  d={path}
                  className={`transition-colors duration-500 stroke-2 outline-none ${
                    isMatch
                      ? 'fill-emerald-400 stroke-slate-900 shadow-lg'
                      : 'fill-slate-100/90 hover:fill-slate-200/90 stroke-slate-300'
                  }`}
                  style={{
                    filter: isMatch ? 'drop-shadow(2px 3px 0px rgba(15,23,42,0.15))' : 'none'
                  }}
                />
              );
            })}
          </g>

          {/* Beacon point indicating capital city */}
          <g>
            {(() => {
              const [x, y] = project(country.coordinates.lat, country.coordinates.lng, centerLat, centerLng, zoomFactor);
              
              // Only draw if within bounds
              if (x < 0 || x > width || y < 0 || y > height) return null;

              return (
                <g transform={`translate(${x}, ${y})`}>
                  {/* Glowing Radar Waves */}
                  <circle r="12" fill="none" stroke="#e11d48" strokeWidth="1.5" className="animate-ping" style={{ transformOrigin: 'center' }} />
                  <circle r="7" fill="#e11d48" className="opacity-25" />
                  <circle r="3.5" fill="#ffffff" stroke="#e11d48" strokeWidth="2" />
                  
                  {/* Small City Capital Label */}
                  <g transform="translate(8, -8)" className="pointer-events-none drop-shadow-sm">
                    <rect x="0" y="-12" width={country.capital.length * 6 + 10} height="16" rx="4" fill="#0f172a" opacity="0.95" />
                    <text x="5" y="0" fill="#ffffff" fontSize="8" fontFamily="monospace" fontWeight="bold">
                      ⭐ {country.capital}
                    </text>
                  </g>
                </g>
              );
            })()}
          </g>
        </svg>
      )}

      {/* Flag Overlay Badge */}
      <div className="absolute bottom-2 left-3 flex items-center gap-1.5 bg-white/95 border border-slate-900 rounded-xl px-2 py-1 shadow-sm font-display font-black text-xs text-slate-800">
        <span className="text-xl leading-none">{country.flag}</span>
        <span>{country.flag ? 'Flag of ' : ''} {country.name}</span>
      </div>

      {/* Scale Badge Overlay */}
      <div className="absolute bottom-2 right-3 font-mono text-[8px] font-bold bg-slate-900 text-white border border-slate-800 rounded px-1.5 py-0.5 shadow-sm">
        {country.area}
      </div>
    </div>
  );
};
