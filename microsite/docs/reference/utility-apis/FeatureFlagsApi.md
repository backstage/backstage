The FeatureFlagsApi type is defined at
[packages/core-api/src/apis/definitions/FeatureFlagsApi.ts:41](https://github.com/spotify/backstage/blob/0406ace29aba7332a98ff9ef9feedd65adc75223/packages/core-api/src/apis/definitions/FeatureFlagsApi.ts#L41).

The following Utility API implements this type:
[featureFlagsApiRef](./README.md#featureflags)

## Members

### registeredFeatureFlags

Store a list of registered feature flags.

```
registeredFeatureFlags: FeatureFlagsRegistryItem[]
```

### getFlags()

Get a list of all feature flags from the current user.

```
getFlags(): UserFlags
```

### getRegisteredFlags()

Get a list of all registered flags.

```
getRegisteredFlags(): FeatureFlagsRegistry
```
