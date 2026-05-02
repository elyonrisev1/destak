# Troque alpine por lts-slim
FROM node:22-slim

# Instale o OpenSSL explicitamente (o Prisma precisa disso no Linux)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copia os arquivos de dependência primeiro
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Gera o Prisma Client
RUN npx prisma generate --schema=./prisma/schema.prisma

EXPOSE 3000

CMD ["npm", "start"]
