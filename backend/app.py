from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
DB_NAME = os.getenv('DB_NAME', 'rtsp_overlay')

try:
    if 'YOUR_PASSWORD_HERE' in MONGO_URI:
        print("❌ Please update your MongoDB password in .env file")
        print("   Replace YOUR_PASSWORD_HERE with your actual password")
        print("   If your password has special characters, use: python encode_password.py")
        raise ValueError("MongoDB password not configured")
    
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=10000)
    # Test the connection
    client.server_info()
    print(f"✅ Successfully connected to MongoDB: {DB_NAME}")
except ValueError as e:
    print(f"❌ Configuration error: {e}")
    raise
except Exception as e:
    error_msg = str(e)
    print(f"❌ MongoDB connection error: {error_msg}")
    
    if "authentication failed" in error_msg.lower() or "bad auth" in error_msg.lower():
        print("\n💡 Authentication troubleshooting:")
        print("   1. Verify your password is correct in .env file")
        print("   2. If password has special characters (@, #, $, %, etc.), URL encode them")
        print("   3. Run: python encode_password.py to encode your password")
        print("   4. Make sure the username is correct: chiragcrypt_db_user")
    elif "timeout" in error_msg.lower() or "network" in error_msg.lower():
        print("\n💡 Network troubleshooting:")
        print("   1. Check your internet connection")
        print("   2. Verify your IP is whitelisted in MongoDB Atlas")
        print("   3. Go to MongoDB Atlas → Network Access → Add IP Address")
    
    print("\nPlease check your MONGO_URI in .env file")
    raise

db = client[DB_NAME]
overlays_collection = db['overlays']
settings_collection = db['settings']

# Helper function to convert ObjectId to string
def serialize_overlay(overlay):
    overlay['_id'] = str(overlay['_id'])
    return overlay

# Settings API
@app.route('/api/settings', methods=['GET'])
def get_settings():
    """Get RTSP URL and other settings"""
    settings = settings_collection.find_one({})
    if settings:
        settings['_id'] = str(settings['_id'])
    return jsonify(settings or {'rtsp_url': ''})

@app.route('/api/settings', methods=['POST', 'PUT'])
def update_settings():
    """Update RTSP URL and other settings"""
    data = request.json
    settings_collection.update_one(
        {},
        {'$set': {'rtsp_url': data.get('rtsp_url', ''), 'updated_at': datetime.utcnow()}},
        upsert=True
    )
    return jsonify({'message': 'Settings updated successfully'})

# Overlay CRUD APIs
@app.route('/api/overlays', methods=['GET'])
def get_overlays():
    """Get all overlays"""
    overlays = list(overlays_collection.find({}))
    return jsonify([serialize_overlay(overlay) for overlay in overlays])

@app.route('/api/overlays', methods=['POST'])
def create_overlay():
    """Create a new overlay"""
    data = request.json
    overlay = {
        'type': data.get('type', 'text'),  # 'text' or 'image'
        'content': data.get('content', ''),
        'position': data.get('position', {'x': 0, 'y': 0}),
        'size': data.get('size', {'width': 200, 'height': 50}),
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    }
    result = overlays_collection.insert_one(overlay)
    overlay['_id'] = str(result.inserted_id)
    return jsonify(overlay), 201

@app.route('/api/overlays/<overlay_id>', methods=['GET'])
def get_overlay(overlay_id):
    """Get a specific overlay"""
    try:
        overlay = overlays_collection.find_one({'_id': ObjectId(overlay_id)})
        if overlay:
            return jsonify(serialize_overlay(overlay))
        return jsonify({'error': 'Overlay not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/overlays/<overlay_id>', methods=['PUT'])
def update_overlay(overlay_id):
    """Update an overlay"""
    try:
        data = request.json
        update_data = {
            'updated_at': datetime.utcnow()
        }
        
        if 'type' in data:
            update_data['type'] = data['type']
        if 'content' in data:
            update_data['content'] = data['content']
        if 'position' in data:
            update_data['position'] = data['position']
        if 'size' in data:
            update_data['size'] = data['size']
        
        result = overlays_collection.update_one(
            {'_id': ObjectId(overlay_id)},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Overlay not found'}), 404
        
        overlay = overlays_collection.find_one({'_id': ObjectId(overlay_id)})
        return jsonify(serialize_overlay(overlay))
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/overlays/<overlay_id>', methods=['DELETE'])
def delete_overlay(overlay_id):
    """Delete an overlay"""
    try:
        result = overlays_collection.delete_one({'_id': ObjectId(overlay_id)})
        if result.deleted_count == 0:
            return jsonify({'error': 'Overlay not found'}), 404
        return jsonify({'message': 'Overlay deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
