import React from 'react';

function WarehouseDashboard({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md z-10 relative">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
              <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">Central Depot Terminal</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">{user.name}</h1>
            <p className="text-slate-500 text-xs mt-1">Stock Ledger & Verification Module</p>
          </div>
          
          <button 
            onClick={onLogout} 
            className="px-5 py-2.5 bg-slate-950 border border-slate-800 hover:border-red-500/40 rounded-xl text-xs font-bold text-slate-400 hover:text-red-400 transition-all duration-200 active:scale-95"
          >
            Disconnect Depot Node
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-950 border border-slate-800/80 p-6 rounded-xl">
            <h3 className="text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Inventory Stock Tracking</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Manage system supply lists, update physical quantities, and catalog hardware items with tags.</p>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 p-6 rounded-xl">
            <h3 className="text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Asset Dispatches</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Review, approve, or deny resource collection orders submitted by on-duty field technicians.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default WarehouseDashboard;