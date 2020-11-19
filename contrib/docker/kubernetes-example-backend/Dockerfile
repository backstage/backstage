FROM node:12-buster

WORKDIR /usr/src/app

# (workaround) Install cookiecutter and mkdocs to avoid the need to run docker in docker
RUN cd /tmp && curl -O https://www.python.org/ftp/python/3.8.2/Python-3.8.2.tar.xz && \
    tar -xvf Python-3.8.2.tar.xz && \
    cd Python-3.8.2 && \
    ./configure --enable-optimizations && \
    make -j 4 && \
    make altinstall

RUN apt update
RUN apt install -y mkdocs

RUN pip3.8 install mkdocs-techdocs-core

RUN pip3.8 install cookiecutter && \
    apt remove -y build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libsqlite3-dev libreadline-dev libffi-dev libbz2-dev g++ python-pip python-dev && \
    rm -rf /var/cache/apt/* /tmp/Python-3.8.2

# Copy repo skeleton first, to avoid unnecessary docker cache invalidation.
# The skeleton contains the package.json of each package in the monorepo,
# and along with yarn.lock and the root package.json, that's enough to run yarn install.
ADD yarn.lock package.json skeleton.tar ./

RUN yarn install --frozen-lockfile --production

# This will copy the contents of the dist-workspace when running the build-image command.
# Do not use this Dockerfile outside of that command, as it will copy in the source code instead.
COPY . .

CMD ["node", "packages/backend", "--config", "app-config.yaml", "--config", "app-config.development.yaml"]
