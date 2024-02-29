# Secure Base Image for Backstage

DockerHub images in general did not seem ideal for Backstage as the number of vulnerabilities were quite high regardless of the image used.

The `Dockerfile` in this directory uses a [`wolfi-base`](https://github.com/wolfi-dev) image from Chainguard Images. This improves the security of the application and reduces false positives in scanners.
