# Frontend mit React/Vue/Angular (je nach Projekt)
FROM node:18-alpine AS builder
WORKDIR /app

# Installiere Abhängigkeiten und baue das Frontend
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Nginx für die Bereitstellung des Frontends
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html


# Standard-HTTP-Port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
