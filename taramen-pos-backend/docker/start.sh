#!/usr/bin/env bash
set -e

: "${PORT:=10000}"

# generate nginx.conf from template
sed "s/__PORT__/${PORT}/g" /var/www/html/docker/nginx.conf.template > /etc/nginx/nginx.conf

# Make sure Laravel sees Render env vars
php artisan config:clear

# Optional but good for performance
php artisan config:cache

echo "DB_HOST=$DB_HOST"
echo "DB_DATABASE=$DB_DATABASE"
echo "DATABASE_URL=$DATABASE_URL"

# Run migrations once
php artisan migrate --force

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
