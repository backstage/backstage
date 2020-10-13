---
id: deployment-other
title: Other
description: Documentation on different ways of Deployment
---

## Deploying Locally

### Try on Docker

Run the following commands if you have Docker environment

```bash
$ yarn install
$ yarn docker-build
$ docker run --rm -it -p 7000:7000 -e APP_ENV=production -e NODE_ENV=development example-backend:latest
```

Then open http://localhost/ on your browser.
