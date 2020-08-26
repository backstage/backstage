# Backstage Changelog

This is a best-effort changelog where we manually collect breaking changes. It is not an exhaustive list of all changes or even features added.

If you encounter issues while upgrading to a newer version, don't hesitate to reach out on [Discord](https://discord.gg/EBHEGzX) or [open an issue](https://github.com/spotify/backstage/issues/new/choose)!

## Next Release

> Collect changes for the next release below

## v0.1.1-alpha.20

- Includes https://github.com/spotify/backstage/pull/2097 to resolve issues with create-plugin command.

## v0.1.1-alpha.19

### @backstage/create-app

- Many plugins have been added to the catalog and will for now be required to be added to separate apps as well. This will be solved as [#1536](https://github.com/spotify/backstage/issues/1536) gets sorted out, but for now you may need to install some plugins just to get pages to work.

### @backstage/catalog-backend

- Added the possibility to add static locations via `app-config.yaml`. This changed the signature of `new LocationReaders(logger)` inside `packages/backend/src/plugins/catalog.ts` to `new LocationReaders({config, logger})`. [#1890](https://github.com/spotify/backstage/pull/1890)

### @backstage/theme

- Changed the type signature of the palette, removing `sidebar: string` and adding `navigation: { background: string; indicator: string}`. [#1880](https://github.com/spotify/backstage/pull/1880)

## v0.1.1-alpha.18

### @backstage/catalog-backend

- Fixed an issue with duplicated location logs. Applying the database migrations from this fix will clear the existing migration logs. [#1836](https://github.com/spotify/backstage/pull/1836)

### @backstage/auth-backend

This version fixes a breakage in CSP policies set by the auth backend. If you're facing trouble with auth in alpha.17, upgrade to alpha.18.

- OAuth redirect URLs no longer receive the `env` parameter, as it is now passed through state instead. This will likely require a reconfiguration of the OAuth app, where a redirect URL like `http://localhost:7000/auth/google/handler/frame?env=development` should now be configured as `http://localhost:7000/auth/google/handler/frame`. [#1812](https://github.com/spotify/backstage/pull/1812)

### @backstage/core

- `SignInPage` props have been changed to receive a list of provider objects instead of simple string identifiers for all but the `'guest'` and `'custom'` providers. This opens up for configuration of custom providers, but may break existing configurations. See [packages/app/src/App.tsx](https://github.com/spotify/backstage/blob/032ba401af36a760efdac41668d7000ccf09bc57/packages/app/src/App.tsx#L36) and [packages/app/src/identityProviders.ts](https://github.com/spotify/backstage/blob/032ba401af36a760efdac41668d7000ccf09bc57/packages/app/src/identityProviders.ts#L24) for how to bring back the existing providers. [#1816](https://github.com/spotify/backstage/pull/1816)

## v0.1.1-alpha.17

### @backstage/techdocs-backend

- The techdocs backend now requires more configuration to be supplied when creating the router. See [packages/backend/src/plugins/techdocs.ts](https://github.com/spotify/backstage/blob/0201fd9b4a52429519dd59e9184106ba69456deb/packages/backend/src/plugins/techdocs.ts#L42) for an example. [#1736](https://github.com/spotify/backstage/pull/1736)

### @backstage/cli

- The `create-app` command was moved out from the CLI to a standalone package. It's now invoked with `npx @backstage/create-app` instead. [#1745](https://github.com/spotify/backstage/pull/1745)
