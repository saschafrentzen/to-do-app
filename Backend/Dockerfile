# Verwende ein schlankes Node.js-Image
FROM node:18-alpine

# Setze das Arbeitsverzeichnis in Docker
WORKDIR /app

# Kopiere nur package.json und package-lock.json (um den Cache zu nutzen)
COPY package.json package-lock.json ./

# Installiere die Abhängigkeiten
RUN npm install

# Kopiere den Rest des Codes
COPY . .

# Port für den Server freigeben
EXPOSE 3050

# Starte die Anwendung
CMD ["node", "server.js"]
