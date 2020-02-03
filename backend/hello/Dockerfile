FROM node:12

RUN mkdir /app
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . ./
CMD yarn run start
