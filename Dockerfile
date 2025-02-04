FROM node:22.13-slim

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile
COPY . .

RUN yarn build
CMD ["yarn", "start:prod"]