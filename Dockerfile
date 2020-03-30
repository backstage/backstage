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

# Run nginx as root
RUN sed -i 's/user  nginx.*$//' /etc/nginx/nginx.conf

COPY docker/default.conf.template /etc/nginx/conf.d/default.conf.template
CMD /bin/bash -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'

ENV PORT 80
