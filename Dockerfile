# Etapa 1: Build
FROM node:18 AS builder

# Diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./
COPY .env ./

# Instalar dependências
RUN npm install

# Copiar todo o projeto para o contêiner
COPY . .

# Construir o projeto
RUN npm run build

# Etapa 2: Runtime
FROM node:18

# Diretório de trabalho
WORKDIR /app

# Copiar os arquivos de build da etapa anterior
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./

# Instalar apenas dependências de produção
RUN npm install --production

# Expor a porta utilizada pela aplicação
EXPOSE 80

# Comando para iniciar a aplicação
CMD ["npm", "start"]
