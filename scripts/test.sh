#! /usr/bin/env bash

__dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Exit in case of error
set -e

source ${__dir}/test_backend.sh

docker-compose run frontend npm run test:all