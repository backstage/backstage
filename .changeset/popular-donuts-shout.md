---
'@backstage/plugin-scaffolder-backend': patch
---

Switch out the sandbox, from `vm2` to `isolated-vm`.

This is a native dependency, which means that it will need to be compiled with the same version of node on the same OS. This could cause some issues when running in Docker for instance, as you will need to make sure that the dependency is installed and compiled inside the docker container that it will run on.

This could mean adding in some dependencies to the container like `build-essential` to make sure that this compiles correctly.

If you're having issues installing this dependency, there's some [install instructions](https://github.com/laverdet/isolated-vm#requirements) over on `isolated-vm`'s repo.
