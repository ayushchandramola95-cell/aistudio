# syntax=docker/dockerfile:1
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080 \
    PYTHONPATH=/app

WORKDIR /app

# Install system dependencies (build-essential, libpq-dev for postgres if needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy and install python dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt

# Copy application source code
COPY . /app/services/api

# Create directory for storage
RUN mkdir -p /app/services/api/storage/outputs

# Expose standard Cloud Run port
EXPOSE 8080

# Cloud Run injects $PORT environment variable (defaults to 8080)
CMD exec python -m uvicorn services.api.src.main:app --host 0.0.0.0 --port ${PORT:-8080}
