yarn install
yarn tsc
yarn build
docker build -t bih/bih-backend . -f packages/backend/Dockerfile-local --no-cache
docker-compose build
docker-compose up