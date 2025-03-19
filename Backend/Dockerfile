# Basis-Image mit Node.js
FROM node:18-alpine

# Setze das Arbeitsverzeichnis
WORKDIR /app

# Kopiere package.json und package-lock.json (um den Cache zu nutzen)
COPY package.json package-lock.json ./

# Installiere nur die Abhängigkeiten
RUN npm install --production

# Kopiere den gesamten Code ins Image
COPY . .

# Setze den Port für den Container
EXPOSE 3050

# Starte den Node.js-Server
CMD ["node", "server.js"]

