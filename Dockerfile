FROM node:12 as builder
WORKDIR /app

COPY package.json yarn.lock .yarnrc .npmrc /app/
COPY .yarn /app/.yarn
COPY packages /app/packages
COPY plugins /app/plugins

RUN yarn

COPY lerna.json tsconfig.json .eslintignore .eslintrc.js /app/
COPY scripts/ /app/scripts

RUN yarn build

FROM nginx:mainline

COPY --from=builder /app/packages/app/build /usr/share/nginx/html

COPY docker/default.conf.template /etc/nginx/conf.d/default.conf.template
COPY docker/run.sh /usr/local/bin/run.sh
CMD run.sh

ENV PORT 80
