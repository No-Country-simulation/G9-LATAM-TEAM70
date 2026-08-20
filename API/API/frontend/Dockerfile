# Usamos una imagen ligera de Node.js
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero los archivos de dependencias para aprovechar el caché de Docker
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código del frontend
COPY . .

# Exponemos el puerto por defecto de Vite
EXPOSE 5173

# Arrancamos el servidor de desarrollo exponiendo la red (--host)
CMD ["npm", "run", "dev", "--", "--host"]