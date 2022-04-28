---
'@backstage/create-app': patch
---

Added some instruction comments to the generated config files, to clarify the
usage of `backend.baseUrl` and `backend.listen.host`. Importantly, it also per
default now listens on all IPv4 interfaces, to make it easier to take the step
over to production. If you want to do the same, update your
`app-config.production.yaml` as follows:

```diff
 backend:
   listen:
     port: 7007
+    host: 0.0.0.0
```

Also, updated the builtin backend Dockerfile to honor the
`app-config.production.yaml` file. If you want to do the same, change
`packages/backend/Dockerfile` as follows:

```diff
-COPY packages/backend/dist/bundle.tar.gz app-config.yaml ./
+COPY packages/backend/dist/bundle.tar.gz app-config*.yaml ./
 RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

-CMD ["node", "packages/backend", "--config", "app-config.yaml"]
+CMD ["node", "packages/backend", "--config", "app-config.yaml", "--config", "app-config.production.yaml"]
```

If you look carefully, this adds a glob match on app-config files. For those
that try out the build flows locally, you also want to make sure that the docker
daemon does NOT pick up any local/private config files that might contain
secrets. You should therefore also update your local `.dockerignore` file at the
same time:

```diff
+*.local.yaml
```
