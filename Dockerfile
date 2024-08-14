FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm && pnpm install

COPY prisma ./prisma

COPY . .

RUN npx prisma generate

EXPOSE 4000

CMD [ "pnpm", "start" ]