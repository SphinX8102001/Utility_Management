import React from 'react';
// Turan: Resident-Technician Chat Panel Import (Chat Feature)
import ChatPanel from '../ChatPanel';
// Turan End

const STATUS_COLORS = {
  PENDING: '#f59e0b',
  ASSIGNED: '#0ea5e9',
  RESOLVED: '#22c55e',
  REPORTED: '#f59e0b',
};


// ─── Task Detail Panel ────────────────────────────────────────────────────────
export function TaskPanel({ selectedIncident, setSelectedIncident, onMarkResolved, onUpdateStatus, currentUser }) {
  if (!selectedIncident) {
    return <p className="text-xs text-slate-500">Click a pin on the map to view task details.</p>;
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-black text-cyan-400 uppercase">Task Detail</h4>
      <div className="space-y-2">
        <p className="text-xs"><strong>Type:</strong> {selectedIncident.utilityType}</p>
        <p className="text-xs"><strong>Location:</strong> {selectedIncident.locationName}</p>
        <p className="text-xs"><strong>Reported By:</strong> {selectedIncident.reporterName}</p>
        <p className="text-xs">
          <strong>Status:</strong>{' '}
          <span style={{ color: STATUS_COLORS[selectedIncident.status] || '#aaa' }}>
            {selectedIncident.status}
          </span>
        </p>
        <p className="text-xs italic bg-slate-950 p-3 border border-slate-800 rounded">
          "{selectedIncident.description}"
        </p>
      </div>

      {selectedIncident.status !== 'RESOLVED' && (
        <button
          onClick={() => onMarkResolved(selectedIncident._id)}
          className="w-full py-2 bg-green-700/40 text-green-400 text-xs font-bold rounded hover:bg-green-700/70"
        >
          ✓ MARK AS RESOLVED
        </button>
      )}
      {selectedIncident.status === 'RESOLVED' && (
        <p className="text-xs text-green-400 font-bold text-center py-2">✓ This task is resolved.</p>
      )}

      <button
        onClick={() => setSelectedIncident(null)}
        className="w-full py-2 bg-slate-800 text-xs font-bold rounded hover:bg-slate-700"
      >
        CLOSE
      </button>

      {/* Turan: Chat with reporter — available to technician while task is active (Chat Feature) */}
      {currentUser && selectedIncident.reporterName && (
        <ChatPanel
          outageId={selectedIncident._id}
          currentUser={currentUser}
          otherName={selectedIncident.reporterName}
        />
      )}
      {/* Turan End */}
    </div>
  );
}


// ─── Task List View ───────────────────────────────────────────────────────────
export function TechTaskList({ filteredTasks, handleSelectIncident, setShowFullMap, setActiveTab, handleMarkResolved }) {
  if (filteredTasks.length === 0) {
    return <p className="text-xs text-slate-500 italic">No tasks match the current filter.</p>;
  }

  const renderedTaskItems = [];

  for (let i = 0; i < filteredTasks.length; i++) {
    const taskItem = filteredTasks[i];

    renderedTaskItems.push(
      <div key={taskItem._id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-cyan-400 text-[10px] font-black uppercase tracking-wider">{taskItem.utilityType}</span>
            <h4 className="text-base font-bold">{taskItem.locationName}</h4>
          </div>
          <span
            className="text-[10px] font-bold px-2 py-1 rounded-full"
            style={{ backgroundColor: (STATUS_COLORS[taskItem.status] || '#aaa') + '22', color: STATUS_COLORS[taskItem.status] || '#aaa' }}
          >
            {taskItem.status}
          </span>
        </div>
        <p className="text-xs text-slate-400 italic mb-3">"{taskItem.description}"</p>
        <p className="text-[10px] text-slate-500">Reported by: <strong className="text-slate-300">{taskItem.reporterName}</strong></p>
        
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => { handleSelectIncident(taskItem); setShowFullMap(true); setActiveTab('map'); }}
            className="flex-1 py-2 bg-slate-800 text-xs font-bold rounded hover:bg-cyan-900/40 hover:text-cyan-400"
          >
            VIEW ON MAP
          </button>
          {taskItem.status !== 'RESOLVED' && (
            <button
              onClick={() => handleMarkResolved(taskItem._id)}
              className="flex-1 py-2 bg-green-700/30 text-green-400 text-xs font-bold rounded hover:bg-green-700/60"
            >
              ✓ MARK RESOLVED
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {renderedTaskItems}
    </div>
  );
}