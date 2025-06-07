FROM node:20-slim

# Evita prompts interactivos durante la instalación
ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# Instala librerías necesarias para Playwright y navegadores
RUN apt-get update && apt-get install -y \
    wget gnupg unzip curl \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
    libxcomposite1 libxdamage1 libxrandr2 libgbm1 libgtk-3-0 libasound2 \
    libxss1 libxshmfence1 libx11-xcb1 libdbus-1-3 libdrm2 libxext6 \
    libxfixes3 libx11-dev libglu1-mesa libgl1-mesa-glx libgles2-mesa \
    libgtk-4-1 libgraphene-1.0-0 libgstgl1.0-0 \
    libgstcodecparsers-1.0-0 libavif15 libenchant-2-2 \
    libsecret-1-0 libmanette-0.2-0 libgles2-mesa-dev \
 && rm -rf /var/lib/apt/lists/*

# Copia los archivos del proyecto
COPY . .

# Instala las dependencias de Node.js
RUN npm ci

# Instala Playwright y navegadores
RUN npx playwright install --with-deps

# Exponer puerto (ajústalo si tu app usa otro)
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "start"]
