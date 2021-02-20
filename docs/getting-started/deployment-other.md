---
id: deployment-other
title: Other
description: Documentation on different ways of Deployment
---

## Heroku

Deploying to Heroku is relatively easy following these steps.

First, make sure you have the
[Heroku CLI installed](https://devcenter.heroku.com/articles/heroku-cli) and log
into it as well as login into Heroku's
[container registry](https://devcenter.heroku.com/articles/container-registry-and-runtime).

```bash
$ heroku login
$ heroku container:login
```

You _might_ also need to set your Heroku app's stack to `container`.

```bash
$ heroku stack:set container -a <your-app>
```

We can now build/push the Docker image to Heroku's container registry and
release it to the `web` worker.

```bash
$ heroku container:push web -a <your-app>
$ heroku container:release web -a <your-app>
```

With that, you should have Backstage up and running!

## AWS Fargate and Aurora

There are any number of ways to deploy backstage containers on AWS. 
One of the simplest from a management and ops perspective is to leverage ECS Fargate and Aurora Postgresql, where both the container orchestration and database clusters are aws managed services.

However, to use them properly, there are a large number of supporting resources (like VPCs, Security Groups, Load Balancers, Certificate, etc) required. We used [AWS Cloud Development Kit (CDk)](https://aws.amazon.com/cdk/) to simplify and automate the creation of the entire infrastructure stack along with automating the build and deploy of the container. 

This repo: [backstage on aws](https://github.com/rbogle/backstage-on-aws), is a ready to use CDK application for deploying your custom Backstage app onto AWS ECS Fargate and Aurora. 
