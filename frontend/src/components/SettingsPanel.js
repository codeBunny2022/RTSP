import React, { useState } from 'react';
import axios from 'axios';
import './SettingsPanel.css';

const SettingsPanel = ({ rtspUrl, onRtspUrlChange, onClose }) => {
  const [url, setUrl] = useState(rtspUrl);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!url.trim()) {
      alert('Please enter an RTSP URL');
      return;
    }
    
    setSaving(true);
    try {
      await axios.post('/api/settings', { rtsp_url: url });
      onRtspUrlChange(url);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to save settings';
      alert(`Failed to save settings: ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-panel-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-panel-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="settings-panel-content">
          <div className="settings-group">
            <label>RTSP URL:</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="rtsp://example.com/stream or https://rtsp.me/embed/..."
              className="settings-input"
            />
            <p className="settings-hint">
              You can use RTSP.me or similar services to convert RTSP streams to web-compatible formats.
              For example: https://rtsp.me/embed/your-stream-id
            </p>
          </div>
          <div className="settings-actions">
            <button
              className="save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
