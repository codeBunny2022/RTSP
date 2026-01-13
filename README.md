# RTSP Livestream Overlay Web Application

A web application that plays livestream video from an RTSP source and allows users to create, manage, and display custom overlays on top of the video in real time.

## Features

- **RTSP Livestream Playback**: Play RTSP streams converted to HLS format
- **Overlay Management**: Create, edit, delete, drag, and resize text and image overlays
- **Real-time Updates**: Overlays update in real-time as you modify them
- **CRUD APIs**: Full REST API for managing overlays and settings
- **Modern UI**: Clean and intuitive React-based interface

## Technology Stack

- **Backend**: Python Flask
- **Database**: MongoDB
- **Frontend**: React
- **Video Streaming**: HLS.js for browser-compatible streaming

## Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB (local or remote)
- FFmpeg (optional, for RTSP to HLS conversion)

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

5. Update `.env` with your MongoDB connection string:
```
MONGO_URI=mongodb://localhost:27017/
DB_NAME=rtsp_overlay
```

6. Start MongoDB (if running locally):
```bash
# On Linux/Mac
sudo systemctl start mongod
# or
mongod

# On Windows
net start MongoDB
```

7. Run the Flask server:
```bash
python app.py
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## RTSP URL Configuration

### Option 1: Using RTSP.me (Recommended for Testing)

1. Visit [RTSP.me](https://rtsp.me/)
2. Upload your video or use their test streams
3. Copy the embed URL (usually in format: `https://rtsp.me/embed/...`)
4. Paste it in the Settings panel of the application

### Option 2: Converting RTSP to HLS using FFmpeg

1. Install FFmpeg:
```bash
# Ubuntu/Debian
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

2. Run the stream server script:
```bash
cd backend
python stream_server.py <rtsp_url> ./hls_output
```

3. Serve the HLS files using a web server (e.g., Python's HTTP server):
```bash
cd hls_output
python3 -m http.server 8000
```

4. Use the URL: `http://localhost:8000/playlist.m3u8`

### Option 3: Direct HLS URL

If you already have an HLS stream URL (ending with `.m3u8`), you can use it directly in the Settings panel.

## Usage

### Starting the Application

1. Start MongoDB (if not already running)
2. Start the backend server:
```bash
cd backend
python app.py
```

3. Start the frontend server (in a new terminal):
```bash
cd frontend
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Using the Application

1. **Configure RTSP URL**:
   - Click the "Settings" button in the header
   - Enter your RTSP/HLS URL
   - Click "Save Settings"

2. **Play the Stream**:
   - Click the "Play" button to start the livestream
   - Use the volume slider to adjust audio

3. **Create Overlays**:
   - Click "+ Add Overlay" in the overlay manager panel
   - Choose overlay type (Text or Image)
   - Enter content (text or image URL)
   - Set initial position and size
   - Click "Create Overlay"

4. **Manage Overlays**:
   - **Move**: Click and drag overlays on the video
   - **Resize**: Drag the corners of selected overlays
   - **Edit**: Click an overlay in the list to select it, then edit its content
   - **Delete**: Click the "×" button on an overlay in the list

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Settings API

#### Get Settings
```http
GET /api/settings
```

**Response:**
```json
{
  "_id": "string",
  "rtsp_url": "string",
  "updated_at": "datetime"
}
```

#### Update Settings
```http
POST /api/settings
Content-Type: application/json

{
  "rtsp_url": "https://rtsp.me/embed/..."
}
```

**Response:**
```json
{
  "message": "Settings updated successfully"
}
```

### Overlays API

#### Get All Overlays
```http
GET /api/overlays
```

**Response:**
```json
[
  {
    "_id": "string",
    "type": "text|image",
    "content": "string",
    "position": {
      "x": 100,
      "y": 100
    },
    "size": {
      "width": 200,
      "height": 50
    },
    "created_at": "datetime",
    "updated_at": "datetime"
  }
]
```

#### Create Overlay
```http
POST /api/overlays
Content-Type: application/json

{
  "type": "text",
  "content": "Hello World",
  "position": {
    "x": 100,
    "y": 100
  },
  "size": {
    "width": 200,
    "height": 50
  }
}
```

**Response:**
```json
{
  "_id": "string",
  "type": "text",
  "content": "Hello World",
  "position": {
    "x": 100,
    "y": 100
  },
  "size": {
    "width": 200,
    "height": 50
  },
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### Get Single Overlay
```http
GET /api/overlays/{overlay_id}
```

**Response:**
```json
{
  "_id": "string",
  "type": "text",
  "content": "string",
  "position": {
    "x": 100,
    "y": 100
  },
  "size": {
    "width": 200,
    "height": 50
  },
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### Update Overlay
```http
PUT /api/overlays/{overlay_id}
Content-Type: application/json

{
  "content": "Updated text",
  "position": {
    "x": 150,
    "y": 150
  },
  "size": {
    "width": 250,
    "height": 60
  }
}
```

**Response:**
```json
{
  "_id": "string",
  "type": "text",
  "content": "Updated text",
  "position": {
    "x": 150,
    "y": 150
  },
  "size": {
    "width": 250,
    "height": 60
  },
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### Delete Overlay
```http
DELETE /api/overlays/{overlay_id}
```

**Response:**
```json
{
  "message": "Overlay deleted successfully"
}
```

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy"
}
```

## Project Structure

```
RTSP/
├── backend/
│   ├── app.py                 # Flask application
│   ├── stream_server.py       # Optional RTSP to HLS converter
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example          # Environment variables template
│   └── .env                  # Environment variables (create this)
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── VideoPlayer.js
│   │   │   ├── VideoPlayer.css
│   │   │   ├── OverlayManager.js
│   │   │   ├── OverlayManager.css
│   │   │   ├── SettingsPanel.js
│   │   │   └── SettingsPanel.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## Troubleshooting

### Video Not Playing

1. **Check RTSP URL**: Ensure the URL is valid and accessible
2. **Browser Compatibility**: Use a modern browser (Chrome, Firefox, Safari, Edge)
3. **CORS Issues**: Make sure the backend CORS is configured correctly
4. **HLS Support**: Ensure the stream is in HLS format (`.m3u8`) or use RTSP.me

### MongoDB Connection Issues

1. **Check MongoDB Status**: Ensure MongoDB is running
2. **Connection String**: Verify the `MONGO_URI` in `.env` is correct
3. **Network**: If using remote MongoDB, check network connectivity

### Overlays Not Appearing

1. **Check Console**: Look for JavaScript errors in browser console
2. **API Connection**: Verify backend is running and accessible
3. **Position**: Overlays might be outside the visible area - check position values

## Development

### Running in Development Mode

Backend:
```bash
cd backend
python app.py  # Runs with debug=True
```

Frontend:
```bash
cd frontend
npm start  # Runs with hot reload
```

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

The built files will be in `frontend/build/`

## License

This project is created for educational/assignment purposes.

## Support

For issues or questions, please check:
1. The troubleshooting section above
2. Browser console for errors
3. Backend logs for API errors
