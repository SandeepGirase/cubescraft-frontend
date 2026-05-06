# Development Environment Setup

This guide helps you set up the development environment for the Employee Task Tracking System frontend.

## Prerequisites

- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher
- **Git**: For version control
- **Backend API**: Running at `http://localhost:8080/api` (default)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cubescraft-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env.development
```

Update `.env.development` with your local settings:

```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=30000
VITE_ENVIRONMENT=development
VITE_LOG_LEVEL=debug
VITE_ENABLE_CONSOLE_LOG=true
```

## Development

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Run Linter

```bash
npm run lint
```

### Fix Linting Issues

```bash
npm run lint:fix
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── api/                    # API configuration and requests
├── assets/                 # Static assets (images, fonts, etc.)
├── components/            # Reusable React components
│   ├── ErrorBoundary.jsx  # Error boundary for error handling
│   ├── Layout.jsx         # Main layout component
│   └── Navbar.jsx         # Navigation bar
├── config/                # Configuration files
│   └── env.js            # Environment configuration
├── context/              # React context (global state)
│   └── LoadingContext.jsx # Global loading state
├── locales/              # i18n translation files
│   ├── en.json          # English translations
│   └── de.json          # German translations
├── pages/                # Page components
│   ├── Dashboard.jsx
│   ├── Clients.jsx
│   ├── Employees.jsx
│   ├── Tasks.jsx
│   └── Tracking.jsx
├── utils/                # Utility functions
│   ├── logger.js        # Logging service
│   ├── globalErrorHandler.js  # Global error handling
│   └── apiResponse.js   # API response handling
├── App.jsx              # Main application component
├── i18n.js              # i18n configuration
├── index.css            # Global styles
├── App.css              # Application styles
└── main.jsx             # Application entry point
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format code with Prettier |

## Debugging

### Browser DevTools

1. Open Chrome DevTools (F12 or Cmd+Option+I)
2. Go to Sources tab for debugging
3. Use Console tab to check logs

### Debug in VS Code

1. Install Debugger for Chrome extension
2. Add breakpoints in your code
3. Run debug configuration

### Check Console Logs

All logs are visible in the browser console during development:

```javascript
import { createLogger } from './utils/logger';

const logger = createLogger('MyComponent');
logger.info('Information message', { data: value });
logger.error('Error message', { error: errorObject });
```

## API Integration

### Making API Calls

```javascript
import api from './api/axiosConfig';

// GET request
try {
  const response = await api.get('/employees');
  console.log(response.data);
} catch (error) {
  console.error(error.message);
}

// POST request
try {
  const response = await api.post('/tasks', { title: 'New Task' });
  console.log(response.data);
} catch (error) {
  console.error(error.message);
}
```

### Environment Variables for APIs

Configure different API endpoints for different environments:

```javascript
// Development
VITE_API_BASE_URL=http://localhost:8080/api

// Production
VITE_API_BASE_URL=https://api.production.com/api
```

## Testing

### Manual Testing

1. Test in Chrome, Firefox, Safari, and Edge
2. Test on mobile devices using DevTools device simulation
3. Test with slow network using DevTools throttling

### Error Scenarios

1. Disconnect internet and test error handling
2. Use DevTools to simulate API failures
3. Check error messages and logging

## Build & Deployment

See [PRODUCTION.md](./PRODUCTION.md) for production deployment guide.

## Internationalization (i18n)

### Adding New Translations

1. Update `src/locales/en.json` for English
2. Update `src/locales/de.json` for German
3. Use in components:

```javascript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('common.title')}</h1>;
}
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or start on different port
npm run dev -- --port 3000
```

### Module Not Found

```bash
rm -rf node_modules package-lock.json
npm install
```

### API Connection Issues

1. Verify backend is running
2. Check `VITE_API_BASE_URL` in `.env.development`
3. Check CORS configuration on backend
4. Check browser console for errors

## Performance Tips

1. Use React DevTools Profiler to find slow components
2. Use Chrome DevTools Lighthouse for performance audit
3. Check bundle size: `npm run build:analyze`
4. Enable lazy loading for routes

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request

## Support

For questions or issues, contact the development team or check the project documentation.
