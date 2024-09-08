# Build stage
FROM node:16-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Production stage
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy built assets from the build stage
COPY --from=build /app/build ./build

# Copy server files
COPY server.js .
COPY src ./src
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

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
