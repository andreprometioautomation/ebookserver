# Usa la imagen oficial de Node.js (Debian-based)
FROM node:20-slim

# Establece el directorio de trabajo
WORKDIR /app

# Instala las dependencias del sistema necesarias para Playwright
RUN apt-get update && apt-get install -y \
    wget gnupg unzip curl \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxcomposite1 \
    libxdamage1 libxrandr2 libgbm1 libgtk-3-0 libasound2 libxss1 libxshmfence1 \
    libx11-xcb1 libdbus-1-3 libdrm2 libxext6 libxfixes3 \
    && rm -rf /var/lib/apt/lists/*

# Copia los archivos de tu proyecto
COPY . .

# Instala dependencias de Node.js
RUN npm install

# Instala Playwright y sus navegadores
RUN npx playwright install --with-deps

# Expón el puerto (ajusta si usas otro)
EXPOSE 3000

# Comando para iniciar tu app
CMD ["npm", "start"]
