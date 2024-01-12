#!/bin/bash

# This script is run inside the docker container to run all playwright tests

cd app
npm i -g pnpm
pnpm i
pnpm run playwright