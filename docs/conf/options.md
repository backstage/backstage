# Configuration Options

The configuration options for app-config.yaml.

## @backstage/cli [packages/cli/package.json]

### app.baseUrl

Type: string Visibility: frontend

No description.

### app.title

Type: string Visibility: frontend

No description.

### app.googleAnalyticsTrackingId

Type: string Visibility: frontend

Tracking ID for Google Analytics

### app.listen.host

Type: string Visibility: frontend

The host that the frontend should be bound to. Only used for local development.

### app.listen.port

Type: number Visibility: frontend

The port that the frontend should be bound to. Only used for local development.

## @backstage/lighthouse [plugins/lighthouse/package.json]

### lighthouse.baseUrl

Type: string Visibility: frontend

No description.

## @backstage/user-settings [plugins/user-settings/package.json]

### auth.providers

Type: object

No description.

## [packages/backend-common/config.d.ts]

### app.baseUrl

Type: string

No description.

### backend.baseUrl

Type: string

No description.

### backend.listen

Address that the backend should listen to.

### backend.https

HTTPS configuration for the backend. If omitted the backend will serve HTTP.

Setting this to &#x60;true&#x60; will cause self-signed certificates to be
generated, which can be useful for local development or other non-production
scenarios.

### backend.database

Database connection configuration, select database type using the
&#x60;client&#x60; field

### backend.cors.origin

No description.

### backend.cors.methods

No description.

### backend.cors.allowedHeaders

No description.

### backend.cors.exposedHeaders

No description.

### backend.cors.credentials

Type: boolean

No description.

### backend.cors.maxAge

Type: number

No description.

### backend.cors.preflightContinue

Type: boolean

No description.

### backend.cors.optionsSuccessStatus

Type: number

No description.

### backend.reading.allow

Type: array

A list of targets to allow outgoing requests to. Users will be able to make
requests on behalf of the backend to the targets that are allowed by this list.

### backend.csp

Type: object

Content Security Policy options.

The keys are the plain policy ID, e.g. &quot;upgrade-insecure-requests&quot;.
The values are on the format that the helmet library expects them, as an array
of strings. There is also the special value false, which means to remove the
default value that Backstage puts in place for that policy.

## [packages/core/config.d.ts]

### app.baseUrl

Type: string Visibility: frontend

The public absolute root URL that the frontend.

### app.title

Type: string Visibility: frontend

The title of the app.

### backend.baseUrl

Type: string Visibility: frontend

The public absolute root URL that the backend is reachable at.

### organization.name

Type: string Visibility: frontend

The name of the organization that the app belongs to.

### homepage.clocks

Type: array

No description.

### auth.environment

Type: string Visibility: frontend

The &#x27;environment&#x27; attribute added as an optional parameter to have
configurable environment value for &#x60;auth.providers&#x60;. default value:
&#x27;development&#x27; optional values: &#x27;development&#x27; |
&#x27;production&#x27;

## [packages/integration/config.d.ts]

### integrations.azure

Type: array

Integration configuration for Azure

### integrations.bitbucket

Type: array

Integration configuration for Bitbucket

### integrations.github

Type: array

Integration configuration for GitHub

### integrations.gitlab

Type: array

Integration configuration for GitLab

## [plugins/auth-backend/config.d.ts]

### auth.environment

Type: string Visibility: frontend

The &#x27;environment&#x27; attribute

### auth.session.secret

Type: string Visibility: secret

The secret attribute of session object.

### auth.providers.google.development

Type: object

No description.

### auth.providers.github.development

Type: object

No description.

### auth.providers.gitlab.development

Type: object

No description.

### auth.providers.saml.entryPoint

Type: string

No description.

### auth.providers.saml.logoutUrl

Type: string

No description.

### auth.providers.saml.issuer

Type: string

No description.

### auth.providers.saml.cert

Type: string

No description.

### auth.providers.saml.privateKey

Type: string

No description.

### auth.providers.saml.decryptionPvk

Type: string

No description.

### auth.providers.saml.signatureAlgorithm

Type: string

No description.

### auth.providers.saml.digestAlgorithm

Type: string

No description.

### auth.providers.okta.development

Type: object

No description.

### auth.providers.oauth2.development.clientId

Type: string

No description.

### auth.providers.oauth2.development.clientSecret

Type: string

No description.

### auth.providers.oauth2.development.authorizationUrl

Type: string

No description.

### auth.providers.oauth2.development.tokenUrl

Type: string

No description.

### auth.providers.oauth2.development.scope

Type: string

No description.

### auth.providers.oidc.development

Type: object

No description.

### auth.providers.auth0.development

Type: object

No description.

### auth.providers.microsoft.development

Type: object

No description.

### auth.providers.onelogin.development

Type: object

No description.

### auth.providers.awsalb.issuer

Type: string

No description.

### auth.providers.awsalb.region

Type: string

No description.

## [plugins/catalog-backend/config.d.ts]

### catalog.rules

Type: array

Rules to apply to all catalog entities, from any location.

An undefined list of matchers means match all, an empty list of matchers means
match none.

This is commonly used to put in what amounts to a whitelist of kinds that
regular users of Backstage are permitted to register locations for. This can be
used to stop them from registering yaml files describing for example a Group
entity called &quot;admin&quot; that they make themselves members of, or
similar.

### catalog.locations

Type: array

A set of static locations that the catalog shall always keep itself up-to-date
with. This is commonly used for large, permanent integrations that are defined
by the Backstage operators at an organization, rather than individual things
that users register dynamically.

These have (optional) rules of their own. These override what the global rules
above specify. This way, you can prevent everybody from register e.g. User and
Group entities, except for one or a few static locations that have those two
kinds explicitly allowed.

For example:

&#x60;&#x60;&#x60;yaml rules:

- allow: [Component, API, Template, Location] locations:
- type: url target: https://github.com/org/repo/blob/master/users.yaml rules:
  - allow: [User, Group]
- type: url target: https://github.com/org/repo/blob/master/systems.yaml
  rules: - allow: [System] &#x60;&#x60;&#x60;

### catalog.processors.githubOrg.providers

Type: array

The configuration parameters for each single GitHub org provider.

### catalog.processors.ldapOrg.providers

Type: array

The configuration parameters for each single LDAP provider.

### catalog.processors.microsoftGraphOrg.providers

Type: array

The configuration parameters for each single Microsoft Graph provider.

## [plugins/cost-insights/config.d.ts]

### costInsights.engineerCost

Type: number Visibility: frontend

No description.

### costInsights.products

Type: object

No description.

### costInsights.metrics

Type: object

No description.

## [plugins/fossa/config.d.ts]

### fossa.organizationId

Type: string Visibility: frontend

The organization id in fossa.

## [plugins/kafka-backend/config.d.ts]

### kafka.clientId

Type: string

Client ID used to Backstage uses to identify when connecting to the Kafka
cluster.

### kafka.clusters

Type: array

No description.

## [plugins/kubernetes-backend/schema.d.ts]

### kubernetes.serviceLocatorMethod

Type: string

No description.

### kubernetes.clusterLocatorMethods

Type: array

No description.

### kubernetes.clusters

Type: array

No description.

## [plugins/kubernetes/schema.d.ts]

### kubernetes.serviceLocatorMethod

Type: string Visibility: frontend

No description.

### kubernetes.clusterLocatorMethods

Type: array Visibility: frontend

No description.

### kubernetes.clusters

Type: array

No description.

## [plugins/proxy-backend/config.d.ts]

### proxy

Type: object

A list of forwarding-proxies. Each key is a route to match, below the prefix
that the proxy plugin is mounted on. It must start with a &#x27;/&#x27;.

## [plugins/rollbar-backend/config.d.ts]

### rollbar.accountToken

Type: string

The autentication token for accessing the Rollbar API

## [plugins/scaffolder-backend/config.d.ts]

### scaffolder.github.visiblity

Type: string

The visibility to set on created repositories.

### scaffolder.gitlab.api

Type: object

No description.

### scaffolder.gitlab.visiblity

Type: string

The visibility to set on created repositories.

### scaffolder.azure.baseUrl

Type: string

No description.

### scaffolder.azure.api

Type: object

No description.

### scaffolder.bitbucket.api

Type: object

No description.

### scaffolder.bitbucket.visiblity

Type: string

The visibility to set on created repositories.

## [plugins/sentry/config.d.ts]

### sentry.organization

Type: string Visibility: frontend

The &#x27;organization&#x27; attribute

## [plugins/rollbar/config.d.ts]

### rollbar.organization

Type: string Visibility: frontend

The Rollbar organization name. This can be omitted by using the
&#x60;rollbar.com/project-slug&#x60; annotation.

## [plugins/sonarqube/config.d.ts]

### sonarQube.baseUrl

Type: string Visibility: frontend

The base url of the sonarqube installation. Defaults to https://sonarcloud.io.

## [plugins/techdocs-backend/config.d.ts]

TechDocs schema below is an abstract of what&#x27;s used within techdocs-backend
and for its visibility to view the complete TechDocs schema please refer:
plugins/techdocs/config.d.ts

### techdocs.builder

Type: string

documentation building process depends on the builder attr attr:
&#x27;builder&#x27; - accepts a string value e.g. builder: &#x27;local&#x27;
alternative: &#x27;external&#x27; etc.

### techdocs.publisher.type

Type: string

attr: &#x27;type&#x27; - accepts a string value e.g. type: &#x27;local&#x27;
aleternatives: &#x27;googleGcs&#x27; etc.

### techdocs.storageUrl

Type: string

attr: &#x27;storageUrl&#x27; - accepts a string value e.g. storageUrl:
http://localhost:7000/api/techdocs/static/docs

## [plugins/techdocs/config.d.ts]

### techdocs.builder

Type: string Visibility: frontend

documentation building process depends on the builder attr attr:
&#x27;builder&#x27; - accepts a string value e.g. builder: &#x27;local&#x27;
alternative: &#x27;external&#x27; etc.

### techdocs.generators.techdocs

Type: string

attr: &#x27;techdocs&#x27; - accepts a string value e.g. type:
&#x27;docker&#x27; alternatives: &#x27;local&#x27; etc.

### techdocs.publisher

techdocs publisher information

### techdocs.requestUrl

Type: string Visibility: frontend

attr: &#x27;requestUrl&#x27; - accepts a string value e.g. requestUrl:
http://localhost:7000/api/techdocs

### techdocs.storageUrl

Type: string

attr: &#x27;storageUrl&#x27; - accepts a string value e.g. storageUrl:
http://localhost:7000/api/techdocs/static/docs
