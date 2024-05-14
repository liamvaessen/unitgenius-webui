# Use Node.js as base image
FROM node:14-alpine AS build


# Install Git
RUN apk update && apk add git

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Use NGINX as base image for serving static files
FROM nginx:alpine

# Copy the built React app from the build stage to NGINX web server
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
