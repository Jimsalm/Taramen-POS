#!/usr/bin/env bash
set -e

# Render sets PORT; ensure it's present
: "${PORT:=10000}"

# Render nginx.conf uses ${PORT}; substitute it at runtime
# (envsubst is in gettext-base; bullseye image may not include it by default)
# We'll do a simple sed replacement instead:
sed -i "s/\${PORT}/$PORT/g" /etc/nginx/nginx.conf

# Laravel optimizations (safe)
php artisan config:clear || true
php artisan cache:clear || true

# IMPORTANT: do NOT route:cache if your routes include closures that aren't cacheable.
# php artisan route:cache || true

# Run migrations on deploy/start (ok for a personal project; for teams you’d gate this)
php artisan migrate --force

# Start processes
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
