FROM nginx:mainline

# This dockerfile requires the app to be built on the host first, as it
# simply copies in the build output into the image.

# The safest way to build this image is to use `yarn docker-build`

COPY packages/app/build /usr/share/nginx/html
COPY docker/default.conf.template /etc/nginx/conf.d/default.conf.template
COPY docker/run.sh /usr/local/bin/run.sh
CMD run.sh

ENV PORT 80
