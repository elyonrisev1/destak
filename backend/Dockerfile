FROM node:22-alpine

WORKDIR /app

# Copia package files
COPY package*.json ./
COPY prisma ./prisma

# Instala dependências e gera o Prisma client
RUN npm ci --omit=dev
RUN npx prisma generate

# Copia o resto do código
COPY . .

EXPOSE 3001

CMD ["npm", "start"]
