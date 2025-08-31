#!/bin/bash

# Deployment script for Google Cloud App Engine
# Usage: ./deploy.sh [project-id]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting deployment to Google Cloud App Engine${NC}"

# Check if project ID is provided
if [ $# -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Please provide your Google Cloud Project ID${NC}"
    echo -e "${YELLOW}Usage: ./deploy.sh your-project-id${NC}"
    exit 1
fi

PROJECT_ID=$1

echo -e "${BLUE}📦 Project ID: ${PROJECT_ID}${NC}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed. Please install it first.${NC}"
    echo -e "${YELLOW}Visit: https://cloud.google.com/sdk/docs/install${NC}"
    exit 1
fi

# Set the project
echo -e "${BLUE}🔧 Setting up Google Cloud project...${NC}"
gcloud config set project $PROJECT_ID

# Enable necessary APIs
echo -e "${BLUE}🔌 Enabling required APIs...${NC}"
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Install dependencies
echo -e "${BLUE}📚 Installing dependencies...${NC}"
npm install

# Build the application
echo -e "${BLUE}🔨 Building the application...${NC}"
npm run build

# Deploy to App Engine
echo -e "${BLUE}🚀 Deploying to App Engine...${NC}"
gcloud app deploy --quiet

# Get the deployed URL
APP_URL=$(gcloud app describe --format="value(defaultHostname)")
echo -e "${GREEN}✅ Deployment successful!${NC}"
echo -e "${GREEN}🌐 Your app is available at: https://${APP_URL}${NC}"

echo -e "${BLUE}📊 To view logs: gcloud app logs tail -s default${NC}"
echo -e "${BLUE}📈 To open in browser: gcloud app browse${NC}"