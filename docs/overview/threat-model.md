---
id: threat-model
title: Backstage Threat Model
description: A document describing the threat model for Backstage.
---

The threat model outlines key security considerations of Backstage for operators, developers and security researchers. This is a living document and will evolve and be expanded alongside the Backstage project as relevant.

See [Security Policy and Advisories](https://github.com/backstage/backstage/security) in the Backstage GitHub repository for details on reporting security vulnerabilities and advisories on fixed security flaws.

## Trust Model

The Backstage trust model is divided into three groups with different trust levels.

An **internal user** is an authenticated user that generally belongs to the organization of a particular Backstage deployment. These users are trusted to the extent that they are not expected to compromise the availability of Backstage, but they are not trusted to not compromise data confidentiality or integrity.

An **integrator** is a user responsible for configuring and maintaining an instance of Backstage. Integrators are fully trusted, since they operate the system and database and therefore have root access to the host system. Additional measures can be taken by adopters of Backstage in order to restrict or observe the access of this group, but that falls outside of the current scope of Backstage.

Another group of de facto integrators is internal and external code contributors. When installing Backstage plugins you should vet them just like any other package from an external source. While it’s possible to limit the impact of for example a supply chain attack by splitting the deployment into separate services with different plugins, the Backstage project itself does not aim to prevent these kinds of attacks or in any other way sandbox or limit the access of plugins.

An **external user** is a user that does not belong to the other two groups, for example a malicious actor outside of the organization. The security model of Backstage currently assumes that this group does not have any direct access to Backstage, and it is the responsibility of each adopter of Backstage to make sure this is the case.

## Integrator Responsibilities

As an integrator of Backstage you yourself are responsible for protecting your Backstage installation from external and unauthorized access. The sign-in system in Backstage does not exist to limit access, only to inform the system of the identity of the user. There are some plugins that have more fine-grained access control through the permissions system, but the primary purpose of that system is to restrict access to resources for internal users rather than Backstage as a whole. A common and recommended way to protect a Backstage deployment from unauthorized access is to deploy it behind an authenticating proxy such as AWS’s ALB, GCP’s IAP, or Cloudflare Access.

Other responsibilities include protecting the integrity of configuration files as it may otherwise be possible to introduce vulnerable configurations, as well as the confidentiality of configured secrets related to Backstage as these typically include authentication details to third party systems.

The integrator is ultimately responsible for auditing usage of internal and external plugins as these run on the host system and have access to configuration and secrets. When installing plugins from sources like NPM, you should vet these in the same way that you would vet any other package installed from that source.

The integrator is also responsible for maintaining the resolved NPM dependencies of their Backstage project. This involves ensuring that `yarn.lock` receives updated versions of packages that have vulnerabilities, when those fixed versions are in range of what the Backstage packages request in their respective `package.json` files. This is commonly done by employing automated tooling such as [Dependabot](https://dependabot.com/), [Snyk](https://snyk.io/), and/or [Renovate](https://docs.renovatebot.com/) on your own repository. When fixed versions exist that are _not_ in range of what Backstage packages request, or when larger operations such as switching out an entire dependency for another one is required, maintainers collaborate with contributors to try to address those dependency declarations in the main project as soon as possible.

## Common Backend Configuration

There are many common facilities that are configured centrally and available to all Backstage backend plugins. For example there is a `DatabaseManager` that provides access to a SQL database, `TaskScheduler` for scheduling long-running tasks, `Logger` as a general logging facility, and `UrlReader` for reading content from external sources. These are all configured either directly in code, or within the `backend` block of the static configuration. The appropriate care needs to be taken to ensure that any secrets remain confidential and no malicious configuration is injected.

In a typical Backstage setup, there is no boundary between plugins that run on the same host. Likewise, there is no boundary between plugins that share the same database access. Any plugin that is running on a host that has access to the logical database of any other plugin should be considered to have full access to that other plugin. For example, even if you deploy the `auth` and `catalog` plugins on separate hosts with separate configuration and credentials, the `catalog` plugin is still considered to have full access to the `auth` plugin as long as the `catalog` plugin has access to the `auth` plugin's logical database. The only way to create a boundary between the two plugins is to deploy them in such a way that they do not have access to each others’ database. This applies to the database facility as well as any other shared resources, such as the cache.

The `UrlReader` facility is of particular interest for a secure Backstage configuration. In particular the `backend.reading.allow` configuration lists the hosts that you trust the backend to be able to read content from on behalf of users. It is extremely important that this list does not, for example, allow access to instance metadata endpoints of cloud providers, or other endpoints that your Backstage instance may have access to which contain sensitive information. In general it is recommended to keep the list minimal and only allow reading from required endpoints. The same concerns apply to custom implementations of the `UrlReader` interface, if you need to implement these through code.

Note that the `UrlReader` system operates with a service context and is not integrated with the Backstage permission system or other external access control mechanisms. This means users of your Backstage instance may be able to read external content which that individual should not have access to. For example, the `$text` placeholder in a `catalog-info.yaml` can be used to read contents from a source such as a GitHub repository that the user does not have direct access too. If this is a concern it is recommended to either disable or replace the resolvers in the catalog placeholder processor and similar features in any other plugin.

## Authentication

Backstage provides authentication of users through the `auth` plugin, which primarily acts as an authorization server for different OAuth 2.0 provider integrations. These integrations can both serve the purpose of signing users into Backstage, as well as providing delegated access to external resources, and are all subject to the common concerns of implementing secure OAuth 2.0 authorization servers. All auth provider integrations are disabled by default, and need to be enabled through configuration in order to be used. For each Backstage installation it is recommended to only enable the minimal set of providers that are in use by that instance.

It is not within scope of the `auth` backend to protect against unauthorized access, that is something that needs to be handled at a deployment level. See the [Integrator Responsibilities](#integrator-responsibilities) section for more information.

In order to use an auth provider to sign in users into Backstage, it needs to be configured with an [Identity resolver](https://backstage.io/docs/auth/identity-resolver), which is a custom callback implemented in code. The identity resolver is a sensitive part of configuring Backstage and it is important that it always resolves user identities correctly, based on information provided by the authentication provider. There are a number of built-in identity resolvers that can simplify configuration, and it is important that these all resolve users in a secure way, regardless of how they are used.

As part of signing in with an identity resolver, a Backstage Token is issued containing the resolved user identity. The tokens are asymmetrically signed JSON Web Tokens, with the public keys available to any service that wishes to verify a token. The signing keys are rotated continuously and are unique to each installation of Backstage, meaning that Backstage Tokens are not shared across installations. The token contains claims for the user identity and ownership information, which can be used to determine what Backstage resources are owned by that user or group. It is important that this token can not be forged outside of the `auth` plugin, with the exception of other plugins deployed in the same backend service or sharing the same database. For a high-security deployment, the `auth` backend should therefore be deployed in a separate service with its own database.

The token is used to prove the identity of the user within the Backstage system, and is used throughout Backstage plugins to control access. It is important that the ownership resolution logic is consistent across the entire Backstage ecosystem, with no possibility of misinterpreting the ownership information.

For cross-backend communication, the Backstage Token is typically forwarded or, in strict backend-to-backend communication without a user party, the backend itself issues a service token based on a pre-shared secret which is then validated on the receiving end. There are no unique service identities tied to these tokens at this point, meaning the tokens can be used across all services in a Backstage installation. This is something that we aim to improve in the future.

Backstage also supports authentication through a proxy where the user identity is read from the incoming request from the proxy, which has been decorated by an authenticating reverse proxy such as [AWS ALB](https://aws.amazon.com/elasticloadbalancing/application-load-balancer/). The following proxy auth providers verify the signature of incoming requests, and are therefore safe to deploy with direct access by users: `awsAlb`, `cfAccess`, and `gcpIap`. Providers like `oauth2Proxy` does not verify the incoming request and can therefore be spoofed by a malicious internal user to supply the `auth` backend with forged identity information. It’s therefore highly recommended to restrict access to the `oauth2Proxy` endpoints, or use a different provider.

## Catalog

Integrators should configure [catalog rules](https://backstage.io/docs/features/software-catalog/configuration#catalog-rules) to limit the allowed entity kinds that users can define. In general it is best to restrict definition of User, Group, and Template entities so that internal users cannot register additional ones. Template entities define actions that are executed on the backend hosts, and while the goal is for these actions to be secure regardless of input, it is still a more sensitive context and it is recommended that you protect it with additional checks. It is very important to not allow registration of User and Group entities if you ingest and rely on these as organizational data in your catalog. Doing so could otherwise open up for the ability to impersonate users and confuse group membership information. You should always ingest organizational data using a statically configured catalog location or an entity provider reading from a trusted source. The entities emitted directly by an entity provider are always trusted and rules are not applied to them, but any entities produced further down the chain are still subject to the rules.

The Catalog does not aim to protect against resource exhaustion attacks in its default setup. If you need to prevent your internal users from being able to register large amounts of entities, then it is recommended to disable entity registration and use a different approach for discovering entities. One way to mitigate any resource exhaustion attacks is to only allow the catalog to read from trusted SCM sources that have an audit trail. Catalog currently lacks limits for entity hierarchy depth and entity size, which we hope to address in the future.

By default all internal users are allowed to create and delete entities. If this does not fit your organization's needs it is recommended to enable and configure the [permission](https://backstage.io/docs/permissions/overview) system to restrict these operations.

## Scaffolder

By default, Scaffolding jobs execute directly on the host machine, including any actions defined in the template. Because the Scaffolder templates are considered a more sensitive area it is recommended to control access to create and update templates to trusted parties. Template execution is intended to be secure regardless of input, but we still recommend this additional layer of protection. The string templating is executed in a [node VM sandbox](https://github.com/laverdet/isolated-vm) to mitigate the possibility of remote code execution attacks.

The Scaffolder often has elevated permissions to for example create repositories in a Github organization. The integrator should therefore be cautious of Scaffolder Templates that for example delete or update existing resources as the user input is typically user defined and can therefore delete or modify resources maliciously or by mistake.

One strategy that allows you to reduce the access that the Scaffolder service has is to rely on user credentials when executing actions. For example, a GitHub App integration could be configured with read-only permissions, with a separate user OAuth token used to create repositories. This requires that your users have access to create repositories in the first place.

The integrator should audit installed scaffolding actions just like any other plugin package. It is also important to verify that installed actions fall in line with your own security requirements, as some actions might be intended for more relaxed environments.

By default all internal users are allowed to execute templates in the scaffolder. If this does not fit your organization's needs it is recommended to enable and configure the [permission](https://backstage.io/docs/permissions/overview) system to restrict these operations.

## TechDocs

TechDocs' backend can be broadly configured in two ways. The default is when `techdocs.builder` is set to `local`, in which documentation is generated on-demand and stored locally by the TechDocs backend. When `techdocs.builder` is set to `external` instead, documentation is assumed to be generated by an external process (e.g. in a CI/CD pipeline), and merely read from a configured external storage provider.

When documentation is generated locally, integrators are responsible for ensuring secure configuration of file system permissions in the location where generated assets are stored. When documentation is generated externally, integrators are responsible for access control and permissioning between the external process that generates the documentation, the storage provider where documentation assets are published, and the TechDocs backend.

Regardless of backend configuration, the TechDocs frontend does not trust the generated HTML of any documentation sites and therefore applies a strict sanitization process before rendering out any content to users.

By default, all TechDocs documentation is visible to all Backstage users. Access can be restricted to TechDocs sites by configuring view permissions for the Catalog.

## Proxy

The proxy backend acts as a utility for frontend plugins to access remote services that may not be set up to receive traffic directly from the Backstage frontend. Typical reasons for this would be that the upstream service does not provide the appropriate CORS headers or does not serve its content over HTTPS.

The proxy entries are configured through static configuration. Each entry has a mount path and an upstream target, and also supports other options such as limiting the allowed methods, or injecting additional headers. It is recommended to avoid injecting authentication headers for upstream services, as this is a risky way to decorate requests with credentials. Anyone with access to your Backstage deployment will be able to make requests to the upstream service using the injected credentials. It is recommended that you instead create a backend plugin that forwards individual requests to the upstream service in a secure way. In case you do end up injecting credentials into upstream requests, be sure that you are not exposing any sensitive information or actions. You should also restrict the access as much as possible, for example using the `allowedMethods` option to limit the methods that can be used, and using tokens with the minimum required authorization scope.
