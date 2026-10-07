FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies needed for OpenCV, PostgreSQL, and compilation
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libpq-dev \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . /app/

# Expose port
EXPOSE 8000

# Entrypoint script: run migrations, seed data if needed, start gunicorn
CMD ["sh", "-c", "python manage.py migrate && python manage.py seed_data && gunicorn healthfeast.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 120"]
