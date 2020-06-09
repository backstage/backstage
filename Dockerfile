FROM nginx:mainline

# This dockerfile requires the app to be built on the host first, as it
# simply copies in the build output into the image.

# The safest way to build this image is to use `yarn docker-build`

RUN apt-get update && apt-get -y install jq && rm -rf /var/lib/apt/lists/*

COPY packages/app/dist /usr/share/nginx/html
COPY docker/default.conf.template /etc/nginx/conf.d/default.conf.template
COPY docker/run.sh /usr/local/bin/run.sh
CMD run.sh

ENV PORT 80
