---
title: Improved Backstage Documentation with Personas
status: provisional
authors:
  - '@waldirmontoya25'
  - '@aramissennyeydd'
owners:
  - '@backstage/documentation-maintainers'
project-areas:
  - documentation
creation-date: 2024-03-18
---

# BEP: Enhancing Backstage Documentation: Personas, Framework, and Developer Portal

[**Discussion Issue**](https://github.com/backstage/backstage/issues/23689)

- [BEP: Enhancing Backstage Documentation: Personas, Framework, and Developer Portal](#bep-enhancing-backstage-documentation-personas-framework-and-developer-portal)
  - [Summary](#summary)
  - [Motivation](#motivation)
    - [Goals](#goals)
    - [Non-Goals](#non-goals)
  - [Proposal](#proposal)
  - [Design Details](#design-details)
    - [Personas](#personas)
      - [User](#user)
        - [Documentation Content](#documentation-content)
      - [Operator](#operator)
        - [Documentation Content](#documentation-content-1)
      - [Builder](#builder)
        - [Documentation Content](#documentation-content-2)
      - [Contributor](#contributor)
        - [Documentation Content](#documentation-content-3)
      - [Business Stakeholder](#business-stakeholder)
        - [Documentation Content](#documentation-content-4)
  - [Release Plan](#release-plan)
  - [Dependencies](#dependencies)
  - [Example Table of Contents](#example-table-of-contents)

## Summary

This BEP proposes restructuring the Backstage documentation to emphasize the dual nature of Backstage as both a framework for building developer portals and a fully functional developer portal out of the box, as demonstrated by the demo site. The documentation will be divided into two main sections: One focusing on the developer portal that users get with the core plugins, and another on the framework that allows operators and builders to create their own developer portal. The goal is to improve clarity, navigation, and adoption of Backstage by positioning it as both a ready-to-use developer portal and a framework for building custom developer portals.

## Motivation

The current Backstage documentation has been reported to be difficult to navigate, making it challenging for different personas across the DevEx ecosystem to extract value. The CNCF [**assessment**](https://github.com/cncf/techdocs/tree/main/assessments/0008-backstage/) and the resulting [**issues**](https://github.com/backstage/backstage/issues/21893) highlight the need for improvement in the documentation structure.

### Goals

- Divide the documentation into two section: Framework and Developer Portal
- Define the personas Backstage is targeting
- Provide complete, clear and easy-to-find instructions for tasks required of personas
- Move the existing content to the appropriate section.

### Non-Goals

- Rewrite the entire documentation from scratch
- Write additional content beyond the scope of the existing documentation

## Proposal

The proposed restructuring of the Backstage documentation revolves around two core ideas:

1. Positioning Backstage as both a framework to build developer portals and a developer portal itself, and splitting the documentation into two main sections:

   - Developer Portal: Focusing on the features, configuration, and usage of the developer portal that users get out of the box with the core plugins.
   - Framework: Covering the aspects of Backstage as a framework, including guides for operators and builders who want to create their own developer portal using Backstage.

2. Defining the personas participating in Backstage adoption journeys to improve documentation navigation. The identified personas are:

   - **End User**: A person who uses Backstage to find information, use plugins, and consume the developer portal.
   - **Operator**: A person who configures, secures, and deploys the developer portal, manages plugins, and oversees the general administration of the developer portal.
   - **Builder**: A person who builds plugins, customizes the code and design, and creates custom-built developer portals based on the Backstage framework. This includes developers and designers and anyone adding new functionality to their own Backstage instance.
   - **Business Stakeholder**: A person who defines the strategy for adopting Backstage, identifies use cases, communicates the value proposition for adopting Backstage and connects the developer portal to the business strategy.
   - **Contributor**: A person who contributes to the Backstage upstream ecosystem.

The adoption strategy would be as follows:

- Create a dedicated page describing the personas Backstage is targeting and the documentation sections that cater to each persona.
- Restructure the documentation into the two new sections (Framework and Developer Portal) and redistribute the existing content accordingly.
- Publish a blog post announcing the changes, highlighting Backstage's positioning as both a framework and a developer portal, and explaining the benefits of the restructured documentation.

The benefits of restructuring the documentation according to these ideas include:

1. Easier navigation and discoverability of information for different personas and use cases.
2. Clear separation of runtime and development documentation.
3. Simplified process for contributors to determine the appropriate location for new documentation.
4. Streamlined Backstage adoption process for new adopters.

## Design Details

- The Docs section of the microsite will be divided into two top-level sections: Framework and Developer Portal.
- The structure of the Table of Contents will align with the outline proposed in https://github.com/backstage/backstage/issues/21946.
- The developer portal documentation will be the primary entry point. Users should hit this site when navigating to backstage.io/docs. The framework documentation should be hosted similarly, but will be introduced organically in the developer portal documentation when referencing customization and other builder facing tasks.

### Personas

#### User

Users navigate the developer portal to access tools, information, and plugins essential for their daily tasks. They rely on Backstage to effortlessly find resources, utilize integrations, and connect with other tools and services within their ecosystem. Their interaction is predominantly with the frontend of the portal, where ease of use, accessibility, and relevant content discovery are critical.

##### Documentation Content

Documentation for this persona should be about usability of the portal once it is running. For example:

- Understanding the mechanics of the Software Catalog
- Registering components
- Deleting components
- How the source of truth is the external tool linked through the plugins
- Understand dependencies relations and the overall schema of the catalog
- Using available scaffolder actions
- Customizing new workflows with available actions
- Searching
- Using available plugins
- Step by step tutorials

#### Operator

Operators are responsible for the behind-the-scenes technical setup and maintenance of the Backstage portal. This includes deploying the portal, configuring plugins, managing user access, and ensuring the security and performance of the system. They interact with both the frontend and backend, often using command-line tools, administrative dashboards, and configuration files to perform their tasks.

##### Documentation Content

Documentation written for this persona should be DevOps technical, assuming a strong DevOps background. The goal is to give operators a strong understanding of how to deploy and manage a Backstage Developer Portal, best practices. For example:

- Installing and upgrading
- Configuring
  - Authentication
  - Plugins
- Ingesting data (users/groups/components, etc)
- Installing plugins
- Implement Git Flows for the Developer Portal
- Creating Pipelines for Docs generation
- Troubleshooting

#### Builder

Builders actively work on extending and customizing Backstage. This includes developing new plugins, customizing the UI/UX, and integrating external services or data sources. Their work is deeply technical, involving coding, and engaging with the Backstage community for support and collaboration. They need a deep understanding of the Backstage architecture and APIs, working closely with both the framework's backend and frontend aspects.

##### Documentation Content

Documentation written for this persona should be software technical, assuming a strong software background. While we can assume an overall technical knowledge, where possible we should link out to useful guides for the technologies we use, ex: Node.js, express.js, React, etc. The goal with documentation written for this persona is to give them a strong understanding of how to use the Backstage framework to build/evolve a company's Backstage Developer Portal, orient them to get support from the open source community, and prepare them for continuing to deliver value for their Backstage Developer Portal. For example:

- API references
- Frontend and Backend systems
- Package architecture
- Extending the Software Catalog
- Creating custom themes
- Integrating new react components
- Building custom authentication providers/strategies
- Accessibility

#### Contributor

Contributors are involved in the development of the Backstage framework itself. They contribute to the core codebase, develop new features, fix bugs, create documentation and maintain the overall health of the project. They are deeply involved in the open-source community, collaborating with maintainers and other contributors to improve the framework and its ecosystem.

Documentation for the contributor role should _not_ exist on the docs site. It should exist solely in the Github repositories (backstage/backstage, backstage/community-plugins). It can be linked to from the site, but should not have dedicated guides outside of the Github repositories.

##### Documentation Content

The goal with documentation written for contributors is to give them a strong understanding of how to contribute to the Backstage framework, orient them to get support from the open source community, and prepare them for continuing to deliver value for the Backstage framework. For example:

- Contributing to the Backstage framework
- Setting up a development environment
- Writing tests
- Writing documentation

#### Business Stakeholder

Business stakeholders use Backstage to align technical capabilities with business goals, monitoring how features and plugins support operational efficiency, developer satisfaction, and strategic objectives. They are involved in defining the strategy and measuring the impact of the developer portal on the organization. They need to navigate through dashboards, reports, and analytics within Backstage to gather insights and make informed decisions.

##### Documentation Content

Documentation written for this persona should be strategic, assuming a strong background in business development and strategy. The goal for business documentation is to give a strong understanding of what Backstage Developer Portal can do for their company, how to deliver value quickly and continuously and guides for pitching or driving Backstage adoption. For example:

- Adoption use cases
- Adoption strategies
- Measuring success
- Case studies

## Release Plan

- [x] Release the BEP (04/21/2024).
- [ ] Discuss the changes with the community and gather feedback.
- [ ] Implement the table of contents changes.
- [ ] Create issues to track reviewing and rewriting existing documentation into these new personas.

## Dependencies

None

## Example Table of Contents

- Developer Portal
  - Overview
    - What is Backstage?
    - Roadmap
    - Vision
    - User personas and use cases
    - How this documentation is organized
      - Framework
      - Developer portal
    - Release and Versioning Policy
    - Backstage Threat Model
    - Logo assets
    - Support and community
  - Architecture Overview
  - Getting Started
  - Operator Guides
    - Developer Portal
      - "How do I deploy, monitor, configure and verify my Backstage Developer Portal?"
      - Installing and Configuring
        - Database
        - Authentication
        - Installing plugins
        - Customize the design
      - Securing
      - Deploying in Production
      - Integrating with other systems
      - Managing
      - Monitoring
      - Troubleshooting
      - Upgrading
        - Keeping backstage up to date
      - Customizing
    - Core Plugins
      - "How do I install and configure Backstage Developer Portal with plugins."
      - Home Page
        - Installing and Configuring
      - Software Catalog
        - Overview
        - The life of an Entity
        - Catalog Configuration
        - System Model
        - YAML file format
        - Entity Reference
        - Well Known annotations
        - Well known relations
        - Well known statuses
        - Creating the catalog graph
      - Software Templates
        - Overview
        - Configuring
        - Adding a new template
        - Writing a template
        - Built in actions
      - TechDocs
        - Overview
        - Getting Started
        - Architecture
          - Installing and configuring
            - Using Cloud Storage for TechDocs generated files
            - Configuring CI/CD to generate and publish TechDocs sites
          - TechDocs CLI
          - Troubleshooting
      - Kubernetes
        - Installing and Configuring
          - Authentication
        - Troubleshooting
      - Search
  - Business Stakeholder Guides
    - "How do I present Backstage to leadership, what are the benefits, why should I care, etc."
    - Strategies for adopting
    - Use cases
  - User Guides
    - "How do I use the default OSS Backstage"
    - Logging in
    - Registering a component
    - Creating a new component
  - Reference
- Framework
  - Architecture Overview
  - Getting Started
  - Builder Guides
    - Local Development
      - "Prepare users for how to develop locally, debug problems, run tests, etc."
      - CLI
      - Linking in local packages
      - Debugging Backstage
    - Backstage core framework
      - "Internal documentation."
      - Systems
        - Frontend
          - Old
          - New
        - Backend
          - Old
          - New
    - API Reference
      - "Internal documentation"
    - Building plugins
      - "How to build a plugin, how to integrate it with other plugins, how to deploy and monitor it, and how to iterate on plugin development."
      - Intro to plugins
      - Existing plugins
      - Creating a new plugin
      - Plugin development
      - Structuring a plugin
      - Integrating with other systems
        - Integrating with the Catalog
        - Integrating Search
      - Composability system
      - Internationalization
      - Plugin analytics
      - Feature flags
      - OpenAPI
      - Backends and APIs
      - Testing
      - Publishing
    - Core Plugins
      - "How to leverage the existing plugins for your new plugin or customization options."
      - Home Page
        - Customizing the home page
      - Software Catalog
        - Extending the model
        - External integrations
        - Catalog Customization
        - API
      - Software Templates
        - Writing custom actions
        - Writing tests for actions
        - Writing custom field extensions
        - Writing custom step layouts
        - Authorizing parameters, steps and actions
        - Migrating to react-jsonschema-form@v5
        - Migrating to v1beta3 templates
      - Search
        - Overview
        - Getting Started with search
        - Search concepts
        - Search architecture
        - Search Engines
        - How to Guides
      - TechDocs
        - Customizing TechDocs
        - TechDocs add-ons
      - Kubernetes
        - Customizing the kubernetes plugin
          - Authentication
          - Proxy
      - Permissions
        - Overview
        - Concepts
        - Getting Started
        - Writing a permission policy
        - Frontend integration
        - Defining custom permission rules
        - Using permissions in plugins
      - Designing for Backstage
      - ADRs
      - Accessibility
      - References
  - Contributor Guides
    - "How to get started contributing to OSS."
    - Contributing to Backstage
  - Reference
