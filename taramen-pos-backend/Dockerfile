# --- Build stage: install PHP deps with Composer ---
FROM composer:2 AS vendor

WORKDIR /app
COPY composer.json composer.lock ./
FROM php:8.2-fpm-bullseye

# System deps + nginx + supervisor + pgsql extensions
RUN apt-get update && apt-get install -y \
    nginx supervisor git unzip libpq-dev \
  && docker-php-ext-install pdo_pgsql pgsql \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Copy app
COPY . .

# Copy vendor from build stage
COPY --from=vendor /app/vendor ./vendor

# Nginx + Supervisor + start script
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

# Ensure Laravel folders are writable
RUN chown -R www-data:www-data storage bootstrap/cache

# Render provides $PORT; we'll make nginx listen on it via envsubst in start.sh
ENV PORT=10000

CMD ["/start.sh"]
