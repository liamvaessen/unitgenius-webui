# ### ------ Download dependencies and build ------
# # Base image
# FROM node:16-alpine AS build

# # Set working directory
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY ./package*.json ./

# # Install dependencies
# RUN npm install

# # Copy app files
# COPY . ./

# # Build Vue.js project
# RUN npm run build

# # Start the app
# CMD ["npm", "run", "serve"]

# Dockerfile for Vue.js App
FROM node:16-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# FROM nginx:alpine
# COPY --from=build-stage /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf