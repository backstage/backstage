# Minimal Hardened Image for Backstage

DockerHub images in general did not seem ideal for Backstage as the number of vulnerabilities were quite high regardless of the image used.

The `Dockerfile` in this directory uses a [`wolfi-base`](https://github.com/wolfi-dev) image from Chainguard Images. This improves the security of the application and reduces false positives in scanners.

## Considerations

- `Wolfi` only releases the `latest` tag for public consumption however digests can be pinned.
- `Wolfi` OS uses packages from the [os repository](https://github.com/wolfi-dev/os) on GitHub. Some packages may be named differently.
- While `Wolfi` uses `apk`, the OS is designed to support `glibc`.
- Due to the stripped down nature of the base image, additional packages might be needed compared to a distribution like Debian or Ubuntu.
- Chainguard will maintain one version of each Wolfi package at a time, which will track the latest version of the upstream software in the package. Chainguard will end patch support for previous versions of packages in Wolfi. [Read more here](https://edu.chainguard.dev/chainguard/chainguard-images/faq/#what-packages-are-available-in-chainguard-images)
  - It is encouraged to use a relative pin or use a third-party tool to ensure the packages are kept up to date
