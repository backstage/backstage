FROM node:12

WORKDIR /usr/src/app

# This will copy the contents of the dist-workspace when running the build-image command.
# Do not use this Dockerfile outside of that command, as it will copy in the source code instead.
COPY . .

RUN yarn install --frozen-lockfile --production

CMD ["node", "packages/backend"]
