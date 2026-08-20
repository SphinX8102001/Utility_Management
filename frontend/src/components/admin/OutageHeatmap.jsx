import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Rectangle, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const DHAKA_CENTER = [23.8103, 90.4125];
const HEATMAP_ZOOM = 7;

// Same bounding box used in ResidentMapOverview.jsx for consistency
const BANGLADESH_BOUNDS = {
  minLat: 20.59,
  maxLat: 26.63,
  minLng: 88.01,
  maxLng: 92.67,
};

const GRID_COLS = 1000;
const GRID_ROWS = 1000;

// green -> yellow -> red based on relative density (0..1)
function densityColor(ratio) {
  if (ratio <= 0) return null; // empty cell, don't paint
  let r, g, b;
  if (ratio < 0.5) {
    const t = ratio / 0.5;
    r = Math.round(34 + t * (250 - 34));
    g = Math.round(197 + t * (204 - 197));
    b = Math.round(94 + t * (21 - 94));
  } else {
    const t = (ratio - 0.5) / 0.5;
    r = Math.round(250 + t * (239 - 250));
    g = Math.round(204 + t * (68 - 204));
    b = Math.round(21 + t * (68 - 21));
  }
  return `rgb(${r},${g},${b})`;
}

export function OutageHeatmap({ outages }) {
  const [loading, setLoading] = useState(false);

  const handleExportHeatmap = (format) => {
    setLoading(true);
    setTimeout(() => {
      if (format === 'csv') {
        let csvContent = 'data:text/csv;charset=utf-8,ID,UtilityType,Location,Latitude,Longitude,Upvotes\n';
        for (let i = 0; i < outages.length; i++) {
          const item = outages[i];
          csvContent += `${item._id},${item.utilityType},"${item.locationName}",${item.latitude},${item.longitude},${item.upvotes || 0}\n`;
        }
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'outage_heatmap_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (format === 'json') {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(outages, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', 'outage_heatmap_data.json');
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
      }
      setLoading(false);
    }, 500);
  };

  // Bin outages into a lat/lng grid across Bangladesh
  const { cells, maxCount } = useMemo(() => {
    const latStep = (BANGLADESH_BOUNDS.maxLat - BANGLADESH_BOUNDS.minLat) / GRID_ROWS;
    const lngStep = (BANGLADESH_BOUNDS.maxLng - BANGLADESH_BOUNDS.minLng) / GRID_COLS;

    const map = {};

    for (let i = 0; i < outages.length; i++) {
      const item = outages[i];
      const lat = parseFloat(item.latitude);
      const lng = parseFloat(item.longitude);
      if (isNaN(lat) || isNaN(lng)) continue;
// finding coordinates in the grid coordinate system (not the actual map)
      let col = Math.floor((lng - BANGLADESH_BOUNDS.minLng) / lngStep);
      let row = Math.floor((lat - BANGLADESH_BOUNDS.minLat) / latStep);
      col = Math.max(0, Math.min(GRID_COLS - 1, col));
      row = Math.max(0, Math.min(GRID_ROWS - 1, row));

      const key = `${row}-${col}`;
      if (!map[key]) {
        map[key] = {
          row,
          col,
          count: 0,
          items: [],
          bounds: [
            [BANGLADESH_BOUNDS.minLat + row * latStep, BANGLADESH_BOUNDS.minLng + col * lngStep],
            [BANGLADESH_BOUNDS.minLat + (row + 1) * latStep, BANGLADESH_BOUNDS.minLng + (col + 1) * lngStep],
          ],
        };
      }
      // weight by upvotes so heavily-confirmed outages contribute more heat, outage scores 1, upvotes add 0.5 each
      map[key].count += 1 + (item.upvotes || 0) * 0.5;
      map[key].items.push(item);
    }

    const cellList = Object.values(map);
    const maxCount = cellList.reduce((max, c) => Math.max(max, c.count), 0);
    return { cells: cellList, maxCount };
  }, [outages]);

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden">
      <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white">Complaint Density Heatmap</h3>
          <p className="text-[10px] text-slate-500">Regions turn red where outage reports cluster</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExportHeatmap('csv')}
            disabled={loading}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50"
          >
            Export CSV
          </button>
          <button
            onClick={() => handleExportHeatmap('json')}
            disabled={loading}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50"
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* Fixed height instead of flex-1/minHeight so Leaflet always gets a real pixel height at mount */}
      <div className="rounded-2xl overflow-hidden border border-slate-800 relative" style={{ height: '500px' }}>
        <MapContainer
          center={DHAKA_CENTER}
          zoom={HEATMAP_ZOOM}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {cells.map((cell) => {
            const ratio = maxCount > 0 ? cell.count / maxCount : 0;
            const color = densityColor(ratio);
            if (!color) return null;

            return (
              //Component: Draws a colored box on the map over each populated cell's geographic bounds (bounds). The fill opacity dynamically scales with intensity (0.45 + ratio * 0.35).
              // tooltip helps hovering over any rectangle displays a list of up to 4 outages reported in that specific cell zone.
              <Rectangle
                key={`${cell.row}-${cell.col}`}
                bounds={cell.bounds}
                pathOptions={{
                  color: color,
                  weight: 1,
                  fillColor: color,
                  fillOpacity: 0.45 + ratio * 0.35,
                }}
              >
                <Tooltip sticky>
                  <div style={{ fontFamily: 'sans-serif', fontSize: '11px' }}>
                    <strong>{cell.items.length} report{cell.items.length !== 1 ? 's' : ''}</strong>
                    <br />
                    {cell.items.slice(0, 4).map((item, idx) => (
                      <div key={idx}>
                        {item.utilityType} — {item.locationName}
                      </div>
                    ))}
                    {cell.items.length > 4 && <div>+{cell.items.length - 4} more</div>}
                  </div>
                </Tooltip>
              </Rectangle>
            );
          })}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-slate-950/90 border border-slate-800 rounded-lg px-3 py-2 flex items-center gap-2 z-[1000]">
          <span className="text-[10px] text-slate-400">Low</span>
          <div
            className="h-2.5 w-32 rounded-full"
            style={{
              background: 'linear-gradient(90deg, rgb(34,197,94), rgb(250,204,21), rgb(239,68,68))',
            }}
          />
          <span className="text-[10px] text-slate-400">High</span>
        </div>
      </div>

      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-40 overflow-y-auto">
        <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3">Top Heat Zones</h5>
        {cells.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No thermal data available.</p>
        ) : (
          cells
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
            .map((cell) => (
              <div
                key={`${cell.row}-${cell.col}`}
                className="flex justify-between items-center text-xs py-1.5 border-b border-slate-800 last:border-0"
              >
                <span className="text-slate-400">
                  {cell.items.length} report{cell.items.length !== 1 ? 's' : ''} near {cell.items[0]?.locationName || 'unknown area'}
                </span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: densityColor(cell.count / maxCount) + '33',
                    color: densityColor(cell.count / maxCount),
                  }}
                >
                  Intensity: {cell.count.toFixed(1)}
                </span>
              </div>
            ))
        )}
      </div>
    </div>
  );
}