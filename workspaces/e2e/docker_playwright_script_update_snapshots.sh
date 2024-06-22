#!/bin/bash

# This script is run inside the docker container to run all playwright tests

cd app
corepack enable
pnpm install --frozen-lockfile
pnpm e2e playwright --update-snapshots