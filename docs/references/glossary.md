---
id: glossary
title: Glossary
description: List of terms, abbreviations, and phrases used in Backstage, together with their explanations.
---

## Access Token

A [token](#token) that gives access to perform actions on behalf of a user. It will commonly have a short expiry time, and be limited to a set of [scopes](#scope). Part of the [OAuth](#oauth) protocol, see [their docs](https://oauth.net/2/access-tokens/) for more information.

## Administrator

Someone responsible for installing, configuring, and maintaining a Backstage [app](#app) for an organization. A [user role](#user-role).

## API (catalog plugin)

An [entity](#entity) representing a schema that two [components](#component) use to communicate. See [the catalog docs](https://backstage.io/docs/features/software-catalog/system-model) for more information.

## App

An installed instance of Backstage. An app can be local, intended for a single development group or individual developer, or organizational, for use by an entire enterprise.

## Authentication

The process of verifying the identity of a user, system, or entity attempting to access a resource, system, or network. It answers the question: "Are you who you claim to be?" See [this Wikipedia article](https://en.wikipedia.org/wiki/Authentication) for more details.

## Authorization

The process of determining what an authenticated user or system is allowed to do within a system, application, or resource. It comes after authentication, and answers the question: "What are you allowed to access or do?" It involves assigning specific privileges or access rights or roles to the user. See [this Wikipedia article](https://en.wikipedia.org/wiki/Authorization) for more details.

## Authorization Code

A type of [OAuth flow](#oauth) used by confidential and public clients to get an [access token](#access-token). See [the OAuth docs](https://oauth.net/2/grant-types/authorization-code/) for more details.

## Backstage

1. An open source framework for creating and deploying [developer portals](#developer-portal), originally created at Spotify. Backstage is an incubation-stage open source project of the [Cloud Native Computing Foundation](#cloud-native-computing-foundation).

2. [The Backstage Framework](#backstage-framework).

## Backstage Framework

The actual framework that Backstage [plugins](#plugin) sit on. This spans both the frontend and the backend, and includes core functionality such as declarative integration, config reading, database management, and many more.

## Bundle

1. A collection of [deployment artifacts](#deployment-artifacts).

2. The output of the bundling process, which brings a collection of [packages](#package) into a single collection of [deployment artifacts](#deployment-artifacts).

## Catalog

1. The core Backstage plugin that handles ingestion and display of your organization's software products.

2. An organization's portfolio of software products managed in Backstage.

## Cloud Native Computing

A set of technologies that "empower organizations to build and run scalable applications in modern, dynamic environments such as public, private, and hybrid clouds. Containers, service meshes, microservices, immutable infrastructure, and declarative APIs exemplify this approach." ([CNCF Cloud Native Definition v1.0](https://github.com/cncf/toc/blob/main/DEFINITION.md)).

## Cloud Native Computing Foundation (AKA CNCF)

A foundation dedicated to the promotion and advancement of [Cloud Native Computing](#Cloud-Native-Computing). The mission of the Cloud Native Computing Foundation (CNCF) is "to make cloud native computing ubiquitous" ([CNCF Charter](https://github.com/cncf/foundation/blob/main/charter.md)).

CNCF is part of the [Linux Foundation](https://www.linuxfoundation.org/).

## Code Grant

[OAuth](#oauth) flow where the client receives an [authorization code](#code) that is passed to the backend to be exchanged for an [access token](#access-token) and possibly a [refresh token](#refresh-token).

## Collator (search plugin)

A transformer that takes streams of [documents](#documents) and outputs searchable texts. They're usually responsible for the data transformation and definition and collection process for specific [documents](#documents).

## Component (catalog plugin)

A software product that is managed in the Backstage [Software Catalog](#software-catalog). A component can be a service, website, library, data pipeline, or any other piece of software managed as a single project. See [the catalog docs](https://backstage.io/docs/features/software-catalog/system-model) for more information.

## Condition (permission plugin)

A mapping from a given entity to criteria a user must fulfill to perform an action on that entity. Examples include `isOwner`, `hasRole`, etc.

## Conditional Decision (permission plugin)

A type of [decision](#policy-decision-permission-plugin) that allows for per-user evaluation of [conditions](#condition-permission-plugin) against a [resource](#resource-permission-plugin). See [Conditional Decisions](../permissions/concepts.md#conditional-decisions)

## Contributor

A volunteer who helps to improve an OSS product such as Backstage. This volunteer effort includes coding, testing, technical writing, user support, and other work. A [user role](#user-role).

## Declarative Integration

A new paradigm for Backstage frontend plugins, allowing definition in config files instead of hosting complete React pages. See [the Frontend System](https://backstage.io/docs/frontend-system).

## Decorator (search plugin)

A transform stream that allows you to add additional information to [documents](#document-search-plugin).

## Deployment Artifacts

An executable or package file with all of the necessary information required to deploy the application at runtime. Deployment artifacts can be hosted on [package registries](#package-registry).

## Developer

1. A professional who designs, builds, tests, deploys, and maintains software applications and systems. Developers essentially turn ideas or requirements into functional digital products.

2. A [user role](#user-role) defined as someone who creates, modifies, or uses a Backstage [app](#app). Might or might not actually be a software developer.

## Developer Portal

A centralized system comprising a user interface and database used to facilitate and document all the software projects within an organization. Backstage is both a developer portal and (by virtue of being based on plugins) a framework for creating developer portals.

## Document (search plugin)

1. A piece of information or data that is recorded on some medium for the purpose of storing and conveying information.

2. An abstract concept representing something that can be found by searching for it. A document can represent a software entity, a TechDocs page, etc. Documents are made up of metadata fields, at a minimum -- a title, body (text), and location (as in a URL).

## Domain

1. A collection of systems that share terminology, domain models, metrics, KPIs, business purpose, or documentation; that is, it forms a bounded context.

2. An area that relates systems or entities to a business unit. See [the catalog docs](https://backstage.io/docs/features/software-catalog/system-model) for more information.

## Entity

1. Something that exists as a separate and distinct unit. Its existence can be real or abstract, physical or conceptual, persistent or ephemeral.

2. What is cataloged in the Backstage Software Catalog. An entity is identified by a unique combination of [kind](#Kind), [namespace](#Namespace), and name. See [the catalog docs](https://backstage.io/docs/features/software-catalog/system-model) for more information.

## Evaluator

Someone who assesses whether Backstage is a suitable solution for their organization. The only [user role](#user-role) with a pre-deployment [use case](#use-case).

## ID Token

A security token used in authentication processes, primarily defined by the [OpenID Connect (OIDC) standard](#openid-connect). Its main purpose is to prove that a user has been successfully authenticated by an identity provider.

See [JSON Web Token](#json-web-token).

## Index (search plugin)

A collection of [documents](#documents) of a given type.

## Indexer (search plugin)

A write stream of [documents](#documents).

## Integrator

Someone who develops one or more plugins that enable Backstage to interoperate with another software system. A [user role](#user-role).

## JSON Web Token (AKA JWT)

A popular, compact, and self-contained open standard for securely transmitting information between parties as a JSON object. It is commonly used to verify a user's identity [authentication](#authentication) and permissions [authorization](#authorization). Each JWT consists of a header, payload, and digital signature separated by dots. While often encrypted, JWTs are always signed for integrity. This standard is a key component of [OpenID Connect](#openid-connect). For more details, see [the Wikipedia article](https://en.wikipedia.org/wiki/JSON_Web_Token).

## Kind

Classification of an [entity](#Entity) in the Backstage Software Catalog, for example _service_, _database_, and _team_.

## Kubernetes (CNCF Project)

An open-source system for automating deployment, scaling, and management of containerized applications.

## Kubernetes (Backstage plugin)

A core Backstage plugin enabling a service owner-focused view of Kubernetes resources.

## Local Package

One of the [packages](#package) within a [monorepo](#monorepo). A package may or may not also be published to a [package registry](#package-registry).

## Monorepo

1. A single repository for a collection of related software projects, such as all projects belonging to an organization.

2. A project layout that consists of multiple [packages](#package) within a single project, where packages are able to have local dependencies on each other. Often enabled through tooling such as [lerna](https://lerna.js.org/) and [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)

## Namespace (catalog plugin)

An optional attribute that can be used to organize [entities](#entity).

## Objective

A high-level goal of a [user role](#User-Role) interacting with Backstage. Some goals of the _administrator_ user role, for example, are to maintain an instance ("app") of Backstage; to add and update functionality via plugins; and to troubleshoot issues.

## OAuth

Refers to: OAuth 2.0, a standard protocol and framework for granting third-party applications access to their data on other websites or services without sharing their passwords. See [oauth.net/2/](https://oauth.net/2/).

## Offline Access

[OAuth](#oauth) flow that results in both a refresh token and [access token](#access-token), where the refresh token has a long expiration or never expires, and can be used to request more access tokens in the future. This lets the user go "offline" with respect to the token issuer, but still be able to request more tokens at a later time without further direct interaction for the user.

## OpenID Connect

A layer on top of [OAuth](#oauth) which standardises authentication. See [the Wikipedia article](https://en.wikipedia.org/wiki/OpenID_Connect) for more details.

## OSS

Open source software.

## Package

A package in the Node.js ecosystem, often published to a [package registry](#package-registry).

## Package Registry

A service that hosts [packages](#package). The most prominent example is [NPM](https://www.npmjs.com/).

## Package Role

The declared role of a package, see [package roles](../tooling/cli/02-build-system.md#package-roles).

## Permission

Specific rules or settings that define the level of access and types of actions that a user, group, or system process is allowed to perform on a particular resource. They are a core component of authorization that determine "what you can do" after you've been authenticated. Permissions are properties of objects or resources. Closely related to [Privilege](#privilege) (the terms are often used interchangeably).

## Permission (core Backstage plugin)

A core Backstage plugin and framework that allows restriction of actions to specific users. See [their docs](https://backstage.io/docs/permissions/overview) for more information.

## Permission (permission plugin)

A restriction on any action that a user can perform against a specific [resource](#resource-permission-plugin) or set of resources. See [the permission framework docs](../permissions/concepts.md#permission) for more details.

## Persona (use cases)

Alternative term for a [User Role](#user-role).

## Plugin

A module in Backstage that adds a feature. All functionality outside of [the Backstage framework](#backstage-framework), even the core features, are implemented as plugins.

## Policy (permission plugin)

A construct that takes in a Backstage user and a [permission](#permission-permission-plugin) and returns a [policy decision](#policy-decision-permission-plugin).

## Policy Decision (permission plugin)

A specific response to a user's request to perform an action on a list of [resources](#resource-permission-plugin). Can be either `Approve`, `Deny` or [`Conditional`](#conditional-decision-permission-plugin).

## Popup

A separate browser window opened on top of the previous one.

## Privilege

Specific rules or settings that define what a user or process is allowed to do within the system, often relating to system-wide operations or capabilities. Privileges are properties of a subject, such as a user account or process, and represent a higher-level authority or right to perform certain security-critical functions. Closely related to [Permission](#permission) (the terms are often used interchangeably).

## Procedure (use cases)

A set of actions that accomplish a goal, usually as part of a [use case](#Use-Case). A procedure can be high-level, containing other procedures, or can be as simple as a single [task](#Task).

## Query Translators (search plugin)

An abstraction layer between a search engine and the [Backstage Search](#search) backend. Allows for translation into queries against your search engine.

## Refresh token

A special token that an [OAuth](#oauth) client can use to get a new [access token](#access-token) when the latter expires. See [OAuth Refresh Tokens](https://oauth.net/2/refresh-tokens/) for details.

## Resource (catalog plugin)

An [entity](#entity) that represents a piece of physical or virtual infrastructure, for example a database, required by a component. See [the catalog docs](https://backstage.io/docs/features/software-catalog/system-model) for more information.

## Resource (permission plugin)

A representation of an object that a user interacts with and that can be permissioned. Not to be confused with [Software Catalog resources](#resource-catalog-plugin).

## Rule (permission plugin)

A predicate-based control that taps into a [resource](#resource-permission-plugin)'s data.

## Role

See [User Role](#User-Role).

## Scaffolder

Known as [Software Templates](#software-templates).

## Scope

A string that describes a certain type of access that can be granted to a user using OAuth, usually in conjunction with [access tokens](#access-token).

## Search

A Backstage plugin that provides a framework for searching a Backstage [app](#app), including the [Software Catalog](#Software-Catalog) and [TechDocs](#TechDocs). A core feature of Backstage.

## Search Engine (Backstage search)

Existing search technology that [Backstage Search](#search) can take advantage of through its modular design. Lunr is the default search in Backstage Search.

## Software Catalog

A Backstage plugin that provides a framework to keep track of ownership and metadata for any number and type of software [components](#component). A core feature of Backstage.

## Software Templates

A Backstage plugin with which to create [components](#component) in Backstage. A core feature of Backstage. Also known as the scaffolder.

## Software Template

A "skeleton" software project created and managed in the Backstage Software Templates tool.

## System (catalog plugin)

A collection of [entities](#entity) that cooperate to perform a function. A system generally provides one or a few public APIs and consists of a handful of components, resources, and private or public APIs. See [the catalog docs](https://backstage.io/docs/features/software-catalog/system-model) for more information.

## Task (use cases)

A low-level step-by-step [Procedure](#Procedure).

## TechDocs

A documentation solution that manages and generates technical documentation from Markdown files stored with software component code. A core feature of Backstage.

## Token

A string containing information.

## Use Case

A purpose for which a [user role](#User-Role) interacts with Backstage. Related to [Objective](#objective): An objective is _what_ the user wants to do, a use case is _how_ the user does it.

## User

Any consumer of Backstage or Backstage products/applications. Includes individuals like employees and contractors, as well as software that interacts with the backend through an API or acts as a proxy for a person by operating the user interface.

## User Role

A class of Backstage user for purposes of analyzing [use cases](#use-case). One of: [evaluator](#evaluator); [administrator](#administrator); [developer](#developer); [integrator](#integrator); and [contributor](#contributor).
