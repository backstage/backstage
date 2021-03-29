# Immutable Task Pattern

Whether executed locally on an engineer's machine or remotely on a server, ensuring consistent DevOps task execution improves reproducibility and the quality of an experiment.

## Context and problem

Great progress has been made in developing immutable execution environments for application deployments as well as for the build, test, and deploy environments themselves (continuous integration, deployment and release). Local development can also benefit from immutable execution environments, especially when replicating issues.

Engineers typically execute tasks directly from their machine. As a result, they have different operating systems, program and package versions, and configurations. While locking versions of application package dependencies and even tooling with modern features, like `yarn set version ...`, help, there can still be significant differences from machine to machine.

## Solution

Containers, like [Docker](https://www.docker.com/), enable an immutable definition of the task execution environment.

## Issues and considerations

* Hosted and sometimes proprietary tasks may be unavoidable, like those offered in the GitHub Actions marketplace or tasks built into products like the core capabilities of Jenkins or through plug-ins. These tasks typically require a "poke the server" approach to debugging end-to-end workflows or containerizing the installation and configuration of the products themselves to be executed as larger containerized tasks. This might introduce the need for guidance on when to define containerized tasks and when to lean on hosted and/or proprietary solutions.
* Cross-platform presents challenges. Getting consistency across Linux, macOS, and Windows requires knowledge and effort. A quick argument can be to standardize on Linux shell across these three major platforms, but even working across Linux distributions presents some unique challenges too.
* Consider the balance of developers freedom of choice in tooling with the consistency with standardized tooling that can be achieved with containerized execution environments. Empower developers to "opt-out" and swap tooling choices wherever possible to experiment and innovate.

## When to use this pattern

* To ensure task execution consistency across a variety of environments, especially across developer workstations and remote DevOps servers
* For tasks that are particularly fragile and/or complex (e.g. developers consistently reporting setup and environmental issues)
* Code editors and "Integrated Development Environments" may offer support for containerized development, like Visual Studio Code's Remote Development extension. This pattern can easily be extended to support these scenarios. One important consideration is GUI tooling support. Most task execution shouldn't require a GUI, especially for remote DevOps tasks. However, developers might use GUI tooling that could also be containerized / virtualized. So, consider how to achieve both. For example "Docker in Docker" (DiD) could enable a GUI development container to execute containerized tasks in separate containers.

## Example

Backstage is a web application with prerequisites on Node and Yarn. Engineers are encouraged to install a specific version of Node and Yarn. The version of node is partially enforced by the "engines" configuration in "package.json". And, the version of `yarn` was "locked" using the command `yarn set version ...`, resulting in the root project file "./.yarnrc" with the setting "yarn-path" that contains a specific version of Yarn. Engineers are encouraged to deploy with Docker.

While local execution of DevOps tasks are defined in the "scripts" section of Node's "package.json" file, the DevOps tasks used during continuous integration and deployment are defined separately in ".github/workflows/*.yml" files to be executed by GitHub Actions using separate task definitions.

Docker could be used to unite the execution of local workstation tasks and remote DevOps tasks. With a consistent container image definition, tasks can be executed with certain gaurantees about the OS, tooling and versions and configuration.

A simple option might be to build the image as needed. Local development could build the image once and reuse it over time. However, DevOps servers would need to build the image on every execution set. Also, building ad-hoc still introduces some significant variability when tooling is installed into the container and the system is updated.

A more robust option might be to define and build the DevOps container(s) for task execution once and then reuse the container as needed. Local development could pull the exact same image that remote DevOps servers also pull.

This example will implement the simple option and leave it to project adopters to choose how to build, store and pull the image.

### Prerequisites

Because the environments are containerized, the only requirement is [Docker](https://docs.docker.com/get-docker/). Please install the latest stable version if possible. Docker is simply one of the more ubiquitous runtimes. However, you might also prefer any runtime that supports building and running docker images. For example, [podman](https://podman.io/). If a pre-built image were build and made available using a standard like the [Open Container Initiative](https://opencontainers.org/), then you could use any OCI runtime.

[GNU Make](https://www.gnu.org/software/make/) is highly recommended to ensure the docker commands execute consistently. Microsoft Windows users can install a Linux shell with `make` installed (e.g. Windows Subsystem for Linux, cygwin, etc.). It would also be possible to define shell scripts and remove the `make` dependency. However, GNU Make was built for this very purpose. Without it, each `make` command will need to be understood, built (i.e. manual variable substitution) and executed.

### Steps

The steps below attempt to mirror the exact same onboarding steps for a new contributor.

1. Open a shell and change to this directory: `cd contrib/make`
2. `make install` will build the container and then execute the project's "install" setup including `npm` dependencies
3. `make tsc` will compile typescript
4. `make build` will build the project

If this were a standard for implementation, all tasks, including local development and remote DevOps, would be defined in the same way. For example, GitHub Actions would rely on these commands and containers to execute the same tasks a developer could execute locally with the exception of using 3rd party tasks from the GitHub Actions marketplace.
