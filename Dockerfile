# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:16-alpine
WORKDIR /app

# Copy the built files from the build stage
COPY --from=build /app/dist ./build

# Copy necessary files for the server
COPY server.js .
COPY src ./src
COPY package*.json ./

# Install production dependencies without running scripts
RUN npm ci --only=production --ignore-scripts

# Install nginx
RUN apk add --no-cache nginx

# Copy nginx configuration
COPY nginx.conf /etc/nginx/http.d/default.conf

# Set environment variables with default empty values
ENV OLLAMA_API_URL=http://host.docker.internal:11434
ENV ANTHROPIC_API_KEY=
ENV OPENAI_API_KEY=

# Expose ports
EXPOSE 80 3001

# Start nginx and node server
CMD nginx && node server.js
