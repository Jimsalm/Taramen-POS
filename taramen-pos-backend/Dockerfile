# --- Build stage: PHP CLI + Composer + extensions ---
FROM php:8.2-cli-bullseye AS vendor

RUN apt-get update && apt-get install -y git unzip libpq-dev \
  && docker-php-ext-install pdo_pgsql pgsql \
  && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# 1) Copy only composer files first (enables caching of composer install)
COPY composer.json composer.lock ./

RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# 2) Now copy the rest of the app
COPY . .

# --- Runtime stage: PHP-FPM + Nginx + Supervisor ---
FROM php:8.2-fpm-bullseye

RUN apt-get update && apt-get install -y \
    nginx supervisor git unzip libpq-dev \
  && docker-php-ext-install pdo_pgsql pgsql \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Copy app source
COPY . .

# Copy vendor from build stage
COPY --from=vendor /app/vendor ./vendor

COPY docker/nginx.conf.template /var/www/html/docker/nginx.conf.template
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

RUN chown -R www-data:www-data storage bootstrap/cache

ENV PORT=10000
CMD ["/start.sh"]
