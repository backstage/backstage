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

## Release Plan

- Release the BEP by 03/24/2024.
- Discuss the changes with the community and gather feedback by 04/24/2024.
- Implement the changes by 04/30/2024.

## Dependencies

None

## Example Table of Contents

- Overview
  - What is Backstage?
  - Roadmap
  - Vision
  - Release and Versioning Policy
  - Backstage Threat Model
  - Logo assets
  - Support and community
- Framework
  - Architecture Overview
  - Getting Started
  - Integrator/Builder Guides
    - Local Development
      - CLI
      - Linking in local packages
      - Debugging Backstage
    - Backstage core framework
      - Systems
        - Frontend
          - Old
          - New
        - Backend
          - Old
          - New
    - API Reference
    - Tutorials
    - Building plugins
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
    - Contributing to Backstage
  - Reference
- Developer Portal
  - Architecture Overview
  - Getting Started
  - Administrator Guides
    - Developer Portal
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
    - Strategies for adopting
    - Use cases
  - User Guides
    - Logging in
    - Registering a component
    - Creating a new component
  - Reference
