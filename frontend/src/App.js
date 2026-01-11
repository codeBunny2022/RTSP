import React, { useState, useEffect } from 'react';
import VideoPlayer from './components/VideoPlayer';
import OverlayManager from './components/OverlayManager';
import SettingsPanel from './components/SettingsPanel';
import './App.css';

function App() {
  const [overlays, setOverlays] = useState([]);
  const [rtspUrl, setRtspUrl] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedOverlay, setSelectedOverlay] = useState(null);

  useEffect(() => {
    loadSettings();
    loadOverlays();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (data.rtsp_url) {
        setRtspUrl(data.rtsp_url);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadOverlays = async () => {
    try {
      const response = await fetch('/api/overlays');
      const data = await response.json();
      setOverlays(data);
    } catch (error) {
      console.error('Error loading overlays:', error);
    }
  };

  const handleOverlayCreate = (overlay) => {
    setOverlays([...overlays, overlay]);
  };

  const handleOverlayUpdate = (updatedOverlay) => {
    setOverlays(overlays.map(o => o._id === updatedOverlay._id ? updatedOverlay : o));
  };

  const handleOverlayDelete = (overlayId) => {
    setOverlays(overlays.filter(o => o._id !== overlayId));
  };

  const handleRtspUrlChange = (url) => {
    setRtspUrl(url);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>RTSP Livestream Overlay</h1>
        <button 
          className="settings-btn"
          onClick={() => setShowSettings(!showSettings)}
        >
          {showSettings ? 'Hide Settings' : 'Settings'}
        </button>
      </header>

      {showSettings && (
        <SettingsPanel
          rtspUrl={rtspUrl}
          onRtspUrlChange={handleRtspUrlChange}
          onClose={() => setShowSettings(false)}
        />
      )}

      <div className="app-content">
        <VideoPlayer
          rtspUrl={rtspUrl}
          overlays={overlays}
          selectedOverlay={selectedOverlay}
          onOverlaySelect={setSelectedOverlay}
          onOverlayUpdate={handleOverlayUpdate}
        />
        <OverlayManager
          overlays={overlays}
          selectedOverlay={selectedOverlay}
          onOverlaySelect={setSelectedOverlay}
          onOverlayCreate={handleOverlayCreate}
          onOverlayUpdate={handleOverlayUpdate}
          onOverlayDelete={handleOverlayDelete}
        />
      </div>
    </div>
  );
}

export default App;
