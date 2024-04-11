# Backstage Scaffolder Module for Codacy Integration

This module for the Backstage Scaffolder plugin allows users to automatically add repositories to Codacy during the scaffolding process. It leverages the Codacy API to add new repositories for continuous code quality analysis.

## Features

- **Codacy Integration**: Automatically add new repositories to Codacy as part of the Backstage scaffolding process.
- **Configurable**: Easy to configure through Backstage's `app-config.yaml`.

## Getting Started

### Prerequisites

- A Backstage instance where you have permissions to add plugins.
- An API key from Codacy, which will be used to authenticate API requests.

### Installation

1. From your Backstage root directory

   ```bash
   yarn --cwd packages/app add @backstage/plugin-codacy-repo-adder
   ```

2. Add a `codacy.apiKey` entry in your `app-config.yaml` file with your Codacy API key.

   ```yaml
   codacy:
     apiKey: 'your_codacy_api_key_here'
   ```

3. Add the following line to your `packages/backend/src/index.ts` to register the Codacy integration module with the scaffolder:

   ```typescript
   backend.add(import('@backstage/plugin-codacy-repo-adder'));
   ```

### Usage

Once installed and configured, the `codacy:add-repo` action can be used in your scaffolder templates. Here is an example step using the action in a template:

```yaml
steps:
  - id: add-repo
    name: Add Repository to Codacy
    action: codacy:add-repo
    input:
      provider: gh|gl|bb
      owner: your-organization-or-username
      repository: ${{ parameters.repoName }}
```

This action takes three inputs:

provider: The source code provider (e.g., github).
owner: The owner of the repository on the provider's platform.
repository: The name of the repository to be added.
