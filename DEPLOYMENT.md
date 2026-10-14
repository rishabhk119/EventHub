# EventHub Deployment

## Architecture
- Two Vercel projects from same GitHub repo: frontend root `client`, backend root `server`.
- GitHub Actions runs CI; Vercel Git integration handles automatic deployments independently.
- Docker and Compose remain local experiment workflows.

## Frontend: Vercel
- Root Directory: `client`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment variables:
  - `VITE_API_URL`: stable backend production origin
  - `VITE_SOCKET_URL`: stable backend production origin

## Backend: Vercel
- Framework / Runtime: Express, Node 22
- Root Directory: `server`
- Database: MongoDB Atlas
- Environment variables:
  - `MONGODB_URI`: MongoDB Atlas connection string
  - `JWT_SECRET`: Secret key for JWT signing
  - `CLIENT_URLS`: exact allowed frontend origins

## Real-Time & Auth Considerations
- Socket.IO is supported by Vercel WebSocket beta, but production cross-instance broadcasts require an external adapter/pubsub service.
- Public registration creates users only; provision admin separately in the database.
