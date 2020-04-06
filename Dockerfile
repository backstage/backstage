FROM nginx:mainline

COPY packages/app/build /usr/share/nginx/html
COPY docker/default.conf.template /etc/nginx/conf.d/default.conf.template
COPY docker/run.sh /usr/local/bin/run.sh
CMD run.sh

ENV PORT 80
