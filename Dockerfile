FROM node:12 as builder

WORKDIR /app

COPY package.json yarn.lock .yarnrc .npmrc /app/
COPY .yarn /app/.yarn
COPY packages /app/packages
COPY plugins /app/plugins

RUN yarn

COPY . .

RUN yarn build

CMD ["yarn", "workspace", "@spotify-backstage/app", "start"]
