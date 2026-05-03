FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY index.html styles.css script.js server.js ./
COPY eval-dashboard.html eval-dashboard.css eval-dashboard.js growthmate-logo.svg growthmate-logo.png ./
COPY eval ./eval
COPY scripts ./scripts


ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080

EXPOSE 8080

CMD ["npm", "start"]
