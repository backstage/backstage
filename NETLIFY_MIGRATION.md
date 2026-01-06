# Netlify Migration Guide

This document outlines the steps to complete the migration from GitHub Pages to Netlify for hosting the Backstage documentation site.

## What Changed

1. **Created `netlify.toml`**: Configuration file for Netlify builds at the repository root
2. **Updated `.github/workflows/deploy_microsite.yml`**: Changed deployment target from GitHub Pages to Netlify

## Setup Steps

### 1. Create a Netlify Site

1. Log in to [Netlify](https://app.netlify.com/)
2. Click "Add new site" > "Import an existing project"
3. Connect to your GitHub repository
4. **Important**: In the build settings, choose "Skip build and deploy" or configure it to use the GitHub Actions workflow
   - The build is handled by GitHub Actions, not Netlify's build system
   - This gives you more control and keeps the complex multi-stage build process

### 2. Get Netlify Credentials

After creating the site, you'll need two values:

1. **Site ID**:

   - Go to Site settings > General > Site details
   - Copy the "Site ID" (looks like `abc123-def456-ghi789`)

2. **Auth Token**:
   - Go to User settings (click your avatar) > Applications
   - Scroll to "Personal access tokens"
   - Click "New access token"
   - Give it a name (e.g., "GitHub Actions Deploy")
   - Copy the token (it starts with `nfp_`)

### 3. Add Secrets to GitHub

Add these secrets to your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret" and add:
   - **Name**: `NETLIFY_AUTH_TOKEN`
   - **Value**: Your Netlify personal access token (from step 2)
4. Add another secret:
   - **Name**: `NETLIFY_SITE_ID`
   - **Value**: Your Netlify site ID (from step 2)

### 4. Configure Custom Domain (Optional)

If you want to use `backstage.io`:

1. In Netlify, go to Site settings > Domain management
2. Click "Add custom domain"
3. Enter `backstage.io`
4. Follow Netlify's instructions to update your DNS records
5. Enable HTTPS (Netlify provides free SSL certificates via Let's Encrypt)

### 5. Test the Deployment

1. Push a commit to the `master` branch
2. Watch the GitHub Actions workflow run
3. Once complete, the site should be deployed to Netlify
4. Check the Netlify dashboard to see the deployment

## How It Works

The deployment process:

1. **GitHub Actions builds the site** (multi-stage process):

   - Builds API docs from the latest release tag (stable version)
   - Builds API docs from master (next version)
   - Combines everything including Storybook

2. **GitHub Actions deploys to Netlify**:
   - Uses the `nwtgck/actions-netlify` action
   - Deploys the `microsite/build` directory
   - Production deploys only happen on `master` branch
   - Preview deploys are created for pull requests

## Features

- **Pull Request Previews**: Each PR gets a unique preview URL
- **Deploy Messages**: Commit messages appear in Netlify dashboard
- **Branch Deploys**: Only `master` deploys to production
- **Security Headers**: Configured in `netlify.toml`
- **Static Asset Caching**: Optimized cache headers for JS/CSS

## Rollback Plan

If you need to rollback to GitHub Pages:

1. Revert the changes to `.github/workflows/deploy_microsite.yml`
2. The old GitHub Pages deployment will resume on the next push to `master`
3. Delete or keep `netlify.toml` (it won't interfere with GitHub Pages)

## Notes

- The `netlify.toml` file exists but is primarily for documentation and local testing
- The actual build happens in GitHub Actions, not on Netlify's servers
- This approach keeps your complex build logic in version control
- You can still use Netlify's features like custom headers, redirects, and forms

## Cleanup (Optional)

After verifying the Netlify deployment works:

1. You can disable GitHub Pages in the repository settings
2. You may want to keep the `gh-pages` branch for a while as a backup
3. Delete the branch after you're confident: `git push origin --delete gh-pages`
