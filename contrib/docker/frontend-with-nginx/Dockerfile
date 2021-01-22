FROM nginx:mainline

# The purpose of this image is to serve the frontend app content separately.
# By default the Backstage backend uses the app-backend plugin to serve the
# app from the backend itself, but it may be desirable to move the frontend
# content serving to a separate deployment, in which case this image can be used.

# This dockerfile requires the app to be built on the host first, as it
# simply copies in the build output into the image.

RUN apt-get update && apt-get -y install jq && rm -rf /var/lib/apt/lists/*

COPY packages/app/dist /usr/share/nginx/html
COPY docker/default.conf.template /etc/nginx/conf.d/default.conf.template
COPY docker/run.sh /usr/local/bin/run.sh
CMD run.sh

ENV PORT 80
