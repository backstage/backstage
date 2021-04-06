ARG IMAGE_TAG=14-alpine

FROM node:${IMAGE_TAG}

ARG APK_VIRTUAL_NAME=.backstage
ARG VALE_INSTALL_URL="https://github.com/errata-ai/vale/releases/download/v2.10.2/vale_2.10.2_Linux_64-bit.tar.gz"

WORKDIR /tmp

# update package sources
# `--virtual` is used to enable removal of these dependencies as a named group
# - python: required by node-gyp
# - pixman: required by node-canvas
# - pkgconfig: required by pixman
# --------------------------------------------
# ... the below are: required by node-canvas
# see: https://github.com/Automattic/node-canvas/wiki/Installation%3A-Ubuntu-and-other-Debian-based-systems
# - alpine-sdk (~build-essential for Debian)
# - cairo-dev (~libcairo2-dev for Debian)
# - pango-dev (~libpango1.0-dev for Debian)
# - jpeg-dev (~libjpeg-dev for Debian)
# - giflib-dev (~libgif-dev for Debian)
# - librsvg-dev (~librsvg2-dev for Debian)
# --------------------------------------------
# - libsecret: required by pkg-config during `yarn run lint:docs`
# --------------------------------------------
# ... the below are: required by vale
# https://github.com/errata-ai/vale/blob/2fe466e41f1b371bfac7334c2a4643cd577c0668/Dockerfile#L13
# - py3-docutils
# - asciidoctor
# --------------------------------------------
RUN apk update \
  && apk add --no-cache \
    --virtual ${APK_VIRTUAL_NAME} \
    python \
    pixman \
    pkgconfig \
    alpine-sdk \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev \
    libsecret-dev \
    py3-docutils \
    asciidoctor

# assumes that "./vale" is in the downloaded archive
# extracts "./vale" and moves it to "/bin" as executable
RUN wget -qO- ${VALE_INSTALL_URL} \
    | tar xvz -C /bin vale \
    && chmod +x /bin/vale

RUN mkdir /app

WORKDIR /app
