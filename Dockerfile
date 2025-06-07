FROM node:20-slim

ENV DEBIAN_FRONTEND=noninteractive


WORKDIR /app

COPY package*.json ./

# Usa install si no hay package-lock.json
RUN npm install

COPY . .

RUN npx playwright install --with-deps

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
