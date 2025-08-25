---
id: technical-overview
title: Technical overview
description: Documentation on Technical overview
---

## Purpose
Backstage is a developer portal that was created at Spotify to simplify end-to-end software developement. As they grew, their infrastructure became more fragmented and teams couldn't find the APIs they were supposed to use, or who owned a service, or documentation on anything.

Backstage is powered by a centralized [software catalog](#software-catalog-system-model) and utilizes an abstraction layer that sits on top of all of your infrastructure and developer tooling, allowing you to manage all of your software, services, tooling, and testing in one place.

You can also customize Backstage using a wide variety of available plugins or you can write your own plugin. It also includes automated templates that your teams can use to create new microservices, helping to ensure consistency. Backstage also provides the ability to create, maintain, and find the documentation for all of your software.


## Benefits
+ For *engineering managers*, it allow you to maintain standards and best practices across the organization, and can help you manage your whole tech ecosystem, from migrations to test certification.
+ For *end users* {developers), it makes it fast and simple to build software components in a standardized way, and it provides a central place to manage all projects and documentation.
+ For *platform engineers*, it enables extensibility and scalability by letting you easily integrate new tools and services (via plugins), as well as extending the functinality of existing ones.
+ For *everyone*, it is a single, consistent experience that ties all of your infrastructure tooling, resources, standards, owneers, contributors, and administrators together in one place. 

If you have question or want support, please join our [Discord chatroom](https://discord.gg/backstage-687207715902193673).

## Core Features
Backstage includes the following set of core features:
+ Authentication and Identity – Sign-in and identification of users, and delegating access to third-party resources, using built-in authentication providers.
+ Kubernetes – A tool that allows developers to check the health of their services whether it’s on a local host or in production.
+ Notifications – Provides a means for plugins and external services to send messages to either individual users or groups. 
+ Permissions – Ability to enforce rules concerning the type of access a user is given to specific data, APIs, or interface actions.
+ Search
+ [Software Catalog](../features/software-catalog/index.md) – A centralized system that contains metadata for all your software, such as services, websites, libraries, data pipelines, and so on. It can also contain metadata for the physical or virtual infrastructure needed to operate a piece of software. The software catalog can be viewed and searched through a UI. 
+ Software Templates
+ TechDocs – A docs-like-code solution built into Backstage. Documentation is written in Markdown files which lives together with the code.

## Software Catalog System Model
The Software Catalog enables two main use cases:
1.	It provides a view of all the software, services, libraries, websites, ML models, resources, and so on, that a team manages and maintains.
2.	It makes all the software in your company, and who owns it, discoverable.
   
The system model in the software catalog is based on entities and it models two main types:
+ Core Entities
+ Organizational Entities

Core Entities include:
+ Components – Individual pieces of software that can be tracked in source control and can implement APIs for other components to consume.
+ APIs – Implemented by components and form the boundaries between different components. The API can be either public, restricted, or private.
+ Resources – The physical or virtual infrastructure needed to operate a component.

![](../assets/software-catalog/software-model-core-entities.drawio.svg)

Organizational Entities include:
+ User - A person, such as an employee, contractor, or similar.
+ Group - An organizational entity, such as a team, business unit, and so on.

When you have a large catalogue of components, APIs, and resources, it can be difficult to understand how they work together. Ecosystem modeling allows you to organize a large catalog of core entities into:
+ Systems – A collection of resources and components that cooperate to perform a function by exposing one or several public APIs.  It hides the resources and private APIs between the components from the consumer.
+ Domains – A collection of systems that share terminology, domain models, metrics, KPIs, business purpose, or documentation.

There are three additional items that can be part of the system model:
+ Location – A marker that references other places to look for catalog data.
+ Type – It has no set meaning. You can assign your own types and use them as desired.
+ Template – Describes both the parameters that are rendered in the frontend part of the scaffolding wizard, and the steps that are executed when scaffolding that component.

The following diagram illustrates an example of ecosystem modeling, and provides sample relationships between a domain, system, core entities, and organization entities.

![](../assets/software-catalog/software-model-entities.drawio.svg)
