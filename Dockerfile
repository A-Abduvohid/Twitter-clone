FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm @nestjs/cli && pnpm install

COPY . .

RUN npx prisma generate

EXPOSE 4000

CMD ["pnpm", "start"]
