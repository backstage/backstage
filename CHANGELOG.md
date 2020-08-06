# Backstage Changelog

This is a best-effort changelog where we manually collect breaking changes. It is not an exhaustive list of all changes or even features added.

If you encounter issues while upgrading to a newer version, don't hesitate to reach out on [Discord](https://discord.gg/EBHEGzX) or [open an issue](https://github.com/spotify/backstage/issues/new/choose)!

## Next Release

> Collect changes for the next release below

### @backstage/catalog-backend

- Fixed an issue with duplicated location logs. Applying the database migrations from this fix will clear the existing migration logs. https://github.com/spotify/backstage/pull/1836

## v0.1.1-alpha.17

### @backstage/techdocs-backend

- The techdocs backend now requires more configuration to be supplied when creating the router. See [packages/backend/src/plugins/techdocs.ts](https://github.com/spotify/backstage/blob/0201fd9b4a52429519dd59e9184106ba69456deb/packages/backend/src/plugins/techdocs.ts#L42) for an example. https://github.com/spotify/backstage/pull/1736

### @backstage/cli

- The `create-app` command was moved out from the CLI to a standalone package. It's now invoked with `npx @backstage/create-app` instead. https://github.com/spotify/backstage/pull/1745
