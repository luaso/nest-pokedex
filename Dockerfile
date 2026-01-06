# 1. Dependencias
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiamos archivos de definición de paquetes
COPY package*.json ./

# Instalamos todas las dependencias (incluye devDependencies)
# ci es más rápido y seguro que "install" en entornos de CI/CD
RUN npm ci

# 2. Construcción (Build)
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generamos el build de NestJS (la carpeta /dist)
RUN npm run build

# Instalamos solo las dependencias de producción y limpiamos la caché
ENV NODE_ENV production
RUN npm ci --only=production && npm cache clean --force

# 3. Ejecución (Runner)
FROM node:24-alpine AS runner
WORKDIR /usr/src/app

# Crear un usuario sin privilegios por seguridad
RUN addgroup -S nodegroup && adduser -S nodeuser -G nodegroup

# Copiar solo lo necesario desde la etapa builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Cambiar la propiedad de los archivos al usuario nodeuser
RUN chown -R nodeuser:nodegroup /usr/src/app

# Usar el usuario creado
USER nodeuser

EXPOSE 3000

CMD [ "node", "dist/main" ]
