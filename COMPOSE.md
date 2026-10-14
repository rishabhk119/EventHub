# EventHub Docker Compose

Start all services:
docker compose up --build

Run in background:
docker compose up --build -d

Check services:
docker compose ps

View logs:
docker compose logs -f

Stop and remove containers/network:
docker compose down

Remove containers, network and MongoDB volume:
docker compose down -v
