# Use an official Node.js runtime as our base image
FROM node:14-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy the Backstage app code into the container
COPY . .

# Install dependencies specified in package.json
RUN yarn install --frozen-lockfile

# Make port 3000 available from the host machine (if not already available)
EXPOSE 3000

# Run the command to start the Backstage app
CMD ["npx", "@backstage/create-app@latest"]
