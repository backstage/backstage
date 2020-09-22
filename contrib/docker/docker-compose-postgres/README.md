# Docker Compose Development with Postgres

This directory includes files to help you get running with Postgres locally.

## Usage

1. Copy these files into your project
2. Update `app-config.development.yaml` to use Postgres

```diff
backend:
  database:
-   client: sqlite3
-   connection: ':memory:'
+   client: pg
+   connection:
+     host:
+       $secret:
+         env: POSTGRES_HOST
+     port:
+       $secret:
+         env: POSTGRES_PORT
+     user:
+       $secret:
+         env: POSTGRES_USER
+     password:
+       $secret:
+         env: POSTGRES_PASSWORD
```

3. Run `docker-compose up` to start app 🎉
