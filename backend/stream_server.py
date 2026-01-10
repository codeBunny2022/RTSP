"""
Optional RTSP to HLS conversion server using ffmpeg.
This requires ffmpeg to be installed on the system.

Usage:
    python stream_server.py <rtsp_url> <output_directory>

The server will convert RTSP stream to HLS format and serve it via HTTP.
"""

import subprocess
import sys
import os
import time
from pathlib import Path

def convert_rtsp_to_hls(rtsp_url, output_dir):
    """Convert RTSP stream to HLS format using ffmpeg"""
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    playlist_path = output_dir / "playlist.m3u8"
    
    # FFmpeg command to convert RTSP to HLS
    cmd = [
        'ffmpeg',
        '-i', rtsp_url,
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-f', 'hls',
        '-hls_time', '2',
        '-hls_list_size', '3',
        '-hls_flags', 'delete_segments',
        '-hls_segment_filename', str(output_dir / 'segment_%03d.ts'),
        str(playlist_path)
    ]
    
    print(f"Starting RTSP to HLS conversion...")
    print(f"RTSP URL: {rtsp_url}")
    print(f"Output directory: {output_dir}")
    print(f"Playlist: {playlist_path}")
    
    try:
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        print("FFmpeg process started. Press Ctrl+C to stop.")
        process.wait()
        
    except KeyboardInterrupt:
        print("\nStopping conversion...")
        process.terminate()
        process.wait()
    except FileNotFoundError:
        print("Error: ffmpeg not found. Please install ffmpeg first.")
        print("Ubuntu/Debian: sudo apt-get install ffmpeg")
        print("macOS: brew install ffmpeg")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python stream_server.py <rtsp_url> <output_directory>")
        print("Example: python stream_server.py rtsp://example.com/stream ./hls_output")
        sys.exit(1)
    
    rtsp_url = sys.argv[1]
    output_dir = sys.argv[2]
    
    convert_rtsp_to_hls(rtsp_url, output_dir)
