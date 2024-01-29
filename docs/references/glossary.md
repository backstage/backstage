---
id: glossary
title: Glossary
# prettier-ignore
description: List of terms, abbreviations, and phrases used in Backstage, together with their explanations.
---

## Access token

A [token](#token) that gives access to perform actions on behalf of a user. It will commonly have a short expiry time, and be limited to a set of [scopes](#scope). Part of the [OAuth](#oauth) protocol.

https://oauth.net/2/access-tokens/

## Administrator

Someone responsible for installing and maintaining a Backstage [app](#app) for an organization. A [user role](#user-role).

## API (catalog plugin)

In the Backstage [Catalog](#catalog), an API is an [entity](#entity) representing a boundary between two [components](#component).

https://backstage.io/docs/features/software-catalog/system-model

## App

An installed instance of Backstage. An app can be local, intended for a single development group or individual developer, or organizational, for use by an entire enterprise.

## Authorization Code

A type of [OAuth flow](#oauth) used by confidential and public clients to get an [access token](#access-token).

https://oauth.net/2/grant-types/authorization-code/

## Backstage

A platform for creating and deploying [developer portals](#developer-portal), originally created at Spotify.

Backstage is an incubation-stage open source project of the [Cloud Native Computing Foundation](#cloud-native-computing-foundation).

Can also refer to: [Backstage framework](#backstage-framework).

## Backstage framework

The actual framework that Backstage [plugins](#plugin) sit on. This spans both the frontend and the backend, and includes core functionality such as declarative integration, config reading, database management, and many more.

## Bundle

A collection of [deployment artifacts](#deployment-artifacts).

Can also be: The output of the bundling process, which brings a collection of [packages](#package) into a single collection of [deployment artifacts](#deployment-artifacts).

## Catalog

An organization's portfolio of software products managed in Backstage.

Can also be: The core Backstage plugin that handle ingestion and display of your organizations software products.

## Cloud Native Computing

A set of technologies that "empower organizations to build and run scalable applications in modern, dynamic environments such as public, private, and hybrid clouds. Containers, service meshes, microservices, immutable infrastructure, and declarative APIs exemplify this approach." ([CNCF Cloud Native Definition v1.0](https://github.com/cncf/toc/blob/main/DEFINITION.md)).

## Cloud Native Computing Foundation

A foundation dedicated to the promotion and advancement of [Cloud Native Computing](#Cloud-Native-Computing). The mission of the Cloud Native Computing Foundation (CNCF) is "to make cloud native computing ubiquitous" ([CNCF Charter](https://github.com/cncf/foundation/blob/main/charter.md)).

CNCF is part of the [Linux Foundation](https://www.linuxfoundation.org/).

## CNCF

Cloud Native Computing Foundation.

## Code Grant

[OAuth](#oauth) flow where the client receives an [authorization code](#code) that is passed to the backend to be exchanged for an [access token](#access-token) and possibly a [refresh token](#refresh-token).

## Collators (search plugin)

Collators transform streams of [documents](#documents) into searchable texts. They're usually responsible for the data transformation and definition and collection process for specific [documents](#documents). Part of [Backstage Search](#search).

## Component (catalog plugin)

A software product that is managed in the Backstage [Software Catalog](#software-catalog). A component can be a service, website, library, data pipeline, or any other piece of software managed as a single project.

https://backstage.io/docs/features/software-catalog/system-model

## Condition (permission plugin)

Conditions are used to return a conditional decision from a policy. They contain information about a given entity and restrictions on what types of users can view that entity.

## Conditional decisions

[Rules](#permission-rules) need additional data before they can be used in a decision. Once a [rule](#permission-rule) is bound to relevant information it forms a [condition](#condition). Conditional decisions tell the [permission framework](#permission) to delegate evaluation to the [plugin](#plugin) that owns the corresponding [resource](#permission-resource). Permission requests that result in a conditional decision are allowed if all of the provided conditions evaluate to be true.

## Contributor

A volunteer who helps to improve an OSS product such as Backstage. This volunteer effort includes coding, testing, technical writing, user support, and other work. A [user role](#user-role).

## Declarative integration

A new paradigm for Backstage frontend plugins, allowing definition in config files instead of hosting complete React pages.

https://backstage.io/docs/frontend-system

## Decorators (search plugin)

A transform stream. Decorators allow you to add additional information to documents outside of the [collator](#collators). They sit between the [collators](#collators) and the [indexers](#indexer) and can add extra fields to documents as they're being collated and indexed.

Possible use cases for a decorator could be to bias search results or otherwise improve the search experience in your Backstage instance. Decorators can also be used to remove [metadata](#metadata), filter out, or even add extra documents at index-time. Part of [Backstage Search](#search).

## Deployment Artifacts

An executable or package file with all of the necessary information required to deploy the application at runtime. Deployment artifacts can be hosted on [package registries](#package-registry).

## Developer

Someone who writes code and develops software.

A [user role](#user-role) defined as someone who uses a Backstage [app](#app). Might or might not actually be a software developer.

## Developer Portal

A centralized system comprising a user interface and database used to facilitate and document all the software projects within an organization. Backstage is both a developer portal and (by virtue of being based on plugins) a platform for creating developer portals.

## Documents (search plugin)

An abstract concept representing something that can be found by searching for it. A document can represent a software entity, a TechDocs page, etc. Documents are made up of metadata fields, at a minimum -- a title, text, and location (as in a URL). Part of [Backstage Search](#search).

## Domain

In the Backstage Catalog, a domain is an area that relates systems or entities to a business unit.

https://backstage.io/docs/features/software-catalog/system-model

## Entity

What is cataloged in the Backstage Software Catalog. An entity is identified by a unique combination of [kind](#Kind), [namespace](#Namespace), and name.

## Evaluator

Someone who assesses whether Backstage is a suitable solution for their organization. The only [user role](#user-role) with a pre-deployment [use case](#use-case).

## ID Token

A [JWT](#jwt) used to prove a user's identity, containing for example the user's email. Part of [OpenID Connect](#openid-connect).

## Index (search plugin)

An index is a collection of [documents](#documents) of a given type. Part of [Backstage Search](#search).

## Indexer (search plugin)

A write stream of [documents](#documents). Part of [Backstage Search](#search).

## Integrator

Someone who develops one or more plugins that enable Backstage to interoperate with another software system. A [user role](#user-role).

## JWT

JSON Web Token.

A popular JSON based token format that is commonly encrypted and/or signed, see [en.wikipedia.org/wiki/JSON_Web_Token](https://en.wikipedia.org/wiki/JSON_Web_Token)

## Kind

Classification of an [entity](#Entity) in the Backstage Software Catalog, for example _service_, _database_, and _team_.

## Kubernetes Plugin

A plugin enabling configuration of Backstage on a Kubernetes cluster. Kubernetes plugin has been promoted to a Backstage core feature.

## Local Package

One of the [packages](#package) within a [monorepo](#monorepo). These package may or may not also be published to a [package registry](#package-registry).

## Monorepo

A single repository for a collection of related software projects, such as all projects belonging to an organization.

Can also mean: A project layout that consists of multiple [packages](#package) within a single project, where packages are able to have local dependencies on each other. Often enabled through tooling such as [lerna](https://lerna.js.org/) and [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)

## Namespace

In the Backstage Software Catalog, an optional attribute that can be used to organize [entities](#entity).

## Objective

A high level goal of a [user role](#User-Role) interacting with Backstage. Some goals of the _administrator_ user role, for example, are to maintain an instance ("app") of Backstage; to add and update functionality via plugins; and to troubleshoot issues.

## OAuth

Refers to: OAuth 2.0, a standard protocol for authorization. See [oauth.net/2/](https://oauth.net/2/).

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

The declared role of a package, see [package roles](../local-dev/cli-build-system.md#package-roles).

## Permission

A core Backstage plugin and framework that allows restriction of actions to specific users.

Any action that a user performs within Backstage may be represented as a permission. More complex actions, like executing a [software template](#software-templates), may require [authorization](#authorization) for multiple permissions throughout the flow. Permissions are identified by a unique name and optionally include a set of attributes that describe the corresponding action. [Plugins](#plugin) are responsible for defining and exposing the permissions they enforce as well as enforcing restrictions from the permission framework.

https://backstage.io/docs/permissions/overview

## Persona (use cases)

Alternative term for a [User Role](#user-role).

## Plugin

A module in Backstage that adds a feature. All functionality outside of [the Backstage framework](#backstage-framework), even the core features, are implemented as plugins.

## Policy (permission plugin)

User [permissions](#permission) are authorized by a central, user-defined [permission](#permission) policy. At a high level, a policy is a function that receives a Backstage user and [permission](#permission), and returns a decision to allow or deny. Policies are expressed as code, which decouples the framework from any particular [authorization](#authorization) model, like role-based access control (RBAC) or attribute-based access control (ABAC).

## Policy decision (permission plugin)

Two important responsibilities of any authorization system are to decide if a user can do something, and to enforce that decision. In the Backstage permission framework, [policies](#policy) are responsible for decisions and [plugins](#plugin) (typically backends) are responsible for enforcing them.

## Popup

A separate browser window opened on top of the previous one.

## Procedure (use cases)

A set of actions that accomplish a goal, usually as part of a [use case](#Use-Case). A procedure can be high-level, containing other procedures, or can be as simple as a single [task](#Task).

## Query Translators (search plugin)

An abstraction layer between a search engine and the [Backstage Search](#search) backend. Allows for translation into queries against your search engine. Part of [Backstage Search](#search).

## Refresh Token

A special token that an [OAuth](#oauth) client can use to get a new [access token](#access-token) when the latter expires.

https://oauth.net/2/refresh-tokens/

## Resource (catalog plugin)

In the Backstage Catalog, an [entity](#entity) that represents a piece of physical or virtual infrastructure, for example a database, required by a component.

https://backstage.io/docs/features/software-catalog/system-model

## Resource (permission plugin)

Not to be confused with [Software Catalog resources](#resource-catalog-plugin). Permission resources represent the objects that users interact with and that can be permissioned.

## Rule (permission plugin)

Rules are predicate-based controls that tap into a [resource](#resource-permission-plugin)'s data.

## Role

See [User Role](#User-Role).

## Scaffolder

Known as [Software Templates](#software-templates).

## Scope

A string that describes a certain type of access that can be granted to a user using OAuth, usually in conjunction with [access tokens](#access-token).

## Search

A Backstage plugin that provides a framework for searching a Backstage [app](#app), including the [Software Catalog](#Software-Catalog) and [TechDocs](#TechDocs). A core feature of Backstage.

## Search Engine

Existing search technology that [Backstage Search](#search) can take advantage of through its modular design. Lunr is the default search in [Backstage Search](#search). Part of [Backstage Search](#search).

## Software Catalog

A Backstage plugin that provides a framework to keep track of ownership and metadata for any number and type of software [components](#component). A core feature of Backstage.

## Software Templates

A Backstage plugin with which to create [components](#component) in Backstage. A core feature of Backstage. Also known as the scaffolder.

Can also refer to: A "skeleton" software project created and managed in the Backstage Software Templates tool.

## System

In the Backspace Catalog, a system is a collection of [entities](#entity) that cooperate to perform a function. A system generally provides one or a few public APIs and consists of a handful of components, resources and private APIs.

https://backstage.io/docs/features/software-catalog/system-model

## Task (use cases)

A low-level step-by-step [Procedure](#Procedure).

## TechDocs

A documentation solution that manages and generates a technical documentation from Markdown files stored with software component code. A core feature of Backstage.

## Token

A string containing information.

## Use Case

A purpose for which a [user role](#User-Role) interacts with Backstage. Related to [Objective](#objective): An objective is _what_ the user wants to do; a use case is _how_ the user does it.

## User Role

A class of Backstage user for purposes of analyzing [use cases](#use-case). One of: evaluator; administrator; developer; integrator; and contributor.
