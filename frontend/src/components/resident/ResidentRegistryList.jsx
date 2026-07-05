import React from 'react';

export function ResidentRegistryList({ outages, user, handleDeleteReport }) {
  const renderedRegistryItems = [];

  for (let i = 0; i < outages.length; i++) {
    const item = outages[i];

    renderedRegistryItems.push(
      <div key={item._id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-cyan-400 text-[10px] font-black uppercase tracking-wider">{item.utilityType}</span>
            <h4 className="text-lg font-bold">{item.locationName}</h4>
          </div>
          <span className="text-[10px] font-bold text-slate-500">REPORTED BY: {item.reporterName}</span>
        </div>

        <p className="text-sm text-slate-300 mt-3 italic">"{item.description}"</p>

        {item.reporterId === user.id && (
          <button
            onClick={() => handleDeleteReport(item._id)}
            className="mt-4 text-[10px] text-red-400 font-bold uppercase underline hover:text-red-300"
          >
            Remove My Report
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-4">
      {renderedRegistryItems}
    </div>
  );
}