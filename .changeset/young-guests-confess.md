---
'@backstage/create-app': patch
---

To reflect the updated `knex` and `@vscode/sqlite3` dependencies introduced with [v0.4.19](https://github.com/backstage/backstage/blob/master/packages/create-app/CHANGELOG.md#0419), we update our example `Dockerfile`, adding `@vscode/sqlite3` build dependencies to the image. Further on, we updated it to the `node:16-bullseye-slim` base image.

To apply this update to an existing app, make the following change to `packages/backend/Dockerfile`:

```diff
-FROM node:14-buster-slim
+FROM node:16-bullseye-slim
```

and, _only if you are using sqlite3 in your app_:

```diff
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz
+
+# install sqlite3 dependencies
+RUN apt-get update && \
+   apt-get install -y libsqlite3-dev python3 cmake g++ && \
+   rm -rf /var/lib/apt/lists/* && \
+   yarn config set python /usr/bin/python3

RUN yarn install --frozen-lockfile --production --network-timeout 300000 && rm -rf "$(yarn cache dir)"
```

If you are using a multi-stage Docker build for your app, please refer to the [updated examples](https://github.com/backstage/backstage/blob/master/docs/deployment/docker.md#multi-stage-build) in the documentation.
