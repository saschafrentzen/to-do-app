# Schritt 1: Build-Phase mit Node.js
FROM node:18-alpine AS builder

WORKDIR /app

# Abhängigkeiten installieren
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Source-Code kopieren und Build erstellen
COPY . .
RUN npm run build

# Schritt 2: Bereitstellung mit Nginx
FROM nginx:alpine

# Standard-Nginx-Konfiguration entfernen (optional)
RUN rm -rf /usr/share/nginx/html/*

# Build-Ergebnisse aus dem Builder-Container kopieren
COPY --from=builder /app/build /usr/share/nginx/html

# Optional: Nginx-Konfigurationsdatei überschreiben (falls nötig)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
