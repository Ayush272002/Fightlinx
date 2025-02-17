FROM node:20.12.0-alpine3.19

WORKDIR /app

COPY .gitignore .npmrc prettier.config.js ./
COPY package.json package-lock.json turbo.json  ./

COPY apps ./apps
COPY packages ./packages

RUN npm install

RUN npm run db:generate
RUN npm run build


CMD ["npm", "run", "start:mm"]