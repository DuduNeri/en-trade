# 1. Imagem base do Node.js
FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala todas as dependências (incluindo devDependencies para o build)
RUN npm ci

# Copia todo o código-fonte
COPY . .

# Compila o projeto TypeScript (gera a pasta dist/)
RUN npm run build

# 2. Estágio final (produção leve)
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Copia apenas as dependências de produção e o build acumulado
COPY package*.json ./
RUN npm ci --only=production

COPY --from=build /usr/src/app/dist ./dist

# Expõe a porta que a sua API utiliza
EXPOSE 8000

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]