#! /usr/bin/env bash

# Exit in case of error
set -e

docker-compose run backend pytest  --asyncio-mode=auto -p no:cacheprovider
docker-compose run frontend npm run test:all