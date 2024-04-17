#!/bin/bash

# This script is run inside the docker container to run all playwright tests

cd app
npm i -g pnpm@9
pnpm i
pnpm e2e playwright