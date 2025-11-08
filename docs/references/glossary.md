---
id: glossary
title: Glossary
description: List of terms, abbreviations, and phrases used in Backstage, together with their explanations.
---

## Access Token

A [token](#token) that represents the authorization to access resources on behalf of the end-user in a way that hides the user's actual identity. It will commonly have a short expiry time, and be limited to a set of [scopes](#scope). Part of the [OAuth](#oauth) protocol, see [their docs](https://oauth.net/2/access-tokens/) for details.

## Administrator

Someone responsible for installing, configuring, and maintaining a Backstage [app](#app) for an organization. A [user role](#user-role).

## API

A software interface consisting of defined rules, protocols, and tools, that allows two applications or [components](#component-catalog-plugin) to communicate and exchange data or functionality.

APIs are key abstractions that allow large software ecosystems to be scaled efficiently. Within the Backstage model, APIs are first-class citizens, and are the primary method for discovering existing functionality across the ecosystem. See [Backstage System Model](https://backstage.io/docs/features/software-catalog/system-model/#api).

## App

An installed instance of Backstage. An app can be local, intended for a single developer or development group, or organizational, for use by an entire enterprise.

## Authentication

The process of verifying the identity of a user, system, or entity attempting to access a resource, system, or network. It answers the question: "Are you who you claim to be?" See [this Wikipedia article](https://en.wikipedia.org/wiki/Authentication) for more details.

## Authorization

The process of determining which operations an authenticated user or system is allowed to perform within a system, application, or resource. It comes after authentication, and answers the question: "What are you allowed to access or do?" It involves assigning specific privileges, access rights, or roles to the user. See [this Wikipedia article](https://en.wikipedia.org/wiki/Authorization) for more details.

## Authorization Code Grant

See [Code Grant](#code-grant).

## Backstage

1. An open source framework for creating and deploying [developer portals](#developer-portal), originally created at Spotify. Backstage is an incubation-stage open source project of the [Cloud Native Computing Foundation](#cloud-native-computing-foundation-aka-cncf).

2. [The Backstage Framework](#backstage-framework).

## Backstage Framework

The actual framework that Backstage [plugins](#plugin) sit on. The framework spans the frontend and backend, and includes core functionality such as declarative integration, config reading, database management, and much more.

## Bundle

1. A collection of [deployment artifacts](#deployment-artifacts).

2. The output of the bundling process, which brings a collection of [packages](#package) into a single collection of [deployment artifacts](#deployment-artifacts).

## Catalog

See [Software Catalog](#software-catalog).

## Cloud Native Computing

A set of technologies that "empower organizations to build and run scalable applications in modern, dynamic environments such as public, private, and hybrid clouds. Containers, service meshes, microservices, immutable infrastructure, and declarative APIs exemplify this approach." ([CNCF Cloud Native Definition v1.1](https://github.com/cncf/toc/blob/main/DEFINITION.md)).

## Cloud Native Computing Foundation (aka CNCF)

A foundation dedicated to the promotion and advancement of [Cloud Native Computing](#cloud-native-computing). The mission of the Cloud Native Computing Foundation (CNCF) is "to make cloud native computing ubiquitous" ([CNCF Charter](https://github.com/cncf/foundation/blob/main/charter.md)).

CNCF is part of the [Linux Foundation](https://www.linuxfoundation.org/).

## Code Grant

In the context of [OAuth 2.0](https://oauth.net/2/), refers to the process where an application receives an [authorization code](#authorization-code-grant) after a user grants it permission to access their resources. This code is then exchanged for an [access token](#access-token) and possibly a [refresh token](#refresh-token), which the application uses to access the user's data on their behalf. It's a secure way for applications to access protected resources without directly handling the user's credentials. See the [OAuth docs](https://oauth.net/2/grant-types/authorization-code/) for details.

## Collator (search plugin)

A specialized component of Backstage that's responsible for ordering or indexing data according to a specific set of rules. In Backstage search, collators are used to define what can be searched. Specifically, they're readable object streams of documents that contain a minimum set of fields (including document title, location, and text), but can contain any other fields as defined by the collator itself. A single collator is responsible for defining and collecting documents of a specific type.

Backstage includes "default" collators for Catalog and TechDocs that you can use out-of-the-box to start searching across Backstage quickly. More collators are available from the Backstage community. Learn more at [Collators](https://backstage.io/docs/features/search/collators).

## Component (catalog plugin)

1. A modular, independent, reusable software-based unit that encapsulates specific functionality. It has well-defined interfaces, explicitly specified dependencies, and is designed to be integrated with other components to build larger software systems.

2. A software product that Backstage manages in the [Software Catalog](#software-catalog). A component can be a service, website, library, data pipeline, or any other software artifact that's managed as a single entity.

A Backstage component can implement [API](#api)s for other components to consume. In turn, it might consume APIs implemented by other components, or directly depend on components or resources that are attached to it at runtime.

See the [Backstage System Model](https://backstage.io/docs/features/software-catalog/system-model/#component-catalog-plugin).

## Condition (permission plugin)

A criterion, evaluated on an entity, that a user must meet to be granted permission to perform an action on that entity within a permission plugin. Examples might include `isOwner` or `hasRole`.

## Conditional Decision (permission plugin)

A [decision](#policy-decision-permission-plugin) mechanism, common in permission plugins, that evaluates real-time conditions (predicates) on a per-user basis to determine access or actions against a [resource](#resource-permission-plugin). This enables highly granular, context-aware control. See [Conditional Decisions](https://backstage.io/docs/permissions/concepts/#conditional-decisions).

## Contributor

A volunteer who helps to improve an open source product such as Backstage. This volunteer effort includes coding, testing, technical writing, user support, and other work. A [user role](#user-role).

## Declarative Integration

A new paradigm for Backstage frontend plugins, allowing definition in config files instead of hosting complete React pages. See [the Frontend System](https://backstage.io/docs/frontend-system).

## Decorator (search plugin)

A transform stream that operates during the indexing process, positioned between a [Collator](#collator-search-plugin) (read stream) and an Indexer (write stream). Document Decorators are used to modify documents by adding, removing, or filtering metadata, or even injecting new documents, as they are being prepared for the search index.

To illustrate, while the [Software Catalog](#software-catalog) understands software entities, it might not track their usage or quality. A decorator can add this extra metadata, which can then be used to bias search results or enhance the search experience within your Backstage instance.

## Deployment Artifacts

An executable or [package](#package) file with all of the necessary information required to deploy at runtime. Deployment artifacts can be hosted on [package registries](#package-registry).

## Developer

1. A professional who designs, builds, tests, deploys, and maintains software applications and systems. Developers essentially turn ideas or requirements into functional digital products.

2. A [user role](#user-role) defined as someone who creates, modifies, or uses a Backstage [app](#app). Might or might not actually be a software developer.

## Developer Portal

1. A centralized, self-service interface providing developers with all the necessary resources, tools, documentation, and information to effectively build, integrate, deploy, and manage software products within an organization.

2. Backstage is a specific example of a developer portal, designed as a centralized system with a user interface and database to streamline development and maintenance of an organization's software projects. It features a robust [Software Catalog](#software-catalog) that centralizes and organizes access to the organization's services, websites, mobile features, libraries, and other software components. Backstage also includes [Software Templates](#software-templates-aka-scaffolder) that simplify the creation of new projects and components.

Backstage is both a developer portal and a plugin-based framework for creating new custom developer portals.

## Document (search plugin)

1. A piece of information or data that is recorded on some medium for the purpose of retention and conveyance.

2. An abstract representation of information or data that can be discovered and retrieved. For search purposes, a document might represent a software entity, a TechDocs page, or any other type of data that is indexed. In Backstage, a document is structured with metadata fields that must include at least a title, a body (containing its core text content), and a location (such as a URL pointing to its source).

## Domain

1. A collection of systems that share terminology, domain models, metrics, KPIs, business purpose, or documentation; that is, it forms a bounded context.

2. Typically the unique, human-readable address that is used to identify websites, email servers, and other resources on the internet, such as `google.com` or `example.store`. More narrowly, it can refer to the Top-Level Domain (TLD), which is the part of a web address after the last dot, such as `.com` or `.org`; the country code, such as `.us` or `.uk`; or the sponsored TLD such as `.gov` or `.edu`.

3. An area that relates systems or entities to a business unit. See [Domain](https://backstage.io/docs/features/software-catalog/system-model/#domain) in the [System Model](https://backstage.io/docs/features/software-catalog/system-model/).

## Entity

1. Something that exists as a separate and distinct unit. Its existence can be real or abstract, physical or conceptual, persistent or ephemeral.

2. What is cataloged in the Backstage [Software Catalog](#software-catalog). An entity is identified by a unique combination of [kind](#kind), [namespace](#namespace-catalog-plugin), and name. See [The Life of an Entity](https://backstage.io/docs/features/software-catalog/life-of-an-entity) for related key concepts and how it's handled.

## Evaluator

Someone who assesses whether Backstage is a suitable solution for their organization and needs. The only [user role](#user-role) with a pre-deployment [use case](#use-case).

## ID Token

A security token used in authentication processes, primarily defined by the [OpenID Connect (OIDC) standard](#openid-connect-aka-oidc). Its main purpose is to prove that a user has been successfully authenticated by an identity provider. See [JSON Web Token](#json-web-token-aka-jwt).

## Index (search plugin)

A collection of [documents](#document-search-plugin) that a search engine uses to quickly locate relevant information within your developer portal. It's essentially a lookup table that allows you to quickly find documents without having to scan the entire dataset.

## Indexer (search plugin)

In Backstage's Search Platform, the term _indexer_ isn't a component or concept that developers typically interact with. Instead, it refers to the overall process or the _write stream_ within the Search backend that takes processed documents and adds them to the chosen search engine's index.

To understand _indexer_ in Backstage, it's helpful to understand the flow of data into the Search system:

1. A [Collator](#collator-search-plugin) reads raw data from a specific source and transforms it into a stream of [documents](#document-search-plugin), where each document is formatted in a way the search platform understands (e.g., having title, text, location fields, and potentially other metadata).

2. As the stream of documents flows from the collator, a [decorator](#decorator-search-plugin) can intercept them. The decorator optionally adds, removes, or modifies fields within the documents to enrich them with context that the original collator might not have (such as adding ownership information from the Catalog to TechDocs documents).

3. After optional decoration, the stream of finalized search documents is then written to the search engine's index. This is what the term _indexer_ implicitly refers to. It's the functionality that takes these structured documents and inserts them into the chosen search engine (like Lunr, PostgreSQL, or Elasticsearch) so they become searchable.

The `plugin-search-backend-node` package in Backstage is responsible for orchestrating this entire indexing process. It manages the collators, decorators, the connection to the specific search engine, and the scheduling of when these indexing tasks run.

## Integrator

1. Someone who develops one or more plugins that enable Backstage to interoperate with another software system. A [user role](#user-role).

2. May refer to someone who develops software that integrates with Backstage.

## JSON Web Token (aka JWT)

A popular, compact, and self-contained open standard for securely transmitting information between parties as a JSON object. It is commonly used to verify a user's identity ([authentication](#authentication)) and permissions ([authorization](#authorization)). Each JWT consists of a header, payload, and digital signature separated by dots. JWTs are often encrypted, and are always signed for integrity.

This standard is a key component of [OpenID Connect](#openid-connect-aka-oidc). For more details, see [this Wikipedia article](https://en.wikipedia.org/wiki/JSON_Web_Token).

## Kind

Classification of an [entity](#entity) in the Backstage Software Catalog, for example _service_, _database_, or _team_. An element of the [kind|namespace|name triplet](#kind-namespace-name-triplet) that is an important concept for uniqueness.

## Kind|namespace|name triplet

The primary reference for [Software Catalog](#software-catalog) entities. It is human-readable and should be unique across your Backstage instance.

## Kubernetes (Backstage plugin)

A core Backstage plugin enabling a service owner-focused view of Kubernetes resources.

## Kubernetes (CNCF Project)

Kubernetes (K8s) is an open-source platform that automates the deployment, scaling, and management of containerized applications. Originally developed at Google to manage its production workloads, it was later offered to the [Cloud Native Computing Foundation (CNCF)](#cloud-native-computing-foundation-aka-cncf) for open-source support and maintenance.

According to its [official website](https://kubernetes.io/), Kubernetes automatically handles rollouts, rollbacks, and load balancing. It mounts storage systems, dynamically allocates containers based on resource requirements and other constraints, manages batch execution, restarts crashed containers, and more. For additional information, see the [Kubernetes article](https://en.wikipedia.org/wiki/Kubernetes) on Wikipedia.

## Local Package

One of the [packages](#package) within a [monorepo](#monorepo). A package may or may not also be published to a [package registry](#package-registry).

## Monorepo

1. A single repository for a collection of related software projects, such as all projects belonging to an organization.

2. A project layout that consists of multiple [packages](#package) within a single project, where packages are able to have local dependencies on each other. Often enabled through tooling such as [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)

## Name

To be completed. An element of the [kind|namespace|name triplet](#kind-namespace-name-triplet) that is an important concept for uniqueness.

## Namespace (catalog plugin)

An optional attribute that can be used to organize [entities](#entity). An element of the [kind|namespace|name triplet](#kind-namespace-name-triplet) that is an important concept for uniqueness.

## OAuth

Refers to [OAuth 2.0](https://oauth.net/2/), an industry-standard authorization framework that allows a website or application (the "client") to access protected resources (like user data or functionality) on a different service (the "resource server") on behalf of a user (the "resource owner"), without sharing the user's login credentials with the client application.

See [OAuth 2.0 explained](https://connect2id.com/learn/oauth-2) for descriptions of OAuth 2.0 and [OIDC](#openid-connect-aka-oidc) (which is built on top of OAuth 2.0).

## Objective

A high-level goal of a [user role](#user-role) interacting with Backstage. For example, some objectives of the [administrator](#administrator) user role are to maintain an instance ([app](#app)) of Backstage, to add and update functionality via plugins, and to troubleshoot issues.

## Offline Access

[OAuth 2.0](https://oauth.net/2/) flow that results in both a [refresh token](#refresh-token) and an [access token](#access-token), where the refresh token has a long expiration or never expires, and can be used to request more access tokens in the future. This lets the user go "offline" with respect to the token issuer, but still be able to request more tokens at a later time without further direct interaction for the user.

## OpenID Connect (aka OIDC)

A layer on top of [OAuth 2.0](https://oauth.net/2/) which standardises authentication. See [this Wikipedia article](https://en.wikipedia.org/wiki/OpenID_Connect) for details.

## OSS

Open source software.

## Package

1. A bundled collection of executable files, libraries, configuration files, metadata, and other necessary components that allow a piece of software (or a group of related software) to be easily installed, managed, and used. It's a standardized format for distributing software that simplifies installation by ensuring all dependencies are included or easily resolvable, provides integrity checks, and enables easy upgrades or removal.

2. A package in the Node.js ecosystem, often published to a [package registry](#package-registry).

## Package Registry

A service that hosts [packages](#package). The most prominent example is [NPM](https://www.npmjs.com/).

## Package Role

The declared role of a package, see [package roles](https://backstage.io/docs/tooling/cli/build-system#package-roles).

## Permission

Specific rules or settings that define the level of access and types of actions that a user, group, or system process is allowed to perform on a particular resource. Permissions are a core component of authorization that determine "what you can do" after you've been authenticated. Permissions are properties of objects or resources. Closely related to [Privilege](#privileges) (the terms are often used interchangeably).

## Permission (permission plugin)

1. A core Backstage plugin and framework that allows actions to be limited to specific users.

2. A rule that determines whether a user is authorized to access a specific [resource](#resource-permission-plugin) or set of resources if a specified set of conditions exists.

By default, Backstage endpoints are unprotected; any user can perform any action on any resource. The Permission framework addresses this by enabling integrators to configure rules that specify precisely which users can access which resources and actions. Within this framework, a _permission_ is a uniquely named set of rules (or _conditions_) and the results to return based on their evaluation.

An example might be a permission rule that returns `false` if an entity is not part of a system, where the entity and system are configured for the rule. (See [Defining custom permission rules](https://backstage.io/docs/permissions/custom-rules) for the example.)

See the Permissions [Overview](https://backstage.io/docs/permissions/overview) and [Concepts](https://backstage.io/docs/permissions/concepts/) for details.

## Persona (use cases)

Alternative term for a [User Role](#user-role).

## Plugin

The fundamental building block that adds specific features, functionalities, and integrations to your developer portal. All functionality outside of [the Backstage framework](#backstage-framework), even core features, are implemented as plugins. This modular architecture is a key differentiator of Backstage, making it highly customizable and extensible.

A plugin is a self-contained unit of code designed to perform a specific task or integrate with an external system. Instead of a monolithic application, Backstage is assembled from a collection of these independent plugins.

A single logical plugin often consists of both a frontend (UI) component and a backend (API) component.

- Frontend plugins are typically written in React and TypeScript to provide the user interface elements such as pages, cards, sidebar items, and dashboards that developers interact with.
- Backend plugin are written in Node.js and TypeScript, and handle data fetching, business logic, integrations with external services (like Git providers, CI/CD systems, and cloud platforms), and expose APIs for the frontend to consume.

There are different types of plugins (run `yarn new` to see them). The current list includes:

- `plugin` - A new frontend plugin
- `backend-plugin` - A new backend plugin
- `backend-module` - A new backend module
- `web-library` - A new web-library package
- `plugin-common` - A new isomorphic common plugin package
- `plugin-node` - A new `Node.js` library plugin package
- `plugin-react` - A new web library plugin package

See [Introduction to Plugins](https://backstage.io/docs/plugins/) for how to create a plugin, suggest a plugin, and integrate a plugin into the Software Catalog. See [Create a Backstage Plugin](https://backstage.io/docs/plugins/create-a-plugin/) for how to create a frontend plugin.

See [Plugin directory](https://backstage.io/plugins/) for a list of community driven plugins, although there is a community plugins repository that contains many more that might not be in that page.

## Policy (permission plugin)

The central component of the Backstage permission framework that dictates who can do what, to which resources, and under what conditions.

Backstage policies are implemented as functions or sets of rules that receive a request (containing information about a user and a desired permission/action on a resource) and return an authorization decision (allow, deny, or a conditional decision). Policies are independent of the [authorization](#authorization) model, such as role-based access control or attribute-based access control. See [Policy](https://backstage.io/docs/permissions/concepts/#policy-permission-plugin).

Policies are defined in Typescript code in the permissions framework. See [Writing a permission policy](https://backstage.io/docs/permissions/writing-a-policy) for examples.

## Policy Decision (permission plugin)

A specific response to a user's request to perform an action on a list of [resources](#resource-permission-plugin). Can be either `Approve`, `Deny` or `Conditional`. In Backstage, policies are only responsible for decisions regarding whether requests can be approved; the requestors (typically the backend) are responsible for enforcing those decisions. See [Policy decision versus enforcement](https://backstage.io/docs/permissions/concepts/#policy-decision-versus-enforcement).

## Popup

A separate browser window that opens on top of the previous one.

## Privileges

The term _privilege_ is not a defined abstraction in the context of the Backstage permission framework's core concepts. Instead, Backstage's authorization model is built around [permissions](#permission), [policies](#policy-permission-plugin), and [conditions](#condition-permission-plugin) to determine what actions a user can take on a resource. If you encounter _privilege_ in a Backstage context, it's likely being used in a more general, colloquial sense of "level of access" or referring to a concept.

Outside of Backstage contexts, _privilege_ typically refers to specific rules or settings that define what a user or process is allowed to do within the system, often relating to system-wide operations or capabilities. Privilege is closely related to [Permission](#permission); the terms are often used interchangeably.

## Procedure (use cases)

A set of actions that accomplish a goal, usually as part of a [use case](#use-case). A procedure can be high-level, containing other procedures, or can be as simple as a single [task](#task-use-cases).

## Query Translators (search plugin)

An abstraction layer between a search engine and the [Backstage Search](#search) backend. It is an optional backend component that takes an abstract search query---which includes search terms, filters, and desired document types from a Backstage search client—--and transforms it into a concrete query that's optimized for a specific [Search Engine](#search-engine-backstage-search) used by Backstage.

This translation layer is crucial because it enables Backstage components to utilize the distinct features of individual search engines (like Elasticsearch or Solr) while maintaining loose coupling from their detailed interfaces. Although Backstage's pre-packaged Search Engines come with simple, built-in translators, you can implement custom Query Translators to significantly enhance and tune search results for your organization's unique context.

## Refresh token

A special token that an [OAuth](#oauth) client can use to get a new [access token](#access-token) when the latter expires. See [OAuth Refresh Tokens](https://oauth.net/2/refresh-tokens/).

## Resource (catalog plugin)

An [entity](#entity) that represents a piece of physical or virtual infrastructure, such as a database, that's required by a component. See the [System Model](https://backstage.io/docs/features/software-catalog/system-model).

## Resource (permission plugin)

A representation of an object that a user interacts with and that can be permissioned. Not to be confused with [Software Catalog resources](#resource-catalog-plugin).

## Role

See [User Role](#user-role).

## Rule (permission plugin)

A specific type of dynamic access control associated with a [resource](#resource-permission-plugin) it protects. A simple example might be "the current user can access Resource X if Condition Y is true." The catalog plugin defines a resource for catalog entities and rules to check if an entity has a given annotation.

## Scaffolder

Another name for [Software Templates](#software-templates-aka-scaffolder). (The term comes from the use of Software Templates as _scaffolds_ for building new components and projects.)

## Scope

A string that describes a certain type of access that can be granted to a user using [OAuth](#oauth), usually in conjunction with [access tokens](#access-token).

In [OAuth](#oauth), access control is managed through _scopes_ that define specific permissions granted to the application. An OAuth service can issue Access Tokens that are tied to particular sets of scopes, such as viewing profile information, or reading or writing user data. The format and handling of scopes are unique to each OAuth provider, with available scopes typically detailed in their authentication solution's documentation (see [https://developers.google.com/identity/protocols/oauth2/scopes](https://developers.google.com/identity/protocols/oauth2/scopes) for an example).

For more information about scopes and OAuth, see [OAuth and OpenID Connect](https://backstage.io/docs/auth/oauth/).

## Search

A Backstage plugin that provides a framework for searching a Backstage [app](#app), including the [Software Catalog](#software-catalog) and [TechDocs](#techdocs). A core feature of Backstage.

## Search Engine (Backstage search)

Existing search technology that [Backstage Search](#search) can take advantage of through its modular design. Lunr is the default search in Backstage Search. Can be one of the search engines that are pre-packaged with Backstage or chosen specifically for your instance.

## Software Catalog

1. A centralized system that keeps track of ownership and metadata for all software in your ecosystem (services, websites, libraries, data pipelines, etc.). The catalog is built around metadata YAML files that are stored with the code, and are harvested and visualized in Backstage.

2. The Backstage plugin that implements the Software Catalog feature. A core feature of Backstage.

The Software Catalog is a core feature of Backstage. See [Backstage Software Catalog](https://backstage.io/docs/next/features/software-catalog/) for an overview, the life of an entity in the catalog, how to configure the catalog, its architecture and high-level design, how to configure and customize it, and its API. The overview describes how the catalog works, how to add components to it, how to find software in it, and more.

## Software Templates (aka Scaffolder)

1. A "skeleton" software project created and managed in the Backstage Software Templates tool.

2. A Backstage plugin for creating [components](#component-catalog-plugin) in Backstage. By default, it has the ability to load skeletons of code, template in some variables, and then publish the template to some locations like GitHub or GitLab.

Software Templates is a core feature of Backstage. It's also known as the [Scaffolder](#scaffolder) for its utility in building new software components and projects. See [Backstage Software Templates](https://backstage.io/docs/features/software-templates/) for an overview, how to configure it, add your own templates, write a template, test it, and more. The overview describes such information as how to get started, choose a template, verify your inputs, run the template, and see a demo.

## System (catalog plugin)

A collection of [entities](#entity) that cooperate to perform a function. A system generally consists of a handful of components, resources, and private or public APIs. See [the catalog docs](https://backstage.io/docs/features/software-catalog/system-model).

## Task (use cases)

A low-level step-by-step [procedure](#procedure-use-cases) to achieve a particular result.

## TechDocs

A documentation solution for generating and managing technical documentation in Markdown files that are stored with software component code. A core feature of Backstage. See [TechDocs Documentation](https://backstage.io/docs/features/techdocs/).

## Token

A string containing information. The format and content depend on its purpose and how it's used.

## Use Case

A purpose for which a [user role](#user-role) interacts with Backstage. Related to [Objective](#objective): An objective is _what_ a user wants to accomplish; a use case is _how_ the user does it.

## User

Any consumer of Backstage or Backstage products/applications. This includes individuals like employees and contractors, as well as software that interacts with the backend through an API or acts as a proxy for a person by operating the user interface.

## User Role

A class of Backstage user who has permissions to use Backstage for a particular set of [use cases](#use-case). One of: [evaluator](#evaluator); [administrator](#administrator); [developer](#developer); [integrator](#integrator); and [contributor](#contributor).
