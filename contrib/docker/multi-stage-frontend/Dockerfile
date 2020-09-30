FROM node:12-buster AS build

RUN mkdir /app
COPY . /app
WORKDIR /app

RUN yarn install
RUN yarn workspace example-app build

# Contruct backstage-frontend image
FROM nginx:mainline

RUN apt-get update && apt-get -y install jq && rm -rf /var/lib/apt/lists/*

# Copy from build stage
COPY --from=build /app/packages/app/dist /usr/share/nginx/html

COPY docker/default.conf.template /etc/nginx/conf.d/default.conf.template
COPY docker/run.sh /usr/local/bin/run.sh

CMD run.sh

ENV PORT 80
