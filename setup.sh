#!/bin/bash

# RTSP Livestream Overlay Application Setup Script

echo "========================================="
echo "RTSP Livestream Overlay Setup"
echo "========================================="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi
echo "✅ Python 3 found: $(python3 --version)"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi
echo "✅ Node.js found: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi
echo "✅ npm found: $(npm --version)"

# Check MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found in PATH. Please ensure MongoDB is installed and running."
else
    echo "✅ MongoDB found"
fi

echo ""
echo "Setting up backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "✅ Created .env file. Please update it with your MongoDB connection string."
else
    echo "✅ .env file already exists"
fi

deactivate
cd ..

echo ""
echo "Setting up frontend..."
cd frontend

# Install Node dependencies
echo "Installing Node.js dependencies..."
npm install

cd ..

echo ""
echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Make sure MongoDB is running"
echo "2. Update backend/.env with your MongoDB connection string"
echo "3. Start the backend: cd backend && source venv/bin/activate && python app.py"
echo "4. Start the frontend: cd frontend && npm start"
echo ""
echo "For detailed instructions, see README.md"
