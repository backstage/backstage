# Minimal Hardened Image for Backstage

DockerHub images in general did not seem ideal for Backstage as the number of vulnerabilities were quite high regardless of the image used.

The `Dockerfile` in this directory uses a [`wolfi-base`](https://github.com/wolfi-dev) image from Chainguard Images. This improves the security of the application and reduces false positives in scanners.

## Considerations

- Wolfi only releases the `latest` tag for public consumption however digests can be pinned.
- Wolfi OS uses packages from the [os repository](https://github.com/wolfi-dev/os) on GitHub. Some packages may be named differently.
- While Wolfi uses `apk`, the OS is designed to support `glibc`.
- Due to the stripped down nature of the base image, additional packages might be needed compared to a distribution like Debian or Ubuntu.
