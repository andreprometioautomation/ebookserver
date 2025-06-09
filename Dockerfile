FROM node:20-slim

ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

COPY package*.json ./

# Usa install si no hay package-lock.json
RUN npm install

COPY . .

# 🔽 DESCARGA Y EXTRAER PERFIL DE FIREFOX


# 🔧 Instala Playwright con navegadores y dependencias del sistema
RUN npx playwright install --with-deps

# 🔨 Compila la app (Next.js)
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
