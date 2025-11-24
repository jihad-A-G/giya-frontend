#!/bin/bash

# Backend Integration Test Script
# This script checks if both the frontend and backend are running correctly

echo "🔍 Checking Backend Integration..."
echo ""

# Check if backend is running
echo "1. Testing Backend API (http://localhost:5000)..."
if curl -s http://localhost:5000 > /dev/null 2>&1; then
    echo "   ✅ Backend is running"
    BACKEND_RESPONSE=$(curl -s http://localhost:5000)
    echo "   Response: $BACKEND_RESPONSE"
else
    echo "   ❌ Backend is NOT running on http://localhost:5000"
    echo "   Please start the backend with: cd Giya-backend && npm run dev"
fi

echo ""

# Check if frontend is running
echo "2. Testing Frontend (http://localhost:3000)..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Frontend is running"
else
    echo "   ❌ Frontend is NOT running on http://localhost:3000"
    echo "   Please start the frontend with: npm run dev"
fi

echo ""

# Test backend API endpoints
echo "3. Testing Backend API Endpoints..."

# Test products endpoint
echo "   Testing GET /api/products..."
if curl -s http://localhost:5000/api/products > /dev/null 2>&1; then
    echo "   ✅ Products endpoint is accessible"
else
    echo "   ❌ Products endpoint failed"
fi

# Test projects endpoint
echo "   Testing GET /api/projects..."
if curl -s http://localhost:5000/api/projects > /dev/null 2>&1; then
    echo "   ✅ Projects endpoint is accessible"
else
    echo "   ❌ Projects endpoint failed"
fi

# Test services endpoint
echo "   Testing GET /api/services..."
if curl -s http://localhost:5000/api/services > /dev/null 2>&1; then
    echo "   ✅ Services endpoint is accessible"
else
    echo "   ❌ Services endpoint failed"
fi

# Test testimonials endpoint
echo "   Testing GET /api/testimonials..."
if curl -s http://localhost:5000/api/testimonials > /dev/null 2>&1; then
    echo "   ✅ Testimonials endpoint is accessible"
else
    echo "   ❌ Testimonials endpoint failed"
fi

echo ""
echo "4. Checking Environment Configuration..."
if [ -f ".env.local" ]; then
    echo "   ✅ .env.local file exists"
    if grep -q "NEXT_PUBLIC_API_URL" .env.local; then
        API_URL=$(grep NEXT_PUBLIC_API_URL .env.local | cut -d '=' -f2)
        echo "   Backend URL: $API_URL"
    fi
else
    echo "   ❌ .env.local file not found"
fi

echo ""
echo "Integration check complete!"
echo ""
echo "📝 Next Steps:"
echo "   1. Make sure MongoDB is running"
echo "   2. Start the backend: cd Giya-backend && npm run dev"
echo "   3. Start the frontend: npm run dev"
echo "   4. Visit http://localhost:3000 in your browser"
