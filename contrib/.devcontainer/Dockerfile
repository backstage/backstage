FROM mcr.microsoft.com/devcontainers/typescript-node:20@sha256:381a1fde32704f229b439ade94816d5619f710e35698982ec35afcd9384ae6cf

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install chromium \
    && apt-get -y install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
