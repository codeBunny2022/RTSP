# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### Settings

#### GET /api/settings
Retrieve current application settings including RTSP URL.

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "rtsp_url": "https://rtsp.me/embed/example",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

**Example:**
```bash
curl http://localhost:5000/api/settings
```

---

#### POST /api/settings
Create or update application settings.

**Request Body:**
```json
{
  "rtsp_url": "https://rtsp.me/embed/example"
}
```

**Response:**
```json
{
  "message": "Settings updated successfully"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/settings \
  -H "Content-Type: application/json" \
  -d '{"rtsp_url": "https://rtsp.me/embed/example"}'
```

---

### Overlays

#### GET /api/overlays
Retrieve all overlays.

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
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
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "type": "image",
    "content": "https://example.com/logo.png",
    "position": {
      "x": 50,
      "y": 50
    },
    "size": {
      "width": 150,
      "height": 150
    },
    "created_at": "2024-01-15T10:35:00.000Z",
    "updated_at": "2024-01-15T10:35:00.000Z"
  }
]
```

**Example:**
```bash
curl http://localhost:5000/api/overlays
```

---

#### POST /api/overlays
Create a new overlay.

**Request Body:**
```json
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

**Field Descriptions:**
- `type` (required): Either `"text"` or `"image"`
- `content` (required): Text content for text overlays, or image URL for image overlays
- `position` (optional): Object with `x` and `y` coordinates (default: `{x: 0, y: 0}`)
- `size` (optional): Object with `width` and `height` (default: `{width: 200, height: 50}`)

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
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
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/overlays \
  -H "Content-Type: application/json" \
  -d '{
    "type": "text",
    "content": "Hello World",
    "position": {"x": 100, "y": 100},
    "size": {"width": 200, "height": 50}
  }'
```

---

#### GET /api/overlays/{overlay_id}
Retrieve a specific overlay by ID.

**Parameters:**
- `overlay_id` (path): MongoDB ObjectId of the overlay

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
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
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Overlay not found"
}
```

**Example:**
```bash
curl http://localhost:5000/api/overlays/507f1f77bcf86cd799439011
```

---

#### PUT /api/overlays/{overlay_id}
Update an existing overlay.

**Parameters:**
- `overlay_id` (path): MongoDB ObjectId of the overlay

**Request Body:**
```json
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

**Note:** All fields are optional. Only include fields you want to update.

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
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
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:35:00.000Z"
}
```

**Example:**
```bash
curl -X PUT http://localhost:5000/api/overlays/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Updated text",
    "position": {"x": 150, "y": 150}
  }'
```

---

#### DELETE /api/overlays/{overlay_id}
Delete an overlay.

**Parameters:**
- `overlay_id` (path): MongoDB ObjectId of the overlay

**Response:**
```json
{
  "message": "Overlay deleted successfully"
}
```

**Error Response (404):**
```json
{
  "error": "Overlay not found"
}
```

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/overlays/507f1f77bcf86cd799439011
```

---

### Health Check

#### GET /api/health
Check if the API is running and healthy.

**Response:**
```json
{
  "status": "healthy"
}
```

**Example:**
```bash
curl http://localhost:5000/api/health
```

---

## Error Responses

All endpoints may return error responses in the following format:

**400 Bad Request:**
```json
{
  "error": "Invalid request data"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error message"
}
```

## Data Models

### Overlay Object
```typescript
interface Overlay {
  _id: string;              // MongoDB ObjectId (string)
  type: "text" | "image";    // Overlay type
  content: string;           // Text content or image URL
  position: {               // Position on video
    x: number;              // X coordinate in pixels
    y: number;              // Y coordinate in pixels
  };
  size: {                   // Size of overlay
    width: number;          // Width in pixels
    height: number;        // Height in pixels
  };
  created_at: string;       // ISO 8601 datetime
  updated_at: string;       // ISO 8601 datetime
}
```

### Settings Object
```typescript
interface Settings {
  _id: string;              // MongoDB ObjectId (string)
  rtsp_url: string;         // RTSP or HLS stream URL
  updated_at: string;       // ISO 8601 datetime
}
```

## CORS

The API includes CORS headers to allow requests from the frontend. By default, it allows all origins in development mode.

## Rate Limiting

Currently, there is no rate limiting implemented. For production use, consider adding rate limiting middleware.
