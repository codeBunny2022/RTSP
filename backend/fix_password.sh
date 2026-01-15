#!/bin/bash

# Quick script to fix password encoding in .env file

echo "MongoDB Password Fixer"
echo "======================"
echo ""

# Read current .env
if [ ! -f ".env" ]; then
    echo "❌ .env file not found"
    exit 1
fi

# Extract current password from .env
CURRENT_URI=$(grep MONGO_URI .env | cut -d'=' -f2-)
if [ -z "$CURRENT_URI" ]; then
    echo "❌ MONGO_URI not found in .env"
    exit 1
fi

echo "Current connection string (password hidden):"
echo "$CURRENT_URI" | sed 's/:[^@]*@/:****@/'
echo ""

echo "Enter your MongoDB password:"
read -s PASSWORD

# Encode using quote_plus
ENCODED_PASSWORD=$(python3 -c "import urllib.parse; print(urllib.parse.quote_plus('$PASSWORD'))")

# Update .env file
cat > .env << EOF
MONGO_URI=mongodb+srv://chiragcrypt_db_user:${ENCODED_PASSWORD}@clustercentrl.jnxoe0j.mongodb.net/?appName=ClusterCentrl
DB_NAME=rtsp_overlay
EOF

echo ""
echo "✅ Password encoded and .env file updated!"
echo "   Encoded password: ${ENCODED_PASSWORD}"
echo ""
echo "Testing connection..."
python3 test_connection.py

