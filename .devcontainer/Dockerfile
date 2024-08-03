
# Use the official Node.js image.
FROM node:18-bullseye

# Install dependencies for building
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    make \
    build-essential \
    docker.io \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Yarn
RUN npm install -g yarn

# Create a directory for the app
WORKDIR /workspace

# Copy the current working directory contents into the container
COPY . /workspace

# Set the default command to yarn dev
CMD ["yarn", "dev"]
