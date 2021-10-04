# DevOps Containers

End-to-end DevOps extends from local development to post-production operations. Whether executed locally on an engineer's machine or remotely on a server, ensuring consistent DevOps task execution improves reproducibility and the quality of an experiment.

Goals of this "contrib" project include:

- Reduce Backstage contributor prerequisites to a single container runtime (e.g. Podman, Docker, etc.)
- Provide examples of shared, immutable task execution environments for local development that can also be used by remote DevOps Continuous Integration and Deployment (CI/CD)
- Give ideas to the core project for opportunities to improve

## Context and problem

Great progress has been made in developing immutable execution environments for application deployments as well as for the build, test, and deploy environments themselves (continuous integration, deployment and release). Local development can also benefit from immutable execution environments, especially when replicating issues.

Engineers typically execute tasks directly from their machine. As a result, they have different operating systems, program and package versions, and configurations. While locking versions of application package dependencies and even tooling with modern version "pinning" features help, like `yarn set version ...`, there can still be significant differences from machine to machine.

## Solution

Containers, like [Docker](https://www.docker.com/), enable an immutable definition of the task execution environment.

## Issues and considerations

- Hosted and sometimes proprietary tasks may be unavoidable, like those offered in the GitHub Actions marketplace or tasks built into products like the core capabilities of Jenkins or through plug-ins. These tasks typically require a "poke the server" approach to debugging end-to-end workflows or containerizing the installation and configuration of the products themselves to be executed as larger containerized tasks. This might introduce the need for guidance on when to define containerized tasks and when to lean on hosted and/or proprietary solutions.
- Cross-platform presents challenges. Getting consistency across operating systems like Linux, macOS, and Windows requires knowledge and effort. A suggestion might be to standardize on a common shell across these three major platforms, since macOS supports bash and is moving the zsh, Linux supports both of those and Windows users can run the Subsystem for Linux and/or Hyper-V and/or Docker images. Choosing a consistent operating system and shell for the container can be problematic.
- Consider the balance of developers freedom of choice in tooling with the consistency with standardized tooling that can be achieved with containerized execution environments. Empower developers to "opt-out" and swap tooling choices wherever possible to experiment and innovate.
- Developers are not likely to agree on solutions unique to a single development editor. Ideally, a solution should be capable of supporting a variety of development tools without requiring them.
- This space is rapidly evolving. Cloud development environments like [GitPod](https://www.gitpod.io/), [VS Code Remote Development](https://code.visualstudio.com/docs/remote/remote-overview), or [Eclipse Che](https://www.eclipse.org/che/) and [Che-Theia](https://github.com/eclipse-che/che-theia).
- Debugging can be tricky, especially when running and stepping through code for breakpoints. Debugging solutions may be specific to a product. For example, VS Code debugging with the remote development extension.

## When to use this pattern

- To ensure task execution consistency across a variety of environments, especially across developer workstations and remote DevOps servers
- For tasks that are particularly fragile and/or complex (e.g. developers consistently reporting setup and environmental issues)
- Code editors may offer support for containerized development. This pattern can easily be extended to support these scenarios. One important consideration is GUI tooling support. Most task execution shouldn't require a GUI, especially for remote DevOps tasks. However, developers might use GUI tooling that could also use containerization or virtualization. So, consider how to achieve both. For example "Docker in Docker" (DiD) could enable a GUI development container to execute containerized tasks in separate containers.

## Example

Backstage is a web application with prerequisites on Node and Yarn. Engineers are encouraged to install a specific version of Node and Yarn. The version of node is partially enforced by the "engines" configuration in "package.json". And, the version of `yarn` was "pinned" using the command `yarn set version ...`, resulting in the root project yarn configuration file with the setting "yarn-path" that contains a specific version of Yarn. Engineers are encouraged to deploy with Docker for testing.

While local execution of DevOps tasks are defined in the "scripts" section of Node's "package.json" file, the DevOps tasks used during continuous integration and deployment are defined separately in GitHub workflow YAML files to be executed by GitHub Actions using separate task definitions.

Docker could be used to unite the execution of local workstation tasks and remote DevOps tasks. With a consistent container image definition, tasks can be executed with guarantees about the OS, tooling and versions and configuration.

A simple option might be to build the image as needed. Local development could build the image once and reuse it over time. However, DevOps servers would need to build the image on every execution set. Each build introduces some significant variability when tooling is installed into the container and the system is updated, so it is important to lock tooling versions as they are installed.

A more robust option might be to define and build the DevOps container(s) for task execution once and then reuse the container as needed. Local development could pull the exact same image that remote DevOps servers also pull.

This example will implement the simple option and leave it to project adopters to choose how to build, store and pull the image.

### Prerequisites

Because the environments are containerized, the only requirement is [Docker](https://docs.docker.com/get-docker/) or [Podman](https://podman.io/). Please install the latest stable version if possible. Docker is simply one of the more ubiquitous runtime options. However, you might also prefer any runtime that supports building and running docker images. If a pre-built image were build and made available using a standard like the [Open Container Initiative](https://opencontainers.org/), then you could use any OCI runtime.

[GNU Make](https://www.gnu.org/software/make/) is highly recommended to ensure the docker commands execute consistently. Microsoft Windows users can install a Linux shell with `make` installed (e.g. Windows Subsystem for Linux, Cygwin, etc.). It would also be possible to define shell scripts and remove the `make` dependency. However, GNU Make was built for this very purpose. Without it, each `make` command will need to be understood, built (i.e. manual variable substitution) and executed.

### Steps

The steps below attempt to mirror the exact same onboarding steps for a new contributor.

1. Open a shell and change to this directory: `cd contrib/make`
2. `make` to will build the container, execute the project's "install" setup including `npm` dependencies, check documents, code and styles, execute the tests, compile typescript and build the project

See the "makefile" for more command targets to execute from your host machine. For an interactive shell session within the container, run `make interactive`.

If this were a standard for implementation, all tasks, including local development and remote DevOps, would be defined in the same way. For example, GitHub Actions would rely on these commands and containers to execute the same tasks a developer could execute locally with the exception of using 3rd party tasks from the GitHub Actions marketplace.
