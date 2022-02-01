# Example backend Dockerfile

This Dockerfile will build the example backend with certain additional binaries needed to workaround
the docker requirement in the scaffolder and techdocs.

# Usage

```bash
yarn docker-build -f <absolute_path_to_the_dockerfile> --tag <your_tag>
```

> The absolute path is necessary as this directory is not copied to the build workspace when building
> the docker image.
