#----------------BUILD-----------------
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

#----------------RELEASE-----------------
# nginx sin privilegios: corre como usuario no-root y escucha en el puerto 8080
FROM nginxinc/nginx-unprivileged:alpine AS release

# Parchar los paquetes del sistema (CVE con fix publicado, detectados por Trivy)
USER root
RUN apk upgrade --no-cache
USER 101

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080
