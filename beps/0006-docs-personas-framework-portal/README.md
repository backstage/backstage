---
title: Restructuring Backstage Documentation for Improved Navigation and Clarity
status: provisional
authors:
  - '@waldirmontoya25'
owners:
project-areas:
  - Documentation
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
  - [Release Plan](#release-plan)
  - [Dependencies](#dependencies)
  - [Example Table of Contents](#example-table-of-contents)

## Summary

This BEP proposes restructuring the Backstage documentation to emphasize the dual nature of Backstage as both a framework for building developer portals and a fully functional developer portal out of the box, as demonstrated by the demo site. The documentation will be divided into two main sections: One focusing on the developer portal that users get with the core plugins, and another on the framework that allows integrators and builders to create their own developer portal. The goal is to improve clarity, navigation, and adoption of Backstage by positioning it as both a ready-to-use developer portal and a framework for building custom developer portals.

## Motivation

The current Backstage documentation has been reported to be difficult to navigate, making it challenging for different personas across the DevEx ecosystem to extract value. The CNCF [**assessment**](https://github.com/cncf/techdocs/tree/main/assessments/0008-backstage/) and the resulting [**issues**](https://github.com/backstage/backstage/issues/21893) highlight the need for improvement in the documentation structure.

### Goals

- Divide the documentation into two section: Framework and Developer Portal
- Define the personas Backstage is targeting
- Structure the documentation to cater the different personas
- Move the existing content to the appropriate section

### Non-Goals

- Rewrite the entire documentation from scratch
- Write additional content beyond the scope of the existing documentation

## Proposal

The proposed restructuring of the Backstage documentation revolves around two core ideas:

1. Positioning Backstage as both a framework to build developer portals and a developer portal itself, and splitting the documentation into two main sections:

   - Developer Portal: Focusing on the features, configuration, and usage of the developer portal that users get out of the box with the core plugins.
   - Framework: Covering the aspects of Backstage as a framework, including guides for integrators and builders who want to create their own developer portal using Backstage.

2. Defining the personas participating in Backstage adoption journeys to improve documentation navigation. The identified personas are:

   - **User**: A person who uses Backstage to find information, use plugins, and consume the developer portal.
   - **Administrator/Operator**: A person who configures, secures, and deploys the developer portal, manages plugins, and oversees the general administration of the developer portal.
   - **Integrator/Builder**: A person who builds plugins, customizes the code and design, and creates custom-built developer portals based on the Backstage framework. This includes developers and designers and anyone adding new functionality to their own Backstage instance.
   - **Product Manager/Business stakeholders**: A person who defines the strategy for adopting Backstage, identifies use cases, communicates the value proposition for adopting Backstage and connects the developer portal to the business strategy.
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

### User Persona

Documentation written for the user persona should be high level, assuming little to no technical knowledge. Concepts like the difference between Backstage Framework and Developer Portal should be explained at a high level to give Users a working knowledge, but should not be flushed out completely until we identify the user as a distinct user persona. Users may also be Administrators, Integrators or Product Managers, but documentation for Users should make no assumptions on that.

Example explanation of Backstage Framework vs Developer Portal:
"Backstage has two meanings, the Backstage Framework and the Backstage Developer Portal. Backstage Framework provides the tools you need to build your own developer portal and Backstage Developer Portal is your custom developer portal built using the Backstage Framework."

### Administrator Persona

Documentation written for this persona should be DevOps technical, assuming a strong DevOps background with the exception of a Getting Started section. While we should assume an overall technical knowledge, where possible we should link out to existing strong guides for the technologies we use, ex: PostgreSQL, Docker, Kubernetes, etc. The goal with administrator documentation is to give administrators a strong understanding of how to deploy and manage a Backstage Developer Portal, best practices, and possible tripping points.

Example explanation of Backstage Framework vs Developer Portal:
"Backstage has two meanings, the Backstage Framework and the Backstage Developer Portal. As an administrator, you will be interacting with Backstage Developer Portal primarily -- this is the running Backstage instance that you're managing. It is also useful to have a high level understanding of the Backstage Framework for mitigating issues or better understanding how to scale your Backstage Developer Portal."

### Integrator Persona

Documentation written for this persona should be software technical, assuming a strong software background with the exception of a Getting Started section. While we can assume an overall technical knowledge, where possible we should link out to useful guides for the technologies we use, ex: Node.js, express.js, React, etc. The goal with documentation written for integrators is to give them a strong understanding of where their work fits into their company's Backstage Developer Portal, orient them to get support from the open source community, and prepare them for continuing to deliver value for their Backstage Developer Portal.

Example explanation of Backstage Framework vs Developer Portal:
"Backstage has two meanings, the Backstage Framework and the Backstage Developer Portal. As an integrator, most of your time will be spent working to deliver value on top of the Backstage Framework for your company's Backstage Developer Portal. This means creating plugins, theming your Backstage Developer Portal or adding integrations to internal data stores. You should have a strong understanding of the Backstage Framework and have a strong understaing of code that sits in your Backstage Developer Portal."

### Business Stakeholder

Documentation written for this persona should be strategic, assuming a strong background in business development and strategy. The goal for business documentation is to give a strong understanding of what Backstage Developer Portal can do for their company, how to deliver value quickly and continuously and guides for pitching or driving Backstage adoption.

Example explanation of Backstage Framework vs Developer Portal:
"Backstage has two meanings, the Backstage Framework and the Backstage Developer Portal. As a business stakeholder, your time should be spent with your company's Backstage Developer Portal solely. This means understanding the value proposition of an IDP, what improving the developer experience at your company means and what a successful Backstage Developer Portal looks like. The Backstage Framework is the technical underpinning and will generally be invisible to you."

## Contributor

Documentation written for this role should be technical, but should make no assumptions on technical strength. The goal with this documentation is to onboard new contributors to the technical stack and layout of the project, setting expectations for how to write code, documentation or generally contribute to the library.

Example explanation of Backstage Framework vs Developer Portal:
"Backstage has two meanings, the Backstage Framework and the Backstage Developer Portal. You will work with both the Backstage Framework and Backstage Developer Portal. Backstage Framework is the technical framework for Backstage Developer Portal. The Backstage Developer Portal is the end user for your plugins, documentation or other contributions. As a contributor, you will be working to influence either the Backstage Framework or plugins and Backstage Developer Portals across the world may use your contributions."

## Release Plan

- Release the BEP by 03/24/2024.
- Discuss the changes with the community and gather feedback by 04/24/2024.
- Implement the changes by 04/30/2024.

## Dependencies

None

## Example Table of Contents

- Overview
  - "The overview should introduce users to the concept of Backstage, what an IDP is, how to deliver value, why you should care about DevEx, etc."
  - What is Backstage?
  - Roadmap
  - Vision
  - Release and Versioning Policy
  - Backstage Threat Model
  - Logo assets
  - Support and community
- Framework
  - Architecture Overview
    - "The arch overview should explain how the framework is structured, where plugins and instances fit in and how to understand the current design of Backstage."
  - Getting Started
  - Integrator/Builder Guides
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
- Developer Portal
  - Architecture Overview
  - Getting Started
  - Administrator Guides
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
  - Product Manager Guides
    - "How do I present Backstage to leadership, what are the benefits, why should I care, etc."
    - Strategies for adopting
    - Use cases
  - User Guides
    - "How do I use the default OSS Backstage"
    - Logging in
    - Registering a component
    - Creating a new component
  - Reference
