FROM mcr.microsoft.com/devcontainers/typescript-node:20@sha256:185cde4e033cd68fb4c5c9eef94ba6bde0dac2f334ecd1a7cf6cd2c87f712d85

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install chromium \
    && apt-get -y install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
