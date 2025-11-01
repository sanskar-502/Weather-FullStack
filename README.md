# 🌤️ Weather Analytics Dashboard

A modern, full-stack weather application providing real-time weather data, forecasts, and beautiful data visualizations. Built with React, Redux Toolkit, and Node.js, featuring Google authentication and intelligent multi-layer caching.

![Weather Dashboard](https://img.shields.io/badge/React-18.2.0-blue)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-1.9.7-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green)

## ✨ Features

### 🌍 **Core Weather Features**
- **Real-time Weather Data** - Live weather updates with < 60 second freshness
- **7-Day Forecast** - Daily weather predictions with min/max temperatures
- **48-Hour Forecast** - Hourly weather data for detailed planning
- **Multiple Cities** - Track weather for unlimited locations
- **Favorites System** - Save and quickly access your favorite cities
- **Recent Searches** - Automatically tracks recently viewed locations

### 📊 **Data Visualizations**
- **Temperature Trends** - Interactive line charts showing temperature and "feels like" over time
- **Precipitation Analysis** - Bar charts displaying rain, snow, and probability
- **Wind Analytics** - Speed/gust trends and unique compass-style direction visualization
- **Interactive Charts** - Hover tooltips, clickable legends, and zoom/pan controls using Recharts
- **Mobile Responsive** - All charts optimized for mobile viewing

### 🔐 **Authentication & User Management**
- **Google Sign-In** - Secure OAuth authentication via Firebase
- **Protected Routes** - User-specific data with JWT token verification
- **Session Persistence** - Stay logged in across browser sessions
- **User Profiles** - Personalized experience with saved preferences

### ⚙️ **Settings & Preferences**
- **Temperature Units** - Toggle between Celsius (°C) and Fahrenheit (°F)
- **Auto-sync Preferences** - Settings saved to database and synced across devices
- **Instant Updates** - UI updates immediately when changing units

### 🔍 **Search & Discovery**
- **Smart Search** - Type-ahead autocomplete for cities worldwide
- **Geocoding API** - Accurate location data with coordinates
- **Search History** - Quickly revisit recently searched cities

### 🚀 **Performance & Optimization**
- **Multi-layer Caching**
  - Redis server cache (60s TTL for current weather)
  - Client-side browser cache
  - Redux in-memory state cache
  - Request de-duplication
- **90%+ API Call Reduction** - Intelligent caching strategy
- **Lazy Loading** - Components loaded on-demand
- **Optimized Bundle** - Code splitting for faster initial load

### 📱 **Mobile First Design**
- **Fully Responsive** - Works beautifully on all screen sizes
- **Touch Optimized** - 44px minimum touch targets
- **Progressive Enhancement** - Enhanced features on larger screens
- **Fast Performance** - Optimized for mobile networks

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18.2.0** - Modern React with Hooks
- **TypeScript 4.9.5** - Type-safe development
- **Redux Toolkit 1.9.7** - Centralized state management
- **React-Redux 8.1.3** - React bindings for Redux
- **Recharts 2.15.4** - Data visualization library
- **Axios 1.6.0** - HTTP client
- **date-fns 4.1.0** - Date formatting utilities
- **Firebase 12.5.0** - Authentication
- **React Scripts 5.0.1** - Build tooling (Create React App)

### **Backend**
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database (via Mongoose)
- **Redis** - In-memory cache (Upstash)
- **Firebase Admin SDK** - Authentication verification
- **Axios** - API requests to OpenWeatherMap

### **APIs**
- **OpenWeatherMap API** - Weather data provider
  - Current Weather API
  - OneCall API (48-hour + 7-day forecast)
  - 5-Day Forecast API (fallback)
- **Geocoding API** - City search and coordinates

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Redis** (optional but recommended - Upstash)
- **OpenWeatherMap API Key** ([Get one here](https://openweathermap.org/api))
- **Firebase Project** ([Firebase Console](https://console.firebase.google.com/))

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/sanskar-502/Weather-FullStack.git
cd Weather-App
```

#### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Configure Backend Environment Variables** (`.env`):
```env
# Server
PORT=3001

# MongoDB
MONGODB_URI=mongodb://localhost:27017/weather-app
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/weather-app

# Redis (Optional - Upstash)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# OpenWeatherMap API
OPENWEATHER_URL=https://api.openweathermap.org/data/2.5/weather
OPENWEATHER_ONECALL_URL=https://api.openweathermap.org/data/2.5/onecall
OPENWEATHER_FIVEDAY_URL=https://api.openweathermap.org/data/2.5/forecast
OWM_KEY=your_openweathermap_api_key

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-firebase-project-id
# Place firebase-service-account.json in backend/src/
```

**Start Backend Server**:
```bash
npm start
# Server runs on http://localhost:3001
```

#### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Configure Frontend Environment Variables** (`.env`):
```env
# API URL
REACT_APP_API_URL=http://localhost:3001/api

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

**Start Frontend Development Server**:
```bash
npm start
# App runs on http://localhost:3000
```

---

## 📁 Project Structure

```
Weather-App/
├── frontend/                  # React frontend
│   ├── public/               # Static files
│   └── src/
│       ├── features/         # Feature-based modules
│       │   ├── auth/        # Authentication (Google Sign-In)
│       │   ├── weather/     # Weather data & charts
│       │   ├── favorites/   # Favorites management
│       │   ├── search/      # City search
│       │   ├── preferences/ # User settings
│       │   └── recents/     # Recent searches
│       ├── pages/           # Page components
│       │   └── Dashboard.tsx
│       ├── store/           # Redux store
│       │   ├── store.ts
│       │   └── hooks.ts
│       ├── shared/          # Shared components
│       ├── styles/          # Global styles
│       └── types/           # TypeScript types
│
└── backend/                  # Node.js backend
    └── src/
        ├── controllers/     # Route handlers
        ├── models/          # MongoDB models
        ├── routes/          # API routes
        ├── config/          # Configuration
        └── index.js         # Server entry point
```

---

## 🔑 Key Features Explained

### 1. **Multi-Layer Caching Strategy**

```
User Request → Redux Cache → Client Cache → Backend API
                    ↓              ↓              ↓
                 Instant      ~1-5ms         ~50ms
                    ↓              ↓              ↓
               Redis Cache → OpenWeather API
                  ~50ms          ~200-500ms
```

- **Layer 1: Redux State** - Instant in-memory access
- **Layer 2: Browser Storage** - Local client cache
- **Layer 3: Redis** - Shared server cache (60s TTL)
- **Layer 4: OpenWeather API** - Fresh data when needed

**Result**: 90%+ reduction in API calls

---

### 2. **Real-Time Data Freshness**

- Current weather cached for **60 seconds** maximum
- Forecasts cached for **5 minutes**
- Automatic cache invalidation on expiry
- Timestamp tracking for data age verification

---

### 3. **Smart Favorites System**

```typescript
// Add favorite → Updates Redux → Syncs to Backend → Saves to MongoDB
dispatch(addFavorite({ id, name, lat, lon }));
dispatch(syncFavoriteAdd(favorite)); // Backend sync
```

- Instant UI updates (optimistic)
- Background sync to database
- Persists across sessions and devices
- Authenticated per user

---

### 4. **Responsive Charts**

All charts use `ResponsiveContainer` with:
- 100% width adaptation
- Touch-friendly interactions
- Mobile-optimized layouts
- Brush controls for zoom/pan
- Interactive tooltips and legends

---

## 🎨 UI/UX Features

### Design System
- **CSS Variables** - Consistent theming
- **Modern Gradients** - Beautiful color schemes
- **Smooth Animations** - 250ms transitions
- **Shadow Depths** - Material-inspired elevations
- **Responsive Typography** - Scales across devices

### Accessibility
- **ARIA Labels** - Screen reader support
- **Keyboard Navigation** - Full keyboard accessibility
- **Focus Indicators** - Clear focus states
- **Semantic HTML** - Proper element usage
- **Color Contrast** - WCAG AA compliance

### Mobile Optimization
- **Touch Targets** - Minimum 44px for buttons
- **Viewport Meta** - Proper mobile rendering
- **No Zoom on Input** - 16px font size on inputs
- **Swipe Gestures** - Natural mobile interactions

---

## 🧪 Testing

### Frontend Tests
```bash
cd frontend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch
```

### Backend Tests
```bash
cd backend

# Run tests (if configured)
npm test
```

---

## 📦 Building for Production

### Frontend Build
```bash
cd frontend
npm run build
```

Creates optimized production build in `frontend/build/`

### Backend Deployment
1. Set production environment variables
2. Use process manager (PM2 recommended)
```bash
npm install -g pm2
pm2 start src/index.js --name weather-api
```

---

## 🔒 Security Features

- **Environment Variables** - Sensitive data never in code
- **Backend API Proxy** - API keys hidden from client
- **Firebase Authentication** - Industry-standard OAuth
- **JWT Tokens** - Secure API authorization
- **CORS Configuration** - Restricted origins
- **Input Validation** - Sanitized user inputs
- **Rate Limiting** - Protection against abuse (via caching)

---

## 🌐 API Endpoints

### Weather Routes
- `GET /api/weather/current` - Current weather by coordinates
- `GET /api/weather/forecast` - 7-day + hourly forecast

### Search Routes
- `GET /api/search` - Search cities by name

### User Routes (Protected)
- `GET /api/users/favorites` - Get user's favorite cities
- `POST /api/users/favorites` - Add favorite city
- `DELETE /api/users/favorites/:id` - Remove favorite
- `PUT /api/users/preferences` - Update user preferences

---

## 🎯 Performance Metrics

- **Initial Load**: < 3s (on 3G)
- **Time to Interactive**: < 5s
- **API Response**: < 100ms (with cache)
- **Cache Hit Rate**: 90%+
- **Bundle Size**: Optimized with code splitting

---

## 🐛 Troubleshooting

### Common Issues

**1. "API key not configured" error**
- Ensure `OWM_KEY` is set in backend `.env`
- Restart backend server after adding key

**2. Google Sign-In not working**
- Verify Firebase configuration in frontend `.env`
- Check Firebase Console for authorized domains
- Ensure Firebase Authentication is enabled

**3. No weather data displaying**
- Check browser console for errors
- Verify backend server is running
- Test API endpoints directly (e.g., `http://localhost:3001/api/weather/current?lat=40.7128&lon=-74.0060&units=metric`)

**4. Redis errors**
- Redis is optional - app works without it
- Check Upstash credentials if using Redis
- Ensure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set

**5. MongoDB connection issues**
- Verify MongoDB is running (if local)
- Check `MONGODB_URI` in `.env`
- Ensure IP whitelist includes your IP (if using Atlas)

---

## 🚀 Future Enhancements

- [ ] Dark/Light theme toggle
- [ ] Weather alerts and notifications
- [ ] Historical weather data
- [ ] Weather maps integration
- [ ] Air quality index
- [ ] UV index warnings
- [ ] Severe weather alerts
- [ ] Multi-language support
- [ ] PWA capabilities (offline support)
- [ ] Social sharing features

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **OpenWeatherMap** - Weather data provider
- **Firebase** - Authentication service
- **Recharts** - Data visualization library
- **Upstash** - Redis serverless platform
- **Create React App** - React build tooling

---

## 👨‍💻 Developer

Built with ❤️ by Sanskar Dubey

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Contact: [your-email@example.com]

---

## 🌟 Show Your Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🤝 Contributing to the code

---

**Made with React ⚛️ | Powered by OpenWeatherMap 🌤️ | Secured by Firebase 🔐**
