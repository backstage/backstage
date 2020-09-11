FROM node:12

WORKDIR /usr/src/app

# Copy repo skeleton first, to avoid unnecessary docker cache invalidation.
# The skeleton contains the package.json of each package in the monorepo,
# and along with yarn.lock and the root package.json, that's enough to run yarn install.
ADD yarn.lock package.json skeleton.tar ./

RUN apt update && apt install -y git python python-dev python-pip g++

RUN apt install -y openjdk-8-jdk graphviz ttf-dejavu fontconfig

RUN curl -L http://sourceforge.net/projects/plantuml/files/plantuml.1.2020.16.jar/download > /opt/plantuml.jar
RUN pip install --upgrade pip && pip install mkdocs-techdocs-core==0.0.4

# Create script to call plantuml.jar from a location in path

RUN echo $'#!/bin/sh\n\njava -jar '/opt/plantuml.jar' ${@}' >> /usr/local/bin/plantuml
RUN chmod 755 /usr/local/bin/plantuml

RUN pip install cookiecutter && \
    apt remove -y g++ python-pip python-dev && \
    rm -rf /var/cache/apt/*

RUN yarn install --frozen-lockfile --production

# This will copy the contents of the dist-workspace when running the build-image command.
# Do not use this Dockerfile outside of that command, as it will copy in the source code instead.
COPY . .

CMD ["node", "packages/backend"]
