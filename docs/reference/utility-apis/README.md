# Backstage Core Utility APIs

The following is a list of all Utility APIs defined by `@backstage/core`. They
are available to use by plugins and components, and can be accessed using the
`useApi` hook, also provided by `@backstage/core`. For more information, see
https://github.com/spotify/backstage/blob/master/docs/api/utility-apis.md.

### alert

Used to report alerts and forward them to the app

Implemented type: [AlertApi](./AlertApi)

ApiRef:
[alertApiRef](https://github.com/spotify/backstage/blob/4df02a253f6903e1ca20184369f5655e2d49d893/packages/core-api/src/apis/definitions/AlertApi.ts#L41)

### appTheme

API Used to configure the app theme, and enumerate options

Implemented type: [AppThemeApi](./AppThemeApi)

ApiRef:
[appThemeApiRef](https://github.com/spotify/backstage/blob/4df02a253f6903e1ca20184369f5655e2d49d893/packages/core-api/src/apis/definitions/AppThemeApi.ts#L74)

### config

Used to access runtime configuration

Implemented type: [Config](./Config)

ApiRef:
[configApiRef](https://github.com/spotify/backstage/blob/4df02a253f6903e1ca20184369f5655e2d49d893/packages/core-api/src/apis/definitions/ConfigApi.ts#L22)

### error

Used to report errors and forward them to the app

Implemented type: [ErrorApi](./ErrorApi)

ApiRef:
[errorApiRef](https://github.com/spotify/backstage/blob/4df02a253f6903e1ca20184369f5655e2d49d893/packages/core-api/src/apis/definitions/ErrorApi.ts#L65)

### featureFlags

Used to toggle functionality in features across Backstage

Implemented type: [FeatureFlagsApi](./FeatureFlagsApi)

ApiRef:
[featureFlagsApiRef](https://github.com/spotify/backstage/blob/4df02a253f6903e1ca20184369f5655e2d49d893/packages/core-api/src/apis/definitions/FeatureFlagsApi.ts#L58)

### githubAuth

Provides authentication towards Github APIs

Implemented types: [OAuthApi](./OAuthApi), [ProfileInfoApi](./ProfileInfoApi),
[BackstageIdentityApi](./BackstageIdentityApi),
[SessionStateApi](./SessionStateApi)

ApiRef:
[githubAuthApiRef](https://github.com/spotify/backstage/blob/4df02a253f6903e1ca20184369f5655e2d49d893/packages/core-api/src/apis/definitions/auth.ts#L230)

### gitlabAuth

Provides authentication towards Gitlab APIs

Implemented types: [OAuthApi](./OAuthApi), [ProfileInfoApi](./ProfileInfoApi),
[BackstageIdentityApi](./BackstageIdentityApi),
[SessionStateApi](./SessionStateApi)

ApiRef:
[gitlabAuthApiRef](https://github.com/spotify/backstage/blob/4df02a253f6903e1ca20184369f5655e2d49d893/packages/core-api/src/apis/definitions/auth.ts#L260)

### googleAuth

Provides authentication towards Google APIs and identities

Implemented types: [OAuthApi](./OAuthApi),
[OpenIdConnectApi](./OpenIdConnectApi), [ProfileInfoApi](./ProfileInfoApi),
[BackstageIdentityApi](./BackstageIdentityApi),
[SessionStateApi](./SessionStateApi)

ApiRef:
[googleAuthApiRef](https://github.com/spotify/backstage/blob/4df02a253f6903e1ca20184369f5655e2d49d893/packages/core-api/src/apis/definitions/auth.ts#L213)

### identity

Provides access to the identity of the signed in user

Implemented type: [IdentityApi](./IdentityApi)

ApiRef:
[identityApiRef](https://github.com/spotify/backstage/blob/4df02a253f6903e1ca20184369f5655e2d49d893/packages/core-api/src/apis/definitions/IdentityApi.ts#L54)

### oauth2

Example of how to use oauth2 custom provider

Implemented types: [OAuthApi](./OAuthApi),
[OpenIdConnectApi](./OpenIdConnectApi), [ProfileInfoApi](./ProfileInfoApi),
[SessionStateApi](./SessionStateApi)

ApiRef:
[oauth2ApiRef](https://github.com/spotify/backstage/blob/4df02a253f6903e1ca20184369f5655e2d49d893/packages/core-api/src/apis/definitions/auth.ts#L270)

### oauthRequest

An API for implementing unified OAuth flows in Backstage

Implemented type: [OAuthRequestApi](./OAuthRequestApi)

ApiRef:
[oauthRequestApiRef](https://github.com/spotify/backstage/blob/4df02a253f6903e1ca20184369f5655e2d49d893/packages/core-api/src/apis/definitions/OAuthRequestApi.ts#L130)

### oktaAuth

Provides authentication towards Okta APIs

Implemented types: [OAuthApi](./OAuthApi),
[OpenIdConnectApi](./OpenIdConnectApi), [ProfileInfoApi](./ProfileInfoApi),
[BackstageIdentityApi](./BackstageIdentityApi),
[SessionStateApi](./SessionStateApi)

ApiRef:
[oktaAuthApiRef](https://github.com/spotify/backstage/blob/4df02a253f6903e1ca20184369f5655e2d49d893/packages/core-api/src/apis/definitions/auth.ts#L243)

### storage

Provides the ability to store data which is unique to the user

Implemented type: [StorageApi](./StorageApi)

ApiRef:
[storageApiRef](https://github.com/spotify/backstage/blob/4df02a253f6903e1ca20184369f5655e2d49d893/packages/core-api/src/apis/definitions/StorageApi.ts#L68)
