#!/usr/bin/env bash
set -e

PROJECT_ID="${1:-$(gcloud config get-value project 2>/dev/null)}"
REGION="${2:-us-central1}"
SERVICE_NAME="${3:-aistudio-api}"

echo "=========================================="
echo "   AI Studio - Google Cloud Run Deploy    "
echo "=========================================="

if [ -z "$PROJECT_ID" ]; then
  read -p "Enter your Google Cloud Project ID: " PROJECT_ID
fi

if [ -z "$PROJECT_ID" ]; then
  echo "Error: Project ID is required."
  exit 1
fi

gcloud config set project "$PROJECT_ID"

echo -e "\n[1/3] Enabling required Google Cloud APIs..."
gcloud services enable run.googleapis.com aiplatform.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com

echo -e "\n[2/3] Building container and deploying to Cloud Run ($REGION)..."
cd "$(dirname "$0")/services/api"

gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --region "$REGION" \
  --allow-unauthenticated \
  --set-env-vars ENVIRONMENT=production,VERTEX_AI=True,GOOGLE_CLOUD_PROJECT="$PROJECT_ID",GOOGLE_CLOUD_REGION="$REGION"

SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --platform managed --region "$REGION" --format 'value(status.url)' 2>/dev/null)

echo -e "\n=========================================="
echo "   DEPLOYMENT SUCCESSFUL!                 "
echo "=========================================="
echo "Live API Endpoint: $SERVICE_URL"
echo "Health Check:      $SERVICE_URL/health"
echo -e "\nNext Step: Set NEXT_PUBLIC_API_URL=$SERVICE_URL in your Next.js frontend."
