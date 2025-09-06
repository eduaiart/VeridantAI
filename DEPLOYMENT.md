# Google Cloud Deployment Guide

This guide will help you deploy your VeridantAI website to Google Cloud Platform using App Engine.

## Prerequisites

1. **Google Cloud Platform Account**: Create an account at [cloud.google.com](https://cloud.google.com)
2. **Google Cloud CLI**: Install the gcloud CLI from [cloud.google.com/sdk](https://cloud.google.com/sdk)
3. **Node.js**: Ensure you have Node.js 20+ installed

## Quick Deployment

### Option 1: Using the Deployment Script (Recommended)

```bash
# Make the script executable (if not already)
chmod +x deploy.sh

# Deploy to your Google Cloud project
./deploy.sh your-project-id
```

### Option 2: Manual Deployment

1. **Set up your Google Cloud project:**
   ```bash
   gcloud config set project your-project-id
   gcloud services enable appengine.googleapis.com
   ```

2. **Install dependencies and build:**
   ```bash
   npm install
   npm run build
   ```

3. **Deploy to App Engine:**
   ```bash
   gcloud app deploy
   ```

## Environment Variables

Before deploying, you'll need to set up these environment variables in Google Cloud:

- `DATABASE_URL`: Your production database connection string
- `SESSION_SECRET`: A secure random string for session management

### Setting Environment Variables

You can set environment variables directly in the `app.yaml` file or use Google Cloud Secret Manager for sensitive data:

```bash
# Using Secret Manager (recommended for sensitive data)
echo -n "your-database-url" | gcloud secrets create database-url --data-file=-
echo -n "your-session-secret" | gcloud secrets create session-secret --data-file=-
```

## Deployment Files

- **`app.yaml`**: App Engine configuration
- **`.gcloudignore`**: Files to exclude from deployment
- **`cloudbuild.yaml`**: Automated build configuration
- **`deploy.sh`**: Deployment script

## Post-Deployment

After successful deployment:

1. **View your live site**: `gcloud app browse`
2. **Check logs**: `gcloud app logs tail -s default`
3. **Monitor performance**: Visit the Google Cloud Console

## Troubleshooting

### Common Issues

1. **Build failures**: Ensure all dependencies are in `dependencies`, not `devDependencies`
2. **Database connection**: Verify your DATABASE_URL is correct for production
3. **Memory issues**: Increase memory in `app.yaml` if needed

### Useful Commands

```bash
# View deployment status
gcloud app versions list

# Roll back to previous version
gcloud app versions migrate PREVIOUS_VERSION

# Delete old versions
gcloud app versions delete VERSION_ID
```

## Cost Optimization

- App Engine automatically scales based on traffic
- Consider setting max instances in `app.yaml` to control costs
- Use the free tier for development/testing

## Support

For additional help:
- [Google Cloud App Engine Documentation](https://cloud.google.com/appengine/docs)
- [Google Cloud Support](https://cloud.google.com/support)