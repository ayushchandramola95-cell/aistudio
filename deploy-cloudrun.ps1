# PowerShell Script to Deploy AI Studio Backend to Google Cloud Run
param(
    [string]$ProjectId = "",
    [string]$Region = "us-central1",
    [string]$ServiceName = "aistudio-api"
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   AI Studio - Google Cloud Run Deploy    " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Check if gcloud CLI is installed
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "[Error] Google Cloud SDK ('gcloud') is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Download it here: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# 2. Get or prompt for GCP Project ID
if ([string]::IsNullOrWhiteSpace($ProjectId)) {
    $currentProject = (gcloud config get-value project 2>$null)
    if (-not [string]::IsNullOrWhiteSpace($currentProject)) {
        $ProjectId = $currentProject
        Write-Host "[Info] Using current configured project: $ProjectId" -ForegroundColor Green
    } else {
        $ProjectId = Read-Host "Enter your Google Cloud Project ID"
    }
}

if ([string]::IsNullOrWhiteSpace($ProjectId)) {
    Write-Host "[Error] Project ID is required to deploy." -ForegroundColor Red
    exit 1
}

# Set project
gcloud config set project $ProjectId

# 3. Enable required GCP Services
Write-Host "`n[1/3] Enabling required Google Cloud APIs (Cloud Run, Vertex AI, Artifact Registry)..." -ForegroundColor Yellow
gcloud services enable run.googleapis.com aiplatform.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com

# 4. Deploy FastAPI Backend to Cloud Run
Write-Host "`n[2/3] Building container and deploying to Cloud Run in region '$Region'..." -ForegroundColor Yellow

Set-Location "$PSScriptRoot\services\api"

gcloud run deploy $ServiceName `
    --source . `
    --region $Region `
    --allow-unauthenticated `
    --set-env-vars ENVIRONMENT=production,VERTEX_AI=True,GOOGLE_CLOUD_PROJECT=$ProjectId,GOOGLE_CLOUD_REGION=$Region

# 5. Output Service URL
$serviceUrl = (gcloud run services describe $ServiceName --platform managed --region $Region --format 'value(status.url)' 2>$null)

Write-Host "`n==========================================" -ForegroundColor Green
Write-Host "   DEPLOYMENT SUCCESSFUL!                 " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Live API Endpoint: $serviceUrl" -ForegroundColor Cyan
Write-Host "Health Check:      $serviceUrl/health" -ForegroundColor Cyan
Write-Host "`nNext Step: Set NEXT_PUBLIC_API_URL=$serviceUrl in your Next.js frontend." -ForegroundColor Yellow

