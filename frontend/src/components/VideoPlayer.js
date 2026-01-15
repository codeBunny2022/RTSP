import React, { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import './VideoPlayer.css';
import axios from 'axios';
import Hls from 'hls.js';

const VideoPlayer = ({ rtspUrl, overlays, selectedOverlay, onOverlaySelect, onOverlayUpdate }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [hlsUrl, setHlsUrl] = useState('');
  const [error, setError] = useState('');
  const [imageErrors, setImageErrors] = useState({});

  // Initialize HLS.js for RTSP/HLS streaming
  useEffect(() => {
    if (!rtspUrl) {
      setHlsUrl('');
      return;
    }

    // Check if URL is already HLS-compatible (ends with .m3u8 or is from RTSP.me)
    if (rtspUrl.includes('.m3u8') || rtspUrl.includes('rtsp.me') || rtspUrl.startsWith('http')) {
      setHlsUrl(rtspUrl);
    } else {
      // For RTSP URLs, you would typically convert them to HLS using ffmpeg
      // For now, we'll assume the user provides an HLS-compatible URL
      // or uses a service like RTSP.me that provides web-compatible streams
      setHlsUrl(rtspUrl);
    }
  }, [rtspUrl]);

  // Sync video state with isPlaying state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [hlsUrl]);

  // Setup HLS.js player
  useEffect(() => {
    if (!hlsUrl || !videoRef.current) return;

    const video = videoRef.current;

    // Check if browser supports native HLS (Safari)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
      setError('');
    } else if (Hls.isSupported()) {
      // Use HLS.js for browsers that don't support native HLS
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setError('');
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('Network error. Please check your RTSP URL.');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError('Media error. Trying to recover...');
              hls.recoverMediaError();
              break;
            default:
              setError('Fatal error. Please check your stream URL.');
              hls.destroy();
              break;
          }
        }
      });

      hlsRef.current = hls;

      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
      };
    } else {
      setError('HLS is not supported in this browser. Please use a modern browser or provide an MP4 stream.');
    }
  }, [hlsUrl]);

  const handlePlay = async () => {
    if (videoRef.current) {
      try {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        } else {
          setIsPlaying(true);
        }
      } catch (error) {
        // Handle play() interruption or other errors
        if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
          console.error('Error playing video:', error);
        }
        // Update state based on actual video state
        if (videoRef.current) {
          setIsPlaying(!videoRef.current.paused);
        }
      }
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        setIsPlaying(false);
      } catch (error) {
        console.error('Error pausing video:', error);
        setIsPlaying(false);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleOverlayDrag = (overlayId, data) => {
    const overlay = overlays.find(o => o._id === overlayId);
    if (overlay) {
      const updatedOverlay = {
        ...overlay,
        position: { x: data.x, y: data.y }
      };
      updateOverlay(updatedOverlay);
    }
  };

  const handleOverlayResize = (overlayId, size) => {
    const overlay = overlays.find(o => o._id === overlayId);
    if (overlay) {
      const updatedOverlay = {
        ...overlay,
        size: { width: size.width, height: size.height }
      };
      updateOverlay(updatedOverlay);
    }
  };

  const updateOverlay = async (overlay) => {
    try {
      const response = await axios.put(`/api/overlays/${overlay._id}`, overlay);
      onOverlayUpdate(response.data);
    } catch (error) {
      console.error('Error updating overlay:', error);
      // Silently fail for drag/resize to allow smooth interaction
    }
  };

  return (
    <div className="video-player-container">
      <div className="video-wrapper">
        {error && (
          <div className="video-error">
            <p>{error}</p>
            <p className="error-hint">Make sure your RTSP URL is converted to HLS format or use a service like RTSP.me</p>
          </div>
        )}
        <video
          ref={videoRef}
          className="video-element"
          controls={false}
          muted={volume === 0}
          playsInline
        >
          {hlsUrl && !error && (
            <source src={hlsUrl} type="application/x-mpegURL" />
          )}
          Your browser does not support the video tag.
        </video>

        {/* Overlays */}
        {overlays.map((overlay) => (
          <Draggable
            key={overlay._id}
            position={overlay.position}
            onStop={(e, data) => handleOverlayDrag(overlay._id, data)}
            handle=".overlay-handle"
          >
            <Resizable
              width={overlay.size.width}
              height={overlay.size.height}
              onResize={(e, { size }) => handleOverlayResize(overlay._id, size)}
              minConstraints={[50, 30]}
            >
              <div
                className={`overlay ${selectedOverlay?._id === overlay._id ? 'selected' : ''}`}
                style={{
                  width: overlay.size.width,
                  height: overlay.size.height,
                }}
                onClick={() => onOverlaySelect(overlay)}
              >
                <div className="overlay-handle">
                  {overlay.type === 'text' ? (
                    <div className="overlay-text">{overlay.content}</div>
                  ) : (
                    imageErrors[overlay._id] ? (
                      <div className="overlay-error">Image not found</div>
                    ) : overlay.content ? (
                      <img
                        src={overlay.content}
                        alt="Overlay"
                        className="overlay-image"
                        onError={() => {
                          setImageErrors(prev => ({ ...prev, [overlay._id]: true }));
                        }}
                      />
                    ) : (
                      <div className="overlay-error">No image URL provided</div>
                    )
                  )}
                </div>
              </div>
            </Resizable>
          </Draggable>
        ))}
      </div>

      <div className="video-controls">
        <button onClick={isPlaying ? handlePause : handlePlay}>
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <div className="volume-control">
          <label>Volume:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
          />
          <span>{Math.round(volume * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
