ARG IMAGE_TAG=14-alpine

FROM node:${IMAGE_TAG}

ARG APK_VIRTUAL_NAME=.backstage

# update package sources
# `--virtual` is used to enable removal of these dependencies as a named group
# python: required by node-gyp
# pixman: required by node-canvas
# pkgconfig: required by pixman
# ... the below are: required by node-canvas
# see: https://github.com/Automattic/node-canvas/wiki/Installation%3A-Ubuntu-and-other-Debian-based-systems
# alpine-sdk (~build-essential for Debian)
# cairo-dev (~libcairo2-dev for Debian)
# pango-dev (~libpango1.0-dev for Debian)
# jpeg-dev (~libjpeg-dev for Debian)
# giflib-dev (~libgif-dev for Debian)
# librsvg-dev (~librsvg2-dev for Debian)
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
    librsvg-dev
