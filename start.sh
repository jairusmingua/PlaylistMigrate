#!/bin/bash
set -e

npx prisma migrate deploy
npm run start
