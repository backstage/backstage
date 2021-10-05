# build the application
yarn install
yarn tsc
yarn build

# build the container image
# ** Do we want to map local code repo as volume in container? **
docker build -t bih/bih-backend . -f packages/backend/Dockerfile-local --no-cache

# build docker env and bring online
docker-compose build
docker-compose up