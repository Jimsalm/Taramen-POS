#!/usr/bin/env bash
set -e

: "${PORT:=10000}"
sed "s/__PORT__/${PORT}/g" /var/www/html/docker/nginx.conf.template > /etc/nginx/nginx.conf

php artisan config:clear
php artisan config:cache

php artisan migrate --force

# Seed only if empty
php -r "
require 'vendor/autoload.php';
\$app = require 'bootstrap/app.php';
\$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
exit(\App\Models\User::query()->exists() ? 0 : 1);
" || php artisan db:seed --force

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
