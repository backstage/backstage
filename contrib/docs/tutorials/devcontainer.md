# Developing Backstage with Dev Containers

This guide will help you get started with developing Backstage using [Dev Containers](https://containers.dev/). Dev
Containers provide a consistent, containerized development environment that works across different machines and
operating systems.

## What are Dev Containers?

Dev Containers (Development Containers) allow you to use a Docker container as a full-featured development environment.
All dependencies, tools, and configurations are defined in the container, so you don't need to install Node.js, Python,
or other tools on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

1. **Docker Desktop** (or Docker Engine on Linux)

- [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
- [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
- [Docker Engine for Linux](https://docs.docker.com/engine/install/)

2. **Visual Studio Code (or IntelliJ IDEA Ultimate)**

- [Download VS Code](https://code.visualstudio.com/)
- [Download IntelliJ IDEA](https://www.jetbrains.com/idea/download/)

**Note**: IntelliJ IDEA Community Edition does not support Dev Containers, so you will need the Ultimate (paid) edition
to use this feature.

3. **Dev Containers Extension**

**For VS Code**:

- Install from
  the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- Or open VS Code and search for "Dev Containers" in the Extensions view (`Ctrl/Cmd + Shift + X`)

**For IntelliJ IDEA**:

- Dev Containers support is available in IntelliJ IDEA Ultimate edition out of the box,
  no additional plugin is required

### System Requirements

The dev container requires:

- **CPU**: At least 2 cores
- **Memory**: At least 4GB of RAM
- **Storage**: At least 32GB of free disk space

## Getting Started

### Option 1: Open the Repository in a Dev Container

1. **Fork and clone the Backstage repository** (if you haven't already):

- Go to https://github.com/backstage/backstage and click "Fork"
- Clone your fork:

  ```shell
  git clone https://github.com/<your-username>/backstage.git
  cd backstage
  ```

2. **Open in VS Code**:

```shell
code .
```

3. **Reopen in Container**:

- VS Code should detect the `.devcontainer` folder and show a notification asking if you want to reopen the folder in
  a container
- Click "Reopen in Container"
- Alternatively, open the Command Palette (`Ctrl/Cmd + Shift + P`) and run "Dev Containers: Reopen in Container"

4. **Wait for the container to build**:

- The first time you open the container, it will take several minutes to build the Docker image and install all
  dependencies
- VS Code will show progress in the bottom-right corner
- The setup script will automatically run `yarn install` and install Python dependencies for TechDocs

5. **You're ready to develop!**

- Once the setup is complete, you'll see a welcome message in the terminal
- Open a new terminal in VS Code (`Ctrl/Cmd + ~`) and run `yarn start` to launch Backstage

### Option 2: Build and Open from Command Palette

1. Open VS Code with the Backstage repository
2. Open the Command Palette (`Ctrl/Cmd + Shift + P`)
3. Run "Dev Containers: Rebuild and Reopen in Container"

## What's Included

The dev container comes pre-configured with:

### Tools and Runtime

- **Node.js**: Version suitable for Backstage development
- **Python 3**: For building and previewing TechDocs
- **Yarn**: Package manager
- **Git**: Version control
- **Chromium**: For running end-to-end tests
- **MkDocs with TechDocs core**: For TechDocs development

### VS Code Extensions

The following extensions are automatically installed:

- **Prettier**: Code formatter (format on save enabled)
- **ESLint**: JavaScript/TypeScript linter
- **Backstage**: Official Backstage extension for syntax highlighting and snippets

### Port Forwarding

The following ports are automatically forwarded to your local machine:

- **3000**: Frontend application
- **7007**: Backend API

Additional ports, such as **9464** for the metrics endpoint, can be forwarded manually from the Ports panel in your
editor, or may be auto-forwarded when detected.

## Using the Dev Container

### Starting Backstage

Once the container is ready and dependencies are installed:

```shell
yarn start
```

This will start both the frontend (on port 3000) and backend (on port 7007). Access Backstage at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:7007

> **Note**: The first time you start Backstage, the backend may take a minute to fully start. You might need to refresh
> your browser once the backend is ready.

## Troubleshooting

### Container build fails

If the container fails to build, try:

1. Make sure Docker Desktop is running
2. Rebuild the container: Command Palette → "Dev Containers: Rebuild Container"
3. Check Docker has enough resources allocated (CPU, memory, disk space)

### Port already in use

If ports 3000 or 7007 are already in use on your local machine:

1. Stop any other Backstage instances or services using those ports
2. Reload the VS Code window: Command Palette → "Developer: Reload Window"

### Dependencies not installed

If `yarn start` fails with missing dependencies:

1. Run `yarn install` manually in the terminal
2. Or rebuild the container to run the setup script again

### Performance issues

If the dev container feels slow:

1. Increase Docker Desktop's resource allocation (Settings → Resources)
2. Make sure your Docker disk image isn't full
3. On Windows, ensure WSL 2 is enabled for better performance

### Cannot connect to backend

If the frontend shows connection errors:

1. Wait a minute for the backend to fully start (check terminal logs)
2. Ensure port 7007 is properly forwarded (check Ports panel in VS Code)
3. Refresh your browser

## Additional Resources

- [Dev Containers Documentation](https://containers.dev/)
- [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)
- [Backstage Getting Started Guide](https://backstage.io/docs/getting-started/)
- [Backstage Contributing Guide](../../../CONTRIBUTING.md)

## Need Help?

If you encounter issues not covered in this guide:

- Check the [Backstage Discord](https://discord.gg/backstage) community
- Search or create an issue on [GitHub](https://github.com/backstage/backstage/issues)
- Review the [Backstage documentation](https://backstage.io/docs/)
