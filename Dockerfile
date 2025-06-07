FROM node:20-slim

# Evita prompts interactivos durante la instalación
ENV DEBIAN_FRONTEND=noninteractive

# Actualiza e instala dependencias del sistema requeridas por Playwright


# Establece directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto (usa .dockerignore para excluir node_modules)
COPY package*.json ./

# Instala las dependencias Node.js
RUN npm ci

# Copia el resto del código
COPY . .

# Instala navegadores de Playwright y sus dependencias
RUN npx playwright install --with-deps

# Exponer puerto (ajústalo si es necesario)
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "start"]
