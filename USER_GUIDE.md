# User Guide - RTSP Livestream Overlay Application

## Getting Started

### First Time Setup

1. **Start the Backend Server**
   - Open a terminal and navigate to the `backend` directory
   - Activate your virtual environment (if using one)
   - Run `python app.py`
   - You should see: "Running on http://0.0.0.0:5000"

2. **Start the Frontend Server**
   - Open a new terminal and navigate to the `frontend` directory
   - Run `npm start`
   - Your browser should automatically open to `http://localhost:3000`

3. **Ensure MongoDB is Running**
   - Make sure MongoDB is installed and running on your system
   - The application will connect to MongoDB automatically

## Using the Application

### Step 1: Configure RTSP Stream URL

1. Click the **"Settings"** button in the top-right corner of the page
2. In the settings panel, enter your RTSP or HLS stream URL
   - For testing, you can use services like RTSP.me
   - Example: `https://rtsp.me/embed/your-stream-id`
3. Click **"Save Settings"**
4. Close the settings panel

### Step 2: Play the Livestream

1. Click the **"▶ Play"** button below the video player
2. The stream should start playing
3. Use the volume slider to adjust audio (0-100%)
4. Click **"⏸ Pause"** to pause the stream

**Note:** If the video doesn't play:
- Check that your RTSP URL is correct and accessible
- Ensure the stream is in HLS format (`.m3u8`) or use a service like RTSP.me
- Check the browser console for any error messages

### Step 3: Create Overlays

#### Creating a Text Overlay

1. Click **"+ Add Overlay"** in the overlay manager panel (right side)
2. Select **"Text"** from the Type dropdown
3. Enter your text in the "Text Content" field (e.g., "Live Stream")
4. Set the initial position:
   - **Position X**: Horizontal position (0 = left edge)
   - **Position Y**: Vertical position (0 = top edge)
5. Set the size:
   - **Width**: Width of the text box in pixels
   - **Height**: Height of the text box in pixels
6. Click **"Create Overlay"**
7. The overlay will appear on the video

#### Creating an Image Overlay

1. Click **"+ Add Overlay"**
2. Select **"Image"** from the Type dropdown
3. Enter the image URL in the "Image URL" field
   - Must be a publicly accessible URL
   - Supports common image formats (PNG, JPG, GIF, etc.)
   - Example: `https://example.com/logo.png`
4. Set the initial position and size
5. Click **"Create Overlay"**
6. The image will appear on the video

### Step 4: Managing Overlays

#### Moving Overlays

1. Click and hold on any overlay on the video
2. Drag it to your desired position
3. Release to drop it in the new position
4. The position is automatically saved

#### Resizing Overlays

1. Click on an overlay to select it (it will show a blue border)
2. Drag the corners or edges of the overlay to resize it
3. The size is automatically saved

#### Editing Overlay Content

1. Click on an overlay in the overlay list (right panel) to select it
2. The overlay will be highlighted in the list and on the video
3. Click in the content field and edit the text or image URL
4. Changes are saved automatically as you type

#### Deleting Overlays

1. Find the overlay in the overlay list (right panel)
2. Click the **"×"** button on the overlay item
3. Confirm the deletion
4. The overlay will be removed from both the list and the video

### Step 5: Real-time Updates

- All overlay changes (position, size, content) are saved automatically
- Changes are visible immediately on the video
- Overlays persist across page refreshes (stored in MongoDB)

## Tips and Best Practices

### RTSP Stream Setup

1. **Using RTSP.me (Easiest for Testing)**
   - Visit https://rtsp.me/
   - Upload a video or use their test streams
   - Copy the embed URL
   - Paste it in the Settings panel

2. **Converting RTSP to HLS**
   - Install FFmpeg on your system
   - Use the provided `stream_server.py` script
   - Serve the HLS files using a web server
   - Use the playlist URL in the Settings panel

3. **Direct HLS URLs**
   - If you have an HLS stream URL (ending with `.m3u8`), use it directly
   - No conversion needed

### Overlay Design Tips

1. **Text Overlays**
   - Use clear, readable fonts
   - Consider text shadow for better visibility
   - Position overlays where they won't obstruct important content

2. **Image Overlays**
   - Use PNG images with transparency for best results
   - Keep image sizes reasonable (under 1MB recommended)
   - Ensure images are publicly accessible

3. **Positioning**
   - Common positions:
     - Top-left: `x: 10, y: 10`
     - Top-right: `x: (video_width - overlay_width - 10), y: 10`
     - Bottom-left: `x: 10, y: (video_height - overlay_height - 10)`
     - Bottom-right: `x: (video_width - overlay_width - 10), y: (video_height - overlay_height - 10)`

## Troubleshooting

### Video Won't Play

**Problem:** Clicking Play doesn't start the video

**Solutions:**
- Check that the RTSP URL is correct
- Verify the stream is accessible
- Try using RTSP.me for testing
- Check browser console for errors
- Ensure the stream is in HLS format

### Overlays Not Appearing

**Problem:** Created overlays don't show on video

**Solutions:**
- Check that overlays aren't positioned outside the video area
- Verify the overlay content is valid (text not empty, image URL accessible)
- Refresh the page
- Check browser console for errors

### Overlays Not Saving

**Problem:** Changes to overlays are lost after refresh

**Solutions:**
- Verify MongoDB is running
- Check backend server is running
- Check browser console for API errors
- Verify network connectivity

### Image Overlays Not Loading

**Problem:** Image overlays show "Image not found"

**Solutions:**
- Verify the image URL is correct and publicly accessible
- Check CORS settings if hosting your own images
- Try a different image URL
- Ensure the URL starts with `http://` or `https://`

## Keyboard Shortcuts

Currently, there are no keyboard shortcuts implemented. All interactions are done via mouse/touch.

## Browser Compatibility

- **Chrome/Edge**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support (native HLS)
- **Opera**: Full support

**Minimum Requirements:**
- Modern browser with JavaScript enabled
- HTML5 video support
- HLS.js support (or native HLS for Safari)

## Performance Tips

1. **Limit Number of Overlays**: Too many overlays may impact performance
2. **Optimize Images**: Use compressed images for image overlays
3. **Stream Quality**: Lower quality streams perform better
4. **Browser**: Use Chrome or Firefox for best performance

## Support

If you encounter issues:

1. Check the browser console (F12) for errors
2. Check the backend terminal for API errors
3. Verify all services are running (MongoDB, Backend, Frontend)
4. Review the troubleshooting section above
5. Check the README.md for setup instructions
