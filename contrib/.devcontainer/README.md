# Devcontainer Configuration

[Devcontainer](https://code.visualstudio.com/docs/devcontainers/containers) is a VSCode feature that allows developers
to share a common workspace definition, by leveraging Docker to run the workspace, and using VSCode Remote Development extension, you can make sure the developer experience is the same across different computers

## Benefits

- Developers only need to have VSCode and Docker installed
- All dependencies necessary to work in the repository are contained in the docker image
- Makes it easier for new developers to start contributing to the project
- No extra setup required

## Known Issues

- Performance is a known issue. Working inside devcontainers require developers to have a powerful computer. See [System Requirements](https://code.visualstudio.com/docs/devcontainers/containers#_system-requirements)

## Usage

Just copy the .devcontainer folder to the root of the directory, and VSCode will automatically detect the configuration and suggest that you re-open the repository using Devcontainer
