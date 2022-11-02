# Scaffolder contrib tools

## Testing Templates with Dry-run

Scaffolder templates support anything that backstage.io and custom actions can do, so testing them is hard without actually running the instance of Backstage that they're designed for.

Please leave [feedback on the RFC](https://github.com/backstage/backstage/issues/14280) on your experience with this approach.

The [command line script](template-testing-dry-run.md) might offer a way for you to do so using the dry-run API used for the Template Editor. Run it against a running instance, either locally or remote, and use it like

```sh
scaffolder-dry http://localhost:7007/ template-directory values.yml output-directory
```

If you're using backend permissions, pass a front-end auth token from a current browser session via `--token $FRONTEND_TOKEN`.
