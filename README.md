# Employee Task Tracking System - Frontend

A production-ready React + Vite frontend application for managing employees, clients, tasks, and tracking work efficiently.

## 🚀 Quick Start

### Prerequisites

- Node.js 16.0.0 or higher
- npm 7.0.0 or higher
- Backend API running at `http://localhost:8080/api`

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cubescraft-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.development

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 📋 Features

- ✅ **Employee Management** - Add, edit, and manage employees
- ✅ **Client Management** - Track client information
- ✅ **Task Management** - Create and assign tasks
- ✅ **Work Tracking** - Monitor task progress and time tracking
- ✅ **Dashboard** - Overview of key metrics
- ✅ **Multi-language Support** - English and German
- ✅ **Error Handling** - Comprehensive error boundaries and logging
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Production Ready** - Optimized build, security, and monitoring

## 📁 Project Structure

```
cubescraft-frontend/
├── public/                          # Static assets
├── src/
│   ├── api/
│   │   └── axiosConfig.js          # Axios API configuration with interceptors
│   ├── assets/                      # Images, fonts, etc.
│   ├── components/
│   │   ├── ErrorBoundary.jsx       # Error boundary component
│   │   ├── Layout.jsx              # Main layout wrapper
│   │   └── Navbar.jsx              # Navigation component
│   ├── config/
│   │   └── env.js                  # Environment configuration
│   ├── context/
│   │   └── LoadingContext.jsx      # Global loading state
│   ├── locales/
│   │   ├── en.json                 # English translations
│   │   └── de.json                 # German translations
│   ├── pages/
│   │   ├── Dashboard.jsx           # Dashboard page
│   │   ├── Clients.jsx             # Clients management
│   │   ├── Employees.jsx           # Employees management
│   │   ├── Tasks.jsx               # Tasks management
│   │   └── Tracking.jsx            # Work tracking
│   ├── utils/
│   │   ├── logger.js               # Logging service
│   │   ├── globalErrorHandler.js   # Global error handling
│   │   └── apiResponse.js          # API response utilities
│   ├── App.jsx                     # Main app component
│   ├── App.css                     # Application styles
│   ├── i18n.js                     # i18n configuration
│   ├── index.css                   # Global styles
│   └── main.jsx                    # Entry point
├── .env.example                     # Example environment variables
├── .env.development                 # Development environment
├── .env.production                  # Production environment
├── Dockerfile                       # Docker configuration
├── docker-compose.yml               # Docker Compose setup
├── vite.config.js                  # Vite configuration
├── eslint.config.js                # ESLint configuration
├── package.json                    # Dependencies and scripts
├── PRODUCTION.md                   # Production deployment guide
├── DEVELOPMENT.md                  # Development setup guide
└── README.md                       # This file
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build locally
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Prettier
npm run type-check       # Type checking (if TypeScript configured)
```

## 🌍 Environment Configuration

### Development

```bash
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=30000
VITE_ENVIRONMENT=development
VITE_LOG_LEVEL=debug
VITE_ENABLE_CONSOLE_LOG=true
```

### Production

```bash
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_API_TIMEOUT=30000
VITE_ENVIRONMENT=production
VITE_LOG_LEVEL=error
VITE_ENABLE_CONSOLE_LOG=false
```

## 🔐 Security Features

- **Error Boundaries** - Graceful error handling with user-friendly messages
- **Secure API Configuration** - CORS-aware, token-based authentication support
- **Request Interceptors** - Automatic token injection and request logging
- **Response Interceptors** - Unified error handling and HTTP error management
- **Environment Variables** - Sensitive data separated from source code
- **Production Optimizations** - Console logs and debuggers removed in production
- **HTTPS Ready** - Supports secure API endpoints in production

## 📊 Monitoring & Logging

The application includes a comprehensive logging system:

```javascript
import { createLogger } from './utils/logger';

const logger = createLogger('MyComponent');

logger.debug('Debug message', { data });
logger.info('Info message', { data });
logger.warn('Warning message', { data });
logger.error('Error message', { error });
```

## 🚢 Docker Deployment

### Build Docker Image

```bash
# Using docker-compose
docker-compose up --build

# Or manually
docker build -t cubescraft-frontend:latest .
docker run -p 3000:3000 cubescraft-frontend:latest
```

### Environment in Docker

Docker Compose automatically uses `.env.production` settings.

## 📱 Internationalization (i18n)

The app supports multiple languages:

- **English** (`en`) - Default
- **German** (`de`)

Switch languages using the language selector in the top-right corner.

### Adding New Language

1. Create translation file: `src/locales/fr.json`
2. Add to `src/i18n.js` resources
3. Update language selector in `Layout.jsx`

## 🎨 Styling

- **App.css** - Application styles
- **index.css** - Global styles
- Uses inline styles in components for production bundle optimization

## 🔗 API Integration

The application connects to a backend API:

- **Base URL**: Configured via `VITE_API_BASE_URL`
- **Timeout**: 30 seconds (configurable)
- **Authentication**: Bearer token support (stored in localStorage)
- **Error Handling**: Automatic error catching and user-friendly messages

### Example API Call

```javascript
import api from './api/axiosConfig';

const fetchEmployees = async () => {
  try {
    const response = await api.get('/employees');
    console.log(response.data);
  } catch (error) {
    console.error(error.message);
  }
};
```

## 📈 Performance

The application is optimized for production:

- **Code Splitting** - Vendor and app code separated
- **Minification** - All code minified and compressed
- **Asset Hashing** - Cache busting for long-term caching
- **Bundle Analysis** - Run `npm run build:analyze` to check bundle size
- **Lazy Loading** - Route-based code splitting ready

## ✅ Testing

### Manual Testing

1. Test all pages: Dashboard, Employees, Clients, Tasks, Tracking
2. Test language switching (English ↔ German)
3. Test error scenarios (offline, API errors)
4. Test on different browsers and screen sizes

### Development Testing

```bash
# Run linter
npm run lint

# Build for testing
npm run build
npm run preview

# Test API connection
# Check browser console for any errors
```

## 🚀 Deployment

### Netlify / Vercel

1. Push code to GitHub
2. Connect repository to Netlify/Vercel
3. Set environment variables in platform dashboard
4. Deploy automatically on push

### Docker

See [PRODUCTION.md](./PRODUCTION.md) for complete Docker deployment guide.

### AWS / Azure / GCP

1. Build Docker image: `docker build -t app:latest .`
2. Push to container registry
3. Deploy to your cloud platform
4. Configure DNS and SSL

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Dependencies Issues

```bash
rm -rf node_modules package-lock.json
npm install
```

### API Connection Failed

1. Check backend is running
2. Verify `VITE_API_BASE_URL` in `.env.development`
3. Check CORS headers on backend
4. Verify firewall/network access

### Build Fails

1. Clear `node_modules`: `rm -rf node_modules`
2. Reinstall: `npm install`
3. Check Node.js version: `node --version` (should be 16+)
4. Check for TypeScript errors: `npm run type-check`

## 📚 Documentation

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development environment setup
- **[PRODUCTION.md](./PRODUCTION.md)** - Production deployment guide
- **[Vite Docs](https://vite.dev/)** - Vite documentation
- **[React Docs](https://react.dev/)** - React documentation
- **[React Router](https://reactrouter.com/)** - React Router documentation

## 👥 Team & Support

For questions, issues, or contributions, please contact the development team.

## 📄 License

All rights reserved. © 2024 cubescraft

---

**Version**: 1.0.0  
**Last Updated**: 2024-05-06  
**Status**: Production Ready ✅

