import React, { useState, useEffect } from 'react';
import { PreviewMap, FullMap, isInsideBangladesh } from './ResidentMapOverview';
import { ResidentAnnouncementList } from './ResidentAnnouncementList';
import { ResidentRegistryList } from './ResidentRegistryList';
import { ResidentFAQView } from './ResidentFAQView';

function ResidentDashboard({ user, onLogout }) {
  const [outages, setOutages] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullMap, setShowFullMap] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [activeTab, setActiveTab] = useState('map'); 
  //NUSFAT: Banner state for System Announcements
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/banner/active');
        const data = await res.json();
        //NUSFAT: Map all active banners to announcement format
        if (Array.isArray(data) && data.length > 0) {
          setBanners(data.map(b => ({ id: b._id, text: b.message })));
        } else {
          setBanners([]);
        }
      } catch {
        setBanners([]);
      }
    };
    fetchBanners();
    const interval = setInterval(fetchBanners, 30000);
    return () => clearInterval(interval);
  }, []);
//NUSFAT END

  const [profile, setProfile] = useState({
    username: user?.username || 'User',
    email: user?.email || 'user@example.com',
    address: user?.address || '123 Dhaka City, Bangladesh',
  });

  const [clickedPosition, setClickedPosition] = useState(null); 
  const [utilityType, setUtilityType] = useState('Electricity');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');

  const fetchMapMarkers = () => {
    fetch('http://localhost:5000/api/outages/active')
      .then((res) => res.json())
      .then((data) => {
        setOutages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching map vectors:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMapMarkers();
  }, []);

  const handleMapClick = (lat, lng) => {
    if (!isInsideBangladesh(lat, lng)) {
      alert('Reports can only be filed within Bangladesh.');
      return;
    }
    setClickedPosition([lat, lng]);
    setSelectedIncident(null);
    setIsReporting(true);
  };

  const handleIncidentSelect = (incident) => {
    setClickedPosition(null);
    setIsReporting(false);
    setSelectedIncident(incident);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const payload = {
      utilityType,
      locationName,
      latitude: clickedPosition[0],
      longitude: clickedPosition[1],
      description,
      estimatedRestoration: 'Pending',
      reporterId: user.id,
      reporterName: user.username,
    };

    fetch('http://localhost:5000/api/outages/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        alert('Report registered.');
        setIsReporting(false);
        setClickedPosition(null);
        fetchMapMarkers();
      })
      .catch((err) => console.error('FETCH ERROR:', err));
  };

  const handleDeleteReport = (id) => {
    fetch(`http://localhost:5000/api/outages/delete/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => { throw new Error(err.message || res.status); });
        }
        return res.json();
      })
      .then(() => {
        alert('Report removed.');
        setSelectedIncident(null);
        fetchMapMarkers();
      })
      .catch((err) => console.error('Delete failed:', err));
  };

  const handleUpvote = (outageId) => {
    fetch(`http://localhost:5000/api/outages/upvote/${outageId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    })
      .then((res) => res.json().then((data) => ({ status: res.status, body: data })))
      .then(({ status, body }) => {
        if (status === 200) {
          setSelectedIncident(body.report);
          fetchMapMarkers();
        } else {
          alert(body.error || 'Failed to toggle outage upvote.');
        }
      })
      .catch((err) => console.error('Upvote error:', err));
  };

  const updateProfile = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/user/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: profile.username,
        address: profile.address,
      }),
    })
      .then((res) => {
        if (res.ok) {
          alert('Profile and address updated in database.');
        } else {
          alert('Failed to save profile.');
        }
      })
      .catch((err) => {
        console.error('Error updating profile:', err);
      });
  };

  const renderedOutageRows = [];
  for (let i = 0; i < outages.length; i++) {
    const outageItem = outages[i];
    renderedOutageRows.push(
      <div key={outageItem._id} className="flex justify-between items-center text-xs py-2 border-b border-slate-800 last:border-0">
        <div>
          <span className="font-bold text-cyan-400 mr-2">{outageItem.utilityType}</span>
          <span className="text-slate-400">{outageItem.locationName}</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded-full border border-emerald-800/50">
          👍 {outageItem.upvotes || 0}
        </span>
      </div>
    );
  }

  const navTabs = [
    { key: 'map', label: 'Monitor' },
    { key: 'faq', label: 'FAQs & Help' },
    { key: 'profile', label: 'Account Settings' },
  ];
  const renderedNavTabs = [];
  for (let i = 0; i < navTabs.length; i++) {
    const tabItem = navTabs[i];
    renderedNavTabs.push(
      <button
        key={tabItem.key}
        onClick={() => setActiveTab(tabItem.key)}
        className={`w-full py-2 px-3 text-left text-xs font-bold rounded-lg transition-all ${
          activeTab === tabItem.key
            ? 'bg-cyan-600 text-white'
            : 'bg-slate-950 text-slate-400 hover:text-white'
        }`}
      >
        {tabItem.label}
      </button>
    );
  }

  const hasUpvoted = selectedIncident && selectedIncident.upvotedBy && selectedIncident.upvotedBy.includes(user.id);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <div className="p-6 flex gap-6">
      <div className="w-1/3 flex flex-col gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full border-2 border-cyan-500 bg-slate-800 flex items-center justify-center cursor-pointer hover:opacity-80 text-xl font-bold"
            onClick={() => setActiveTab('profile')}
          >
            {profile.username[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-black">Operations</h1>
            <p className="text-slate-500 text-xs">Hello {profile.username}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col gap-2">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Navigation</h4>
          {renderedNavTabs}
        </div>

        <button
          onClick={() => setShowFullMap(true)}
          className="w-full py-3 bg-cyan-600 rounded-lg text-xs font-bold hover:bg-cyan-500"
        >
          LAUNCH FULL INTERACTIVE MAP
        </button>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex-1">
          <h4 className="text-sm font-bold text-cyan-400 mb-4 uppercase">System Announcements</h4>
          {/*NUSFAT: Pass active banners to announcements box*/}
          <ResidentAnnouncementList 
             announcements={banners} 
             dismissAnnouncement={(id) => setBanners(prev => prev.filter(b => b.id !== id))} 
          />
          {/*NUSFAT END */}
        </div>
      </div>

      <div className="flex-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl relative flex flex-col">
        {activeTab === 'profile' ? (
          <div className="flex-1 p-6">
            <h2 className="text-xl font-black mb-6">Account Settings</h2>
            <form onSubmit={updateProfile} className="max-w-md">
              <label className="block text-xs font-bold text-slate-500 mb-2">Username</label>
              <input disabled value={profile.username} className="w-full bg-slate-950 border p-2 mb-4 text-xs" />
              <label className="block text-xs font-bold text-slate-500 mb-2">Email</label>
              <input disabled value={profile.email} className="w-full bg-slate-950 border p-2 mb-4 text-xs" />
              <label className="block text-xs font-bold text-slate-500 mb-2">Residential Address</label>
              <textarea
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full bg-slate-950 border p-2 mb-4 text-xs h-20"
              />
              <button type="submit" className="w-full py-2 bg-cyan-600 text-xs font-bold rounded">
                SAVE CHANGES
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('map')}
                className="w-full mt-2 py-2 bg-slate-800 text-xs font-bold rounded"
              >
                CANCEL
              </button>
            </form>
          </div>
        ) : activeTab === 'faq' ? (
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-sm font-bold">Frequently Asked Questions</h3>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-slate-800 text-xs font-bold rounded-lg hover:bg-red-900/50"
              >
                Logout
              </button>
            </div>
            <ResidentFAQView />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-sm font-bold">System Monitor</h3>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-slate-800 text-xs font-bold rounded-lg hover:bg-red-900/50"
              >
                Logout
              </button>
            </div>

            {!showFullMap && activeTab === 'map' && (
              <div className="flex flex-col gap-4">
                <PreviewMap outages={outages} onClick={() => setShowFullMap(true)} />
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-60 overflow-y-auto">
                  <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3">Active Reports</h5>
                  {renderedOutageRows}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showFullMap && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <div className="flex gap-4">
              <h2
                onClick={() => setActiveTab('map')}
                className={`text-xl font-black cursor-pointer ${activeTab === 'map' ? 'text-white' : 'text-slate-600'}`}
              >
                Map View
              </h2>
              <h2
                onClick={() => setActiveTab('registry')}
                className={`text-xl font-black cursor-pointer ${activeTab === 'registry' ? 'text-white' : 'text-slate-600'}`}
              >
                Repair Registry
              </h2>
              <h2
                onClick={() => setActiveTab('faq')}
                className={`text-xl font-black cursor-pointer ${activeTab === 'faq' ? 'text-white' : 'text-slate-600'}`}
              >
                FAQs & Help
              </h2>
            </div>
            <button 
              onClick={() => {
                setShowFullMap(false);
                setActiveTab('map'); 
              }} 
              className="px-4 py-2 bg-slate-800 rounded text-xs"
            >
              [CLOSE]
            </button>
          </div>

          {activeTab === 'map' ? (
            <div className="grid grid-cols-3 gap-8 flex-1 overflow-hidden">
              <div className="col-span-2 rounded-2xl overflow-hidden border border-slate-800" style={{ minHeight: '400px' }}>
                <FullMap
                  outages={outages}
                  onMapClick={handleMapClick}
                  clickedPosition={clickedPosition}
                  selectedIncident={selectedIncident}
                  setSelectedIncident={handleIncidentSelect}
                />
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                {isReporting ? (
                  <form onSubmit={handleFormSubmit}>
                    <h4 className="text-xs font-bold text-cyan-400 mb-4">File Report</h4>
                    <input disabled value={clickedPosition ? `Lat: ${clickedPosition[0].toFixed(5)}, Lon: ${clickedPosition[1].toFixed(5)}` : ''} className="w-full bg-slate-950 border p-2 mb-2 text-xs" />
                    <select onChange={(e) => setUtilityType(e.target.value)} className="w-full bg-slate-950 border p-2 mb-2 text-xs">
                      <option>Electricity</option>
                      <option>Water</option>
                      <option>Gas</option>
                    </select>
                    <input required placeholder="Street Name" onChange={(e) => setLocationName(e.target.value)} className="w-full bg-slate-950 border p-2 mb-2 text-xs" />
                    <textarea required placeholder="Description" onChange={(e) => setDescription(e.target.value)} className="w-full bg-slate-950 border p-2 mb-2 text-xs h-24" />
                    <button type="submit" className="w-full py-2 bg-cyan-600 text-xs font-bold rounded">SUBMIT</button>
                  </form>
                ) : selectedIncident ? (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-cyan-400">Incident Detail</h4>
                    <div className="space-y-2">
                      <p className="text-xs"><strong>Type:</strong> {selectedIncident.utilityType}</p>
                      <p className="text-xs"><strong>Location:</strong> {selectedIncident.locationName}</p>
                      <p className="text-xs"><strong>Reported By:</strong> {selectedIncident.reporterName}</p>
                      <p className="text-xs"><strong>Confirmations:</strong> <span className="text-emerald-400 font-bold">{selectedIncident.upvotes || 0} residents</span></p>
                      <p className="text-xs italic bg-slate-950 p-3 border border-slate-800 rounded">"{selectedIncident.description}"</p>
                    </div>

                    {selectedIncident.reporterId !== user.id && (
                      <button
                        onClick={() => handleUpvote(selectedIncident._id)}
                        className={`w-full py-2 text-white text-xs font-bold rounded transition-colors ${
                          hasUpvoted 
                            ? 'bg-amber-700 hover:bg-amber-600' 
                            : 'bg-emerald-700 hover:bg-emerald-600'
                        }`}
                      >
                        {hasUpvoted ? '👎 REMOVE MY CONFIRMATION' : '👍 ME TOO / CONFIRM OUTAGE'}
                      </button>
                    )}

                    {selectedIncident.reporterId === user.id && (
                      <button
                        onClick={() => handleDeleteReport(selectedIncident._id)}
                        className="w-full py-2 bg-red-900/50 text-red-400 text-xs font-bold rounded hover:bg-red-900"
                      >
                        REMOVE REPORT
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Select a pin to view details, or click the map to file a report.</p>
                )}
              </div>
            </div>
          ) : activeTab === 'faq' ? (
            <div className="flex-1 bg-slate-900 p-6 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
              <ResidentFAQView />
            </div>
          ) : (
            <ResidentRegistryList 
              outages={outages} 
              user={user} 
              handleDeleteReport={handleDeleteReport} 
            />
          )}
        </div>
      )}
    </div>
    </div>
  );
}

export default ResidentDashboard;