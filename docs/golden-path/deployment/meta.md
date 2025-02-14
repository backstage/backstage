<!-- THIS FILE IS NOT INTENDED TO BE DISPLAYED ON THE DOCSITE -->

# Glossary

- Page: A single `md` file.
- Guide: A number of pages grouped under the same folder.

# Overall Writing Guidelines

The goal of these docs is to provide a comprehensive set of guides that developers + admins can use to quickly get a Backstage instance into production and can refer to over time as their instance gain maturity.

A user that finishes all of these guides will feel comfortable running a Backstage deployment in production. That will include building the Docker image, monitoring the deployment, and keeping Backstage updated.

At the same time, not all users will finish the docs or they may come back to them as required. Individual guides should have strong "abstracts" (what will I learn by reading this guide), table of contents, and "next steps" (what do I need to do next) to guide users to read the most important pieces for their work.

When writing guide pages, keep it light! These should be instructional docs, and at the same time conversational and a joy to read. Guides should build on each other, when reading through a progression, the reader should feel more comfortable and confident with concepts as they pop up across progression levels. Guides should be standalone but can link across.

# Sections

Users are expected to already have created a Backstage application, but we have no expectations that they've customized anything.

## Prerequisites

The user should already have created a Backstage application (`create-app`) and pushed their code to an origin in a source control management system (Github, Gitlab, etc). They should have a handle on how their company builds and deploys code.

## Deploying Backstage

Backstage should be deployed in the same way as other software at your company. Show common examples that may be useful when deploying Backstage for the first time, or for those without established deployment practices.

## Docker

### What's in the docker image?

Talk through the build process for the backend image and how we layer both the frontend and backend into the image.

### Running in CI

While you can run this build locally, we generally expect that you will run this as part of your CI build. Show the command that is needed and some context on what it does.

## Pre-deploy dependencies

### Database

SQLite is the default database for Backstage development, it's a fast in-memory database that can handle the day-to-day needs of developers. It doesn't work well for production use cases though - you generally want a dedicated database.

Use this section to walk through database options, talk through why Postgres is generally the best option and what config is needed to connect to common providers.

### Authentication

By default, Backstage lets users login through a guest user. While that's a good fit for a solid developer experience locally, it can open up security holes when it's deployed to production. For that reason, you should configure a different authentication provider. See the docs at `auth/*`. A solid choice is Github authentication - your target audience with a developer portal should already have access to Github.

## Deployment Guides

### ECS

### K8s

### Other

See `contrib/` section in the repo.

## Config-first Development

Making configuration the primary way to impact application behavior simplifies the deploy process and makes managing your Backstage instance much easier.

## Monitoring

### OpenTelemetry

Backstage provides a set of OpenTelemetry metrics by default. This guide will walk you through how to set those up, what to monitor for, and what good alarms look like.

### Frontend Analytics

Backstage also provides a frontend analytics API that can integrate with various vendors like Google Analytics for tracking user behavior on the frontend.

For frontend error reporting, you should consider integrating with something like CloudWatch RUM, Sentry or Cloudflare RUM.

## How to handle scale as usage grows

Talk about horizontal scaling, either by just increasing pod count or targeting specific expensive plugins and moving those to their own deployments.

### Separate frontend and backend

By default, the frontend is served from your deployment using the `@backstage/plugin-app-backend` plugin. If you need to split out the frontend and deploy it to a CDN, this section would show you how to do that.
