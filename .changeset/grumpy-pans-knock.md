---
'@techdocs/cli': patch
'@backstage/plugin-techdocs-node': patch
---

fixing techdocs-cli Docker client creation

Docker client does not need to be created when --no-docker
option is provided.

If you had DOCKER_CERT_PATH environment variable defined
the Docker client was looking for certificates
and breaking techdocs-cli generate command even with --no-docker
option.
