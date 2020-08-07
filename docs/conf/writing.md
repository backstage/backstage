# Writing Backstage Configuration Files

## File Format

Configuration is stored in YAML format in `app-config.yaml` files, looking
something like this:

```yaml
app:
  title: Backstage Example App
  baseUrl: http://localhost:3000

backend:
  listen: 0.0.0.0:7000
  baseUrl: http://localhost:7000

organization:
  name: Spotify

proxy:
  /my/api:
    target: https://example.com/api/
    changeOrigin: true
    pathRewrite:
      ^/proxy/my/api/: /
```

Configuration files are typically checked in and stored in the repo that houses
the rest of the Backstage application.

## Environment Variable Overrides

Individual configuration values can be overridden using environment variables
prefixed with `APP_CONFIG_`. Everything following that prefix in the environment
variable name will be used as the config key, with `_` replaced by `.`. For
example, to override the `app.baseUrl` value, set the `APP_CONFIG_app_baseUrl`
environment variable to the desired value.

The value of the environment variable is parsed as JSON, but it will fall back
to being interpreted as a string if it fails to parse. Note that if you for
example want to pass on the string `"false"`, you need to wrap it in double
quotes, e.g. `export APP_CONFIG_example='"false"'`.

While it may be tempting to use environment variable overrides for supplying a
lot of configuration values, we recommend using them sparingly. Try to stick to
using configuration files, and only use environment variables for things like
reusing deployment artifacts across staging and production environments.

Note that environment variables work for frontend configuration too. They are
picked up by the serve tasks of `@backstage/cli` for local development, and are
injected by the entrypoint of the nginx container serving the frontend in a
production build.

## File Resolution

It is possible to have multiple configuration files, both to support different
environments, but also to define configuration that is local to specific
packages.

All `app-config.yaml` files inside the monorepo root and package root are
considered, as are files with additional `local` and environment affixes such as
`development`, for example `app-config.local.yaml`,
`app-config.production.yaml`, and `app-config.development.local.yaml`. Which
environment config files are loaded is determined by the `NODE_ENV` environment
variable. Local configuration files are always loaded, but are meant for local
development overrides and should typically be `.gitignore`'d.

All loaded configuration files are merged together using the following rules:

- Configurations have different priority, higher priority means you replace
  values from configurations with lower priority.
- Primitive values are completely replaced, as are arrays and all of their
  contents.
- Objects are merged together deeply, meaning that if any of the included
  configs contain a value for a given path, it will be found.

The priority of the configurations is determined by the following rules, in
order:

- Configuration from the `APP_CONFIG_` environment variables has the highest
  priority, followed by files.
- Files inside package directories have higher priority than those in the root
  directory.
- Files with environment affixes have higher priority than ones without.
- Files with the `local` affix have higher priority than ones without.

## Secrets

Secrets are supported via a special `$secret` key, which in turn provides a
number of different ways to read in secrets. To load a configuration value as a
secret, supply an object with a single `$secret` key, and within that supply an
object that describes how the secret is loaded. For example, the following will
read the config key `backend.mySecretKey` from the environment variable
`MY_SECRET_KEY`:

```yaml
backend:
  mySecretKey:
    $secret:
      env: MY_SECRET_KEY
```

With the above configuration, calling `config.getString('backend.mySecretKey')`
will return the value of the environment variable `MY_SECRET_KEY` when the
backend started up. All secrets are loaded at startup, so changing the contents
of secret files or environment variables will not be reflected at runtime.

Note that secrets will never be included in the frontend bundle or development
builds. When loading configuration you have to explicitly enable reading of
secrets, which is only done for the backend configuration.

As hinted at, secrets can be loaded from a bunch of different sources, and can
be extended with more. Below is a list of the currently supported methods for
loading secrets.

### Env Secrets

This reads a secret from an environment variable. For example, the following
config loads the secret from the `MY_SECRET` env var.

```yaml
$secret:
  env: MY_SECRET
```

### File Secrets

This reads a secret from the entire contents of a file. The file path is
relative to the `app-config.yaml` the defines the secrets. For example, the
following reads the contents of `my-secret.txt` relative to the config file
itself:

```yaml
$secret:
  file: ./my-secret.txt
```

### Data File Secrets

This reads secrets from a path within a JSON-like data file. The file path
behaves similar to file secrets, but in addition a `path` is used to point to a
specific value inside the file. Supported file extensions are `.json`, `.yaml`,
and `.yml`. For example, the following would read out `my-secret-key` from
`my-secrets.json`:

```yaml
$secret:
  data: ./my-secrets.json
  path: deployment.key

# my-secrets.json
{
  "deployment": {
    "key": "my-secret-key"
  }
}
```
