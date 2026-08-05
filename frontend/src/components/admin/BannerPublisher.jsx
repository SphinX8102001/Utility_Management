import React, { useState } from 'react';

// --- NUSFAT: Banner Publisher Component for Control Manager - Module 2 ---
function BannerPublisher() {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!message.trim()) {
      setError('Please type a message first.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:5000/api/banner/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Banner published successfully!');
        setMessage('');
      } else {
        setError(data.message || 'Failed to publish banner.');
      }
    } catch {
      setError('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      await fetch('http://localhost:5000/api/banner/deactivate', {
        method: 'DELETE'
      });
      setSuccess('Banner deactivated successfully.');
      setMessage('');
    } catch {
      setError('Failed to deactivate banner.');
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-black text-cyan-400 uppercase tracking-wider mb-1">
          Emergency Broadcast System
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Publish emergency announcements visible to all residents
        </p>

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mb-4">
            <p className="text-green-400 text-xs font-bold">{success}</p>
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
            <p className="text-red-400 text-xs font-bold">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Announcement Message
            </label>
            <textarea
              rows={4}
              placeholder="e.g. Main water line under repair in Sector 10. Estimated restoration: 6 hours."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePost}
              disabled={loading}
              className={`flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Publishing...' : 'Publish Banner'}
            </button>

            <button
              onClick={handleDeactivate}
              className="flex-1 py-3 bg-red-900/40 hover:bg-red-900/60 text-red-400 font-black text-xs uppercase tracking-wider rounded-xl transition-all border border-red-900/50"
            >
              Remove Banner
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          How it works
        </h4>
        <div className="space-y-2">
          <p className="text-xs text-slate-500">1. Type your emergency announcement above</p>
          <p className="text-xs text-slate-500">2. Click "Publish Banner" to broadcast to all residents</p>
          <p className="text-xs text-slate-500">3. Banner appears as a scrolling alert on resident dashboard</p>
          <p className="text-xs text-slate-500">4. Click "Remove Banner" to deactivate the announcement</p>
        </div>
      </div>
    </div>
  );
}
// --- NUSFAT END ---

export default BannerPublisher;