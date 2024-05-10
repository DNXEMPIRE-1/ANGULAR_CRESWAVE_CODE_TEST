# Stage 1: Building source code
FROM node:16.20-alpine3.16 as build
WORKDIR /app
COPY package*.json /app/
RUN npm ci
COPY . /app
RUN npm run build --prod

# Stage 2: Setting up the NGINX server
FROM nginx:1.23.3
COPY --from=build /app/dist/tma-spa /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
