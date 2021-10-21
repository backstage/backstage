---
'@backstage/config-loader': minor
---

Removed the `EnvFunc` public export. Its only usage was to be passed in to `LoadConfigOptions.experimentalEnvFunc`. If you were using this type, add a definition in your own project instead with the signature `(name: string) => Promise<string | undefined>`.
