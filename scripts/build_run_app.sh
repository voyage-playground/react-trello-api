#!/bin/bash

APP_ENV="${APP_ENV:-development}"

cd /app

DB_HOSTNAME=$([ -n "$DB_HOST" ] && echo "tcp://$DB_HOST:27017" || echo "tcp://127.0.0.1:27017")

echo "🚀 Wait for DB to start"
dockerize -wait $DB_HOSTNAME -timeout 60s

if [ "$APP_ENV" == "local" ]; then
  npm start
else
  node index.js
fi
