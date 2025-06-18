# Stage 1: Build the React app
FROM node:20-alpine AS builder

WORKDIR /app

# Add build arg to inject environment variables
ARG REACT_APP_API_BASE_URL

# Copy and install
COPY package*.json ./
RUN npm install

# Copy the rest and build the app
COPY . .

# Let React pick up the env var during build
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

COPY --from=builder /app/build /usr/share/nginx/html

# (optional) custom nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
