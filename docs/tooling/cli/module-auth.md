---
id: module-auth
title: Auth Module
description: CLI commands for authenticating with Backstage instances.
---

The auth module (`@backstage/cli-module-auth`) provides commands for
authenticating the CLI with Backstage instances. It uses OAuth 2.0 with PKCE to
obtain access tokens, which are then used by other CLI commands such as
[actions](./module-actions.md).

## Prerequisites

The Backstage instance you are connecting to must have CLI authentication
support enabled. The CLI checks for this by fetching the OAuth client metadata
from the instance's well-known endpoint at
`/api/auth/.well-known/oauth-client/cli.json`.

## Instance names

Each authenticated Backstage instance is stored under a name that you choose.
This name is a short label used to refer to the instance in other commands (for
example `--instance production`). If you do not provide a name when logging in,
the CLI derives one from the backend URL's hostname (for example
`backstage.example.com`).

## auth login

Log in the CLI to a Backstage instance. This starts an OAuth authorization flow
that opens your browser to authenticate and then stores the resulting credentials
locally.

```text
Usage: backstage-cli auth login [options]

Log in the CLI to a Backstage instance

Options:
  --backendUrl <url>   Backend base URL
  --noBrowser          Do not open browser automatically
  --instance <name>    A short name for this instance, used to refer to it in
                       other auth commands. Defaults to the backend URL hostname.
```

When run without any flags the command prompts you interactively. It scans local
`app-config.yaml` files to discover backend URLs, lets you pick one or enter a
URL manually, and derives an instance name from the URL host.

If `--noBrowser` is set, the authorization URL is printed to the terminal so you
can open it manually.

### Examples

Log in interactively:

```bash
yarn backstage-cli auth login
```

Log in to a specific backend URL:

```bash
yarn backstage-cli auth login --backendUrl https://backstage.example.com
```

Log in and name the instance for later reference:

```bash
yarn backstage-cli auth login --backendUrl https://backstage.example.com --instance production
```

Log in without automatically opening a browser:

```bash
yarn backstage-cli auth login --backendUrl https://backstage.example.com --noBrowser
```

## auth logout

Log out of a Backstage instance and clear stored credentials. The command
revokes the refresh token with the server (best-effort) and removes both tokens
and instance metadata from local storage.

```text
Usage: backstage-cli auth logout [options]

Log out the CLI and clear stored credentials

Options:
  --instance <name>    Name of the instance to log out
```

If `--instance` is not provided, an interactive prompt lets you pick from the
list of authenticated instances.

### Examples

Log out of a specific instance:

```bash
yarn backstage-cli auth logout --instance production
```

Log out interactively:

```bash
yarn backstage-cli auth logout
```

## auth show

Show details of an authenticated instance, including the current user identity
and ownership entity references.

```text
Usage: backstage-cli auth show [options]

Show details of an authenticated instance

Options:
  --instance <name>    Name of the instance to show
```

The command fetches user information from the instance's `/api/auth/v1/userinfo`
endpoint and refreshes the access token if needed.

### Examples

Show details for the default instance:

```bash
yarn backstage-cli auth show
```

Show details for a named instance:

```bash
yarn backstage-cli auth show --instance production
```

## auth list

List all authenticated instances. The selected default instance is marked with
an asterisk (`*`).

```text
Usage: backstage-cli auth list

List authenticated instances
```

### Examples

```bash
yarn backstage-cli auth list
```

Example output:

```text
* production - https://backstage.example.com
  staging - https://backstage-staging.example.com
```

## auth print-token

Print an access token to stdout. If the token has expired or is about to expire,
it is refreshed automatically before printing. Useful for scripting and
pipelines.

```text
Usage: backstage-cli auth print-token [options]

Print an access token to stdout (auto-refresh if needed)

Options:
  --instance <name>    Name of the instance to use
```

### Examples

Print the access token for the default instance:

```bash
yarn backstage-cli auth print-token
```

Use the token in a curl command:

```bash
curl -H "Authorization: Bearer $(yarn backstage-cli auth print-token)" \
  https://backstage.example.com/api/catalog/entities
```

Print the token for a named instance:

```bash
yarn backstage-cli auth print-token --instance staging
```

## auth select

Select the default instance. Other auth commands use the default instance when
no `--instance` flag is provided.

```text
Usage: backstage-cli auth select [options]

Select the default instance

Options:
  --instance <name>    Name of the instance to select
```

If `--instance` is not provided, an interactive prompt lets you pick from the
list of authenticated instances.

### Examples

Select a specific instance as the default:

```bash
yarn backstage-cli auth select --instance production
```

Select interactively:

```bash
yarn backstage-cli auth select
```

## Instance storage

Authentication state is stored in two places:

- **Instance metadata** is stored in a YAML file at
  `~/.config/backstage-cli/auth-instances.yaml` (or the platform-appropriate
  equivalent using the XDG config directory). This file contains instance names,
  backend URLs, token expiration timestamps, and which instance is selected.
- **Tokens** (access tokens and refresh tokens) are stored in the system secret
  store, separate from the YAML file.
