# FeatureFlagsApi

The FeatureFlagsApi type is defined at
[packages/core-api/src/apis/definitions/FeatureFlagsApi.ts:41](https://github.com/spotify/backstage/blob/f8780ff32509d0326bc513791ea60846d7614b34/packages/core-api/src/apis/definitions/FeatureFlagsApi.ts#L41).

The following Utility API implements this type:
[featureFlagsApiRef](./README.md#featureflags)

## Members

### registeredFeatureFlags

Store a list of registered feature flags.

<pre>
registeredFeatureFlags: FeatureFlagsRegistryItem[]
</pre>

### getFlags()

Get a list of all feature flags from the current user.

<pre>
getFlags(): UserFlags
</pre>

### getRegisteredFlags()

Get a list of all registered flags.

<pre>
getRegisteredFlags(): FeatureFlagsRegistry
</pre>
