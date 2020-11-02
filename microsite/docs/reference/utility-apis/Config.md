The Config type is defined at
[packages/config/src/types.ts:32](https://github.com/spotify/backstage/blob/0406ace29aba7332a98ff9ef9feedd65adc75223/packages/config/src/types.ts#L32).

The following Utility API implements this type:
[configApiRef](./README.md#config)

## Members

### has()

```
has(key: string): boolean
```

### keys()

```
keys(): string[]
```

### get()

```
get(key?: string): <a href="#jsonvalue">JsonValue</a>
```

### getOptional()

```
getOptional(key?: string): <a href="#jsonvalue">JsonValue</a> | undefined
```

### getConfig()

```
getConfig(key: string): <a href="#config">Config</a>
```

### getOptionalConfig()

```
getOptionalConfig(key: string): <a href="#config">Config</a> | undefined
```

### getConfigArray()

```
getConfigArray(key: string): <a href="#config">Config</a>[]
```

### getOptionalConfigArray()

```
getOptionalConfigArray(key: string): <a href="#config">Config</a>[] | undefined
```

### getNumber()

```
getNumber(key: string): number
```

### getOptionalNumber()

```
getOptionalNumber(key: string): number | undefined
```

### getBoolean()

```
getBoolean(key: string): boolean
```

### getOptionalBoolean()

```
getOptionalBoolean(key: string): boolean | undefined
```

### getString()

```
getString(key: string): string
```

### getOptionalString()

```
getOptionalString(key: string): string | undefined
```

### getStringArray()

```
getStringArray(key: string): string[]
```

### getOptionalStringArray()

```
getOptionalStringArray(key: string): string[] | undefined
```

## Supporting types

These types are part of the API declaration, but may not be unique to this API.

### Config

```
export type Config = {
  has(key: string): boolean;

  keys(): string[];

  get(key?: string): <a href="#jsonvalue">JsonValue</a>;
  getOptional(key?: string): <a href="#jsonvalue">JsonValue</a> | undefined;

  getConfig(key: string): Config;
  getOptionalConfig(key: string): <a href="#config">Config</a> | undefined;

  getConfigArray(key: string): <a href="#config">Config</a>[];
  getOptionalConfigArray(key: string): <a href="#config">Config</a>[] | undefined;

  getNumber(key: string): number;
  getOptionalNumber(key: string): number | undefined;

  getBoolean(key: string): boolean;
  getOptionalBoolean(key: string): boolean | undefined;

  getString(key: string): string;
  getOptionalString(key: string): string | undefined;

  getStringArray(key: string): string[];
  getOptionalStringArray(key: string): string[] | undefined;
}
```

Defined at
[packages/config/src/types.ts:32](https://github.com/spotify/backstage/blob/0406ace29aba7332a98ff9ef9feedd65adc75223/packages/config/src/types.ts#L32).

Referenced by: [getConfig](#getconfig), [getOptionalConfig](#getoptionalconfig),
[getConfigArray](#getconfigarray),
[getOptionalConfigArray](#getoptionalconfigarray), [Config](#config).

### JsonArray

```
export type JsonArray = <a href="#jsonvalue">JsonValue</a>[]
```

Defined at
[packages/config/src/types.ts:18](https://github.com/spotify/backstage/blob/0406ace29aba7332a98ff9ef9feedd65adc75223/packages/config/src/types.ts#L18).

Referenced by: [JsonValue](#jsonvalue).

### JsonObject

```
export type JsonObject = { [key in string]?: <a href="#jsonvalue">JsonValue</a> }
```

Defined at
[packages/config/src/types.ts:17](https://github.com/spotify/backstage/blob/0406ace29aba7332a98ff9ef9feedd65adc75223/packages/config/src/types.ts#L17).

Referenced by: [JsonValue](#jsonvalue).

### JsonValue

```
export type JsonValue =
  | <a href="#jsonobject">JsonObject</a>
  | <a href="#jsonarray">JsonArray</a>
  | number
  | string
  | boolean
  | null
```

Defined at
[packages/config/src/types.ts:19](https://github.com/spotify/backstage/blob/0406ace29aba7332a98ff9ef9feedd65adc75223/packages/config/src/types.ts#L19).

Referenced by: [get](#get), [getOptional](#getoptional),
[JsonObject](#jsonobject), [JsonArray](#jsonarray), [Config](#config).
