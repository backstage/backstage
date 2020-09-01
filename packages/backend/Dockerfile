FROM node:12

WORKDIR /usr/src/app

# This will copy the contents of the dist-workspace when running the build-image command.
# Do not use this Dockerfile outside of that command, as it will copy in the source code instead.
COPY . .

RUN apt update && apt install -y git python python-dev python-pip g++

RUN pip install cookiecutter && \
    apt remove -y g++ python-pip python-dev && \
    rm -rf /var/cache/apt/*

RUN yarn install --frozen-lockfile --production

CMD ["node", "packages/backend"]
