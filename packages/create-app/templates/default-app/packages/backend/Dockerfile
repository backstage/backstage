FROM node:12

WORKDIR /usr/src/app

COPY . .

RUN yarn install --frozen-lockfile --production

CMD ["node", "packages/backend"]
