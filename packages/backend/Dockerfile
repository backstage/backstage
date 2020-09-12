FROM node:12

WORKDIR /usr/src/app

# Copy repo skeleton first, to avoid unnecessary docker cache invalidation.
# The skeleton contains the package.json of each package in the monorepo,
# and along with yarn.lock and the root package.json, that's enough to run yarn install.
ADD yarn.lock package.json skeleton.tar ./

RUN apt update && apt install -y git build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libsqlite3-dev libreadline-dev libffi-dev curl libbz2-dev curl

RUN curl -O https://www.python.org/ftp/python/3.8.2/Python-3.8.2.tar.xz

RUN tar -xf Python-3.8.2.tar.xz

RUN cd Python-3.8.2

RUN ./configure --enable-optimizations

RUN make -j 4

RUN make altinstall

RUN apt install -y mkdocs 

RUN pip3.8 install mkdocs-techdocs-core

RUN pip install cookiecutter && \
    apt remove -y g++ python-pip python-dev && \
    rm -rf /var/cache/apt/*

RUN yarn install --frozen-lockfile --production

# This will copy the contents of the dist-workspace when running the build-image command.
# Do not use this Dockerfile outside of that command, as it will copy in the source code instead.
COPY . .

CMD ["node", "packages/backend"]
