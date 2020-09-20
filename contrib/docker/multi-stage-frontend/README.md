# Standalone Dockerfile for frontend

This directory contains the resources which will help you build backstage without any requirements
other than docker itself. It uses a multi-stage Dockerfile to build and ship backstage.

## Usage

You can simply run the following command to build backstage.

```
# Make sure you are in the root directory of backstage then run
docker build -t backstage-frontend -f ./contrib/docker/multi-stage-frontend/Dockerfile .
```

After a successful build, You can simply run backstage frontend with the following command.

```
docker run -it --rm -p 3080:80 backstage-frontend
```
