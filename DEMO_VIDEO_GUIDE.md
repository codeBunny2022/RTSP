# Demo Video Guide

This guide will help you create a comprehensive demo video for the RTSP Livestream Overlay application.

## What to Record

### 1. Introduction (30 seconds)
- Show the application running
- Briefly explain what the application does
- Mention the tech stack (Flask, React, MongoDB)

### 2. Starting the Application (1-2 minutes)
- Show starting MongoDB (if applicable)
- Show starting the backend server (`python app.py`)
- Show starting the frontend server (`npm start`)
- Show the application opening in the browser

### 3. Configuring RTSP Stream (1 minute)
- Click the "Settings" button
- Enter an RTSP URL (or use RTSP.me example)
- Save settings
- Show the settings panel closing

### 4. Playing the Livestream (1 minute)
- Click the "Play" button
- Show the video playing
- Demonstrate volume control
- Show pause/play functionality

### 5. Creating Overlays (2-3 minutes)
- **Text Overlay:**
  - Click "+ Add Overlay"
  - Select "Text" type
  - Enter text content (e.g., "Live Stream")
  - Set position and size
  - Create overlay
  - Show it appearing on the video

- **Image Overlay:**
  - Click "+ Add Overlay"
  - Select "Image" type
  - Enter image URL
  - Set position and size
  - Create overlay
  - Show it appearing on the video

### 6. Managing Overlays (2-3 minutes)
- **Moving Overlays:**
  - Click and drag a text overlay
  - Show it moving in real-time
  - Release and show it stays in new position

- **Resizing Overlays:**
  - Select an overlay
  - Drag the corners to resize
  - Show size updating in real-time

- **Editing Content:**
  - Click an overlay in the list
  - Edit the text content
  - Show changes appearing on video immediately

- **Deleting Overlays:**
  - Click the delete button (×) on an overlay
  - Confirm deletion
  - Show overlay disappearing

### 7. Real-time Updates (1 minute)
- Show multiple overlays on the video
- Move and resize them
- Edit content
- Emphasize that changes are saved automatically
- Show that overlays persist after page refresh

### 8. API Demonstration (Optional, 2 minutes)
- Show the browser developer tools
- Demonstrate API calls in the Network tab
- Show GET /api/overlays
- Show POST /api/overlays
- Show PUT /api/overlays
- Show DELETE /api/overlays

### 9. Conclusion (30 seconds)
- Summarize key features
- Mention the technology stack
- Thank the viewer

## Tips for Recording

1. **Screen Recording Software:**
   - OBS Studio (Free, cross-platform)
   - QuickTime (Mac)
   - Windows Game Bar (Windows 10/11)
   - SimpleScreenRecorder (Linux)

2. **Audio:**
   - Use a good microphone
   - Record in a quiet environment
   - Speak clearly and at a moderate pace
   - Add background music (optional, keep it low)

3. **Video Quality:**
   - Record at 1080p minimum
   - Use 60 FPS if possible
   - Ensure good lighting if showing your face

4. **Editing:**
   - Trim unnecessary pauses
   - Add text overlays for key points
   - Add transitions between sections
   - Include a title slide at the beginning

5. **Duration:**
   - Aim for 5-10 minutes total
   - Keep each section concise
   - Focus on demonstrating functionality

## Sample Script

### Introduction
"Hello! Today I'll be demonstrating the RTSP Livestream Overlay Web Application. This application allows you to play RTSP livestreams in your browser and add custom overlays on top of the video in real-time. It's built with Flask for the backend, React for the frontend, and MongoDB for data persistence."

### Starting the Application
"Let me start by launching the application. First, I'll start the Flask backend server, then the React frontend. The application will open in my browser automatically."

### Configuring RTSP Stream
"Now I'll configure the RTSP stream URL. I'll use RTSP.me for this demo, which provides web-compatible streams. I'll paste the URL and save the settings."

### Playing the Livestream
"Let me start the livestream. I'll click the Play button, and you can see the video starts playing. I can control the volume and pause the stream as needed."

### Creating Overlays
"Now let's add some overlays. I'll create a text overlay first - I'll add 'Live Stream' text. Then I'll create an image overlay using a logo URL. Both overlays appear on the video immediately."

### Managing Overlays
"One of the key features is the ability to move and resize overlays in real-time. Watch as I drag this text overlay to a new position. I can also resize it by dragging the corners. All changes are saved automatically to the database."

### Real-time Updates
"As you can see, all overlay changes are reflected immediately on the video. The overlays are stored in MongoDB, so they persist even after refreshing the page."

### Conclusion
"This application demonstrates a complete full-stack solution for RTSP streaming with overlay management. Thank you for watching!"

## Example RTSP URLs for Testing

1. **RTSP.me** (Recommended for demos):
   - Visit https://rtsp.me/
   - Upload a test video
   - Use the embed URL

2. **Public Test Streams**:
   - Some services provide public RTSP test streams
   - Check RTSP.me for available test streams

3. **Your Own Stream**:
   - If you have an RTSP camera or stream
   - Convert it to HLS using the provided script
   - Use the HLS URL

## Checklist

Before recording, ensure:
- [ ] MongoDB is running
- [ ] Backend server is running
- [ ] Frontend server is running
- [ ] Test RTSP URL is ready
- [ ] Sample images for image overlays are ready
- [ ] Screen recording software is set up
- [ ] Microphone is working
- [ ] Browser is ready with developer tools (if showing API calls)

## Post-Production

1. **Edit the video:**
   - Remove long pauses
   - Add title and end screens
   - Add text annotations for key features
   - Ensure smooth transitions

2. **Export:**
   - Export in high quality (1080p or higher)
   - Use MP4 format
   - Keep file size reasonable (under 100MB if possible)

3. **Upload:**
   - Upload to YouTube, Vimeo, or Google Drive
   - Make sure it's publicly accessible
   - Include the link in your submission

Good luck with your demo video!
