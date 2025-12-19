# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY todo-frontend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY todo-frontend/ .

# Build the application with explicit output path
RUN npm run build -- --output-path=dist

# Debug: List what was built
RUN ls -la dist/
RUN find dist/ -type f -name "*.html" || echo "No HTML files found"
RUN ls -la dist/todo-frontend/ || echo "No todo-frontend folder"
RUN ls -la dist/todo-frontend/browser/ || echo "No browser folder"

# Use nginx to serve the built app
FROM nginx:alpine

# Copy built app from explicit output path
COPY --from=0 /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80


# Start nginx
CMD ["nginx", "-g", "daemon off;"]