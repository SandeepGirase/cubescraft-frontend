# Docker Build Script

#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Building Docker image for Employee Task Tracking Frontend...${NC}"

# Build the Docker image
docker build -t cubescraft-frontend:latest .

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Docker image built successfully${NC}"
  echo -e "${YELLOW}To run the container:${NC}"
  echo "docker run -p 3000:3000 cubescraft-frontend:latest"
else
  echo -e "${RED}✗ Docker build failed${NC}"
  exit 1
fi

# Optional: Tag for registry
# docker tag cubescraft-frontend:latest your-registry/cubescraft-frontend:latest
# docker push your-registry/cubescraft-frontend:latest
