# Stage 1: Build the React app
FROM node:20-alpine AS builder

WORKDIR /app

# Add build arg to inject environment variables
ARG REACT_APP_API_BASE_URL

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build the app
COPY . .
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
RUN npm run build

# Stage 2: Serve the build with a lightweight web server
FROM nginx:stable-alpine

# Copy built React app to Nginx’s public directory
COPY --from=builder /app/build /usr/share/nginx/html

# Optional: Replace default nginx.conf with custom one
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port and start server
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
