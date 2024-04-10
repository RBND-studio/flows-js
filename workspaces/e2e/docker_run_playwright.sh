#!/bin/bash

# Run this script to start docker container and run all playwright tests

docker run --rm --ipc=host \
  --mount type=bind,src=./../../,dst=/app \
  --mount type=volume,dst=/app/node_modules \
  --mount type=volume,dst=/app/.pnpm-store \
  mcr.microsoft.com/playwright:v1.43.0-jammy \
  /app/workspaces/e2e/docker_playwright_script.sh