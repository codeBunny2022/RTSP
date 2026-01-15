import React, { useState } from 'react';
import axios from 'axios';
import './OverlayManager.css';

const OverlayManager = ({
  overlays,
  selectedOverlay,
  onOverlaySelect,
  onOverlayCreate,
  onOverlayUpdate,
  onOverlayDelete
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'text',
    content: '',
    position: { x: 100, y: 100 },
    size: { width: 200, height: 50 }
  });

  const handleCreateOverlay = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/overlays', formData);
      onOverlayCreate(response.data);
      setFormData({
        type: 'text',
        content: '',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 50 }
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating overlay:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to create overlay';
      alert(`Failed to create overlay: ${errorMsg}`);
    }
  };

  const handleDeleteOverlay = async (overlayId) => {
    if (window.confirm('Are you sure you want to delete this overlay?')) {
      try {
        await axios.delete(`/api/overlays/${overlayId}`);
        onOverlayDelete(overlayId);
        if (selectedOverlay?._id === overlayId) {
          onOverlaySelect(null);
        }
      } catch (error) {
        console.error('Error deleting overlay:', error);
        const errorMsg = error.response?.data?.error || error.message || 'Failed to delete overlay';
        alert(`Failed to delete overlay: ${errorMsg}`);
      }
    }
  };

  const handleUpdateContent = async (overlayId, newContent) => {
    try {
      const overlay = overlays.find(o => o._id === overlayId);
      if (!overlay) return;
      const updatedOverlay = { ...overlay, content: newContent };
      const response = await axios.put(`/api/overlays/${overlayId}`, updatedOverlay);
      onOverlayUpdate(response.data);
    } catch (error) {
      console.error('Error updating overlay:', error);
      // Silently fail for content updates to allow typing
    }
  };

  return (
    <div className="overlay-manager">
      <div className="overlay-manager-header">
        <h2>Overlays</h2>
        <button
          className="create-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : '+ Add Overlay'}
        </button>
      </div>

      {showCreateForm && (
        <form className="create-overlay-form" onSubmit={handleCreateOverlay}>
          <div className="form-group">
            <label>Type:</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              {formData.type === 'text' ? 'Text Content:' : 'Image URL:'}
            </label>
            <input
              type="text"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder={formData.type === 'text' ? 'Enter text...' : 'https://example.com/image.png'}
              required
            />
          </div>

          <div className="form-group">
            <label>Initial Position X:</label>
            <input
              type="number"
              value={formData.position.x}
              onChange={(e) => setFormData({
                ...formData,
                position: { ...formData.position, x: parseInt(e.target.value) }
              })}
            />
          </div>

          <div className="form-group">
            <label>Initial Position Y:</label>
            <input
              type="number"
              value={formData.position.y}
              onChange={(e) => setFormData({
                ...formData,
                position: { ...formData.position, y: parseInt(e.target.value) }
              })}
            />
          </div>

          <div className="form-group">
            <label>Width:</label>
            <input
              type="number"
              value={formData.size.width}
              onChange={(e) => setFormData({
                ...formData,
                size: { ...formData.size, width: parseInt(e.target.value) }
              })}
              min="50"
            />
          </div>

          <div className="form-group">
            <label>Height:</label>
            <input
              type="number"
              value={formData.size.height}
              onChange={(e) => setFormData({
                ...formData,
                size: { ...formData.size, height: parseInt(e.target.value) }
              })}
              min="30"
            />
          </div>

          <button type="submit" className="submit-btn">Create Overlay</button>
        </form>
      )}

      <div className="overlays-list">
        {overlays.length === 0 ? (
          <p className="empty-message">No overlays yet. Create one to get started!</p>
        ) : (
          overlays.map((overlay) => (
            <div
              key={overlay._id}
              className={`overlay-item ${selectedOverlay?._id === overlay._id ? 'selected' : ''}`}
              onClick={() => onOverlaySelect(overlay)}
            >
              <div className="overlay-item-header">
                <span className="overlay-type-badge">{overlay.type}</span>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteOverlay(overlay._id);
                  }}
                >
                  ×
                </button>
              </div>
              <div className="overlay-item-content">
                {overlay.type === 'text' ? (
                  <input
                    type="text"
                    value={overlay.content}
                    onChange={(e) => handleUpdateContent(overlay._id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="content-input"
                  />
                ) : (
                  <input
                    type="text"
                    value={overlay.content}
                    onChange={(e) => handleUpdateContent(overlay._id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="content-input"
                    placeholder="Image URL"
                  />
                )}
              </div>
              <div className="overlay-item-info">
                <span>Position: ({overlay.position.x}, {overlay.position.y})</span>
                <span>Size: {overlay.size.width} × {overlay.size.height}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OverlayManager;
