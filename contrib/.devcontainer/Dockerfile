FROM mcr.microsoft.com/devcontainers/typescript-node:18

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install chromium \
    && apt-get -y install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
