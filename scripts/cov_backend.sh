#! /usr/bin/env bash

DATABASE_URI="postgresql+asyncpg://postgres:password@localhost:5432/postgres" pytest  --cov=backend --cov-branch --cov-report term-missing -p no:cacheprovider --asyncio-mode=auto