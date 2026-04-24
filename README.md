# AI Code Debugger

A production-ready full-stack project with a React frontend and a Node.js/Express backend powered by OpenRouter and MongoDB.

## Project Structure

```text
AI-Code-Debugger/
├── client/   # React + Vite frontend
└── server/   # Express API + MongoDB
```

## Environment Variables

### Backend: `server/.env`

Copy `server/.env.example` to `server/.env`, then update values for your deployment environment.

Recommended backend variables:

```env
NODE_ENV=production
PORT=5000
HOST=0.0.0.0
CLIENT_URL=https://your-frontend-domain.com
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
JWT_ISSUER=ai-code-debugger
OPENROUTER_API_KEY=replace_with_your_openrouter_api_key
OPENROUTER_MODEL=openai/gpt-4o-mini
OPENROUTER_SITE_URL=https://your-backend-domain.com
OPENROUTER_APP_NAME=AI Code Debugger
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=ai-code-debugger
```

### Frontend: `client/.env`

Copy `client/.env.example` to `client/.env` and set the backend URL for your deployed API.

```env
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_APP_NAME=AI Code Debugger
```

## Local Development

### Frontend
```bash
cd client
npm run dev
```

### Backend
```bash
cd server
npm run dev
```

## Production Build

From the project root:

```bash
npm install
npm run build
npm start
```

## Deployment Notes

- The frontend build is optimized with Vite chunk splitting and outputs to `client/build`.
- API URLs are controlled with `REACT_APP_API_URL` in production, with `VITE_API_BASE_URL` as a fallback.
- Backend CORS is controlled with `CLIENT_URL`.
- Health check endpoint: `GET /api/health`
- Debug endpoint: `POST /api/debug`
- Chat endpoint: `POST /api/chat`

### Deployment notes

- Use a custom domain for both the backend service and the frontend deployment.
- Enable HTTPS on your deployed domains after domain verification.
- Set the frontend `VITE_API_BASE_URL` to the public backend URL, for example `https://your-backend-domain.com`.
- Do not use local network addresses such as `http://10.x.x.x:5000` or internal IPs in deployment environment variables.
- Configure frontend environment variables in your deployment platform's environment settings.
- Ensure the backend `CLIENT_URL` includes the deployed frontend domain, for example `https://your-frontend-domain.com`, to prevent CORS errors.
- Do not deploy a local `client/.env` or `server/.env` file with private/local host references; production should use environment variables configured in the deployment environment.

Static site deployment settings:
- Build command: `npm --prefix client run build`
- Publish directory: `client/build`
- Environment variable: `VITE_API_BASE_URL=https://your-backend-domain.com`

Backend service deployment settings:
- Start command: `npm run start`
- Environment variables: `PORT=5000`, `HOST=0.0.0.0`, `CLIENT_URL=https://your-frontend-domain.com`, plus production secrets.

The frontend runs locally on `http://localhost:5174` and the backend runs locally on `http://localhost:5000` by default.
