---
'@backstage/techdocs-common': patch
---

Pass user and group ID when invoking docker container. When TechDocs invokes Docker, docker could be run as a `root` user which results in generation of files by applications run by non-root user (e.g. TechDocs) will not have access to modify. This PR passes in current user and group ID to docker so that the file permissions of the generated files and folders are correct.
