import React from 'react';

export function ResidentAnnouncementList({ announcements, dismissAnnouncement }) {
  if (announcements.length === 0) {
    return <p className="text-xs text-slate-500 italic">No active announcements.</p>;
  }

  const renderedItems = [];

  // Getting all the announcements and rendering them in a list
  for (let i = 0; i < announcements.length; i++) {
    const a = announcements[i];

    renderedItems.push(
      <div key={a.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
        <p className="mb-2">{a.text}</p>
        
        <button
          onClick={() => dismissAnnouncement(a.id)}
          className="text-[10px] text-slate-500 underline hover:text-white"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {renderedItems}
    </div>
  );
}