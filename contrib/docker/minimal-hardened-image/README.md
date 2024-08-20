# Minimal Hardened Image for Backstage

DockerHub images in general did not seem ideal for Backstage as the number of vulnerabilities were quite high regardless of the image used.

The `Dockerfile` in this directory uses a [wolfi-base](https://github.com/wolfi-dev) image from Chainguard Images. This improves the security of the application and reduces false positives in scanners.

## Steps taken

When converting, I utilized the upstream Dockerfile as a starting point.

- Multi-stage build - The Dockerfile has been split up into a multistage build which reduces the files, packages, executables, and directories in the final image.
  - Size savings = ~900mb
  - Reduced attack surface
- Base Image - Swap to [wolfi-base](https://github.com/wolfi-dev) image from Chainguard Images
  - Vulnerability Savings = ~239 at the time of updating this README
- Entrypoint - Swap from `node` to `tini` as entrypoint to ensure that the default signal handlers work and zombie processes are handled properly
- Use `ADD` instead of `COPY` in dockerfile to reduce copied compressed files
  - When a `rm` is used to remove a compressed file it still makes its way into the final image. Using `ADD` is safe with local files.

## Pinning Digest

To reduce maintenance, the digest of the image has been removed from the `./Dockerfile` file. A complete example with the digest would be `cgr.dev/chainguard/wolfi-base:latest@sha256:3d6dece13cdb5546cd03b20e14f9af354bc1a56ab5a7b47dca3e6c1557211fcf` and it is suggested to update the `FROM` line in the `Dockerfile` to use a digest.

Using the digest allows tools such as Dependabot or Renovate to know exactly which image digest is being utilized and allows for Pull Requests to be triggered when a new digest is available. It is suggested to setup Dependabot/Renovate or a similar tool to ensure the image is kept up to date so that vulnerability fixes that have been addressed are pulled in frequently.

### Obtaining Digest

To obtain the latest digest, perform a `docker pull` on the image to get the latest digest in the command output or use `crane digest <image>`.

## Considerations

- Wolfi only releases the `latest` tag for public consumption however digests can be pinned.
- Wolfi OS uses packages from the [os repository](https://github.com/wolfi-dev/os) on GitHub.
  - Some packages may be named differently.
- While Wolfi uses `apk`, the OS is designed to support `glibc`.
- Due to the stripped down nature of the base image, additional packages might be needed compared to a distribution like Debian or Ubuntu.
- Chainguard will maintain one version of each Wolfi package at a time, which will track the latest version of the upstream software in the package. Chainguard will end patch support for previous versions of packages in Wolfi. [Read more here](https://edu.chainguard.dev/chainguard/chainguard-images/faq/#what-packages-are-available-in-chainguard-images)
  - It is encouraged to use a relative pin or use a third-party tool to ensure the packages are kept up to date
