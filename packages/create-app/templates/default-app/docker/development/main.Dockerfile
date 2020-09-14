FROM node:12-buster-slim

ARG TARGETPLATFORM="${TARGETPLATFORM:-linux/amd64}"
ARG TARGETOS="${TARGETOS:-linux}"
ARG TARGETARCH="${TARGETARCH:-amd64}"

RUN apt-get update && \
  apt-get -y install libkrb5-3 libgssapi-krb5-2 libk5crypto3 git && \
  rm -rf /var/lib/apt/lists/*
