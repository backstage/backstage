---
'@backstage/config-loader': minor
---

Introduced a new config source system to replace `loadConfig`. There is a new `ConfigSource` interface along with utilities provided by `ConfigSources`, as well as a number of built-in configuration source implementations. The new system is more flexible and makes it easier to create new and reusable sources of configuration, such as loading configuration from secret providers.

The following is an example of how to load configuration using the default behavior:

```ts
const source = ConfigSources.default({
  argv: options?.argv,
  remote: options?.remote,
});
const config = await ConfigSources.toConfig(source);
```

The `ConfigSource` interface looks like this:

```ts
export interface ConfigSource {
  readConfigData(options?: ReadConfigDataOptions): AsyncConfigSourceIterator;
}
```

It is best implemented using an async iterator:

```ts
class MyConfigSource implements ConfigSource {
  async *readConfigData() {
    yield {
      config: [
        {
          context: 'example',
          data: { backend: { baseUrl: 'http://localhost' } },
        },
      ],
    };
  }
}
```
