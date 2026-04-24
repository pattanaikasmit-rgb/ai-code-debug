const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const normalizeOrigin = (origin) => origin?.trim().replace(/\/$/, '').toLowerCase();
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((origin) => normalizeOrigin(origin)).filter(Boolean)
  : [];
const localNetworkOriginPattern =
  /^https?:\/\/((localhost|127\.0\.0\.1)|10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2}|[a-z0-9-]+\.local)(?::\d{1,5})?$/i;

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = normalizeOrigin(origin);
  if (allowedOrigins.includes('*') || allowedOrigins.includes(normalizedOrigin)) {
    return true;
  }

  if (localNetworkOriginPattern.test(normalizedOrigin)) {
    return true;
  }

  return false;
};

app.disable('x-powered-by');
app.set('trust proxy', 1);
const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    // Do not throw runtime 500s for CORS mismatches.
    // Returning `false` cleanly denies CORS headers for disallowed origins.
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use('/', routes);

if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.resolve(__dirname, '../../client/build');
  app.use(express.static(clientBuildPath));

  app.get('/*splat', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }

    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
