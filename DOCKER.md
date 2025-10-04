# Docker Setup for Workout Calendar

This document explains how to build and run the Workout Calendar application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, for easier management)

## Building the Docker Image

### Using Docker directly:

```bash
# Build the image
docker build -t workout-calendar .

# Run the container
docker run -p 3000:3000 workout-calendar
```

### Using Docker Compose:

```bash
# Build and start the application
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# Stop the application
docker-compose down
```

## Docker Features

### Multi-stage Build

- **deps**: Installs dependencies using Bun
- **builder**: Builds the Next.js application
- **runner**: Creates the production image with minimal footprint

### Optimizations

- Uses Bun for faster dependency installation
- Leverages Next.js standalone output for smaller image size
- Non-root user for security
- Health check endpoint for monitoring

### Environment Variables

- `NODE_ENV=production`
- `NEXT_TELEMETRY_DISABLED=1`
- `PORT=3000`
- `HOSTNAME=0.0.0.0`

## Health Check

The application includes a health check endpoint at `/api/health` that returns:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## Production Deployment

For production deployment, consider:

1. **Environment Variables**: Set production environment variables
2. **Reverse Proxy**: Use nginx or similar for SSL termination
3. **Monitoring**: Set up logging and monitoring
4. **Scaling**: Use Docker Swarm or Kubernetes for scaling

## Troubleshooting

### Build Issues

- Ensure Docker has enough memory allocated
- Check that all dependencies are properly listed in package.json

### Runtime Issues

- Check container logs: `docker logs <container-id>`
- Verify port mapping: `docker ps`
- Test health endpoint: `curl http://localhost:3000/api/health`

### Performance

- The image uses Alpine Linux for smaller size
- Next.js standalone output reduces bundle size
- Bun provides faster startup times
