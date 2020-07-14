# [Backstage](https://backstage.io)

![headline](../headline.png)

## Documentation structure

- Overview
  - [What is Backstage?](README.md)
  - [Introduction](overview/introduction.md)
  - [Architecture and concepts](overview/arch-and-concepts.md)
  - Getting started
    - [Overview](getting-started/index.md)
    - [Installation](getting-started/installation.md)
    - [Local development](getting-started/local-development.md)
    - [Demo deployment](https://demo.backstage.io)
    - Production deployments
      - [Create an App](getting-started/create-app.md)
      - App configuration
        - [Configuring App with plugins](getting-started/configure-app-with-plugins.md)
        - [Customize the look-and-feel of your App](getting-started/customize-app-look-and-feel.md)
      - Deployment scenarios
        - [Kubernetes](getting-started/deployment-k8s.md)
        - [Other](getting-started/deployment-other.md)
  - Features
    - Software Catalog
      - [Overview](features/software-catalog/index.md)
      - [System model](features/software-catalog/system-model.md)
      - [YAML File Format](features/software-catalog/descriptor-format.md)
      - [Populating the catalog](features/software-catalog/populating.md)
      - [Extending the model](features/software-catalog/extending-the-model.md)
      - [External integrations](features/software-catalog/external-integrations.md)
      - [API](features/software-catalog/api.md)
    - Software creation templates
      - [Overview](features/software-templates/index.md)
      - [Configure templates](features/software-templates/configure-templates.md)
      - [Adding templates](features/software-templates/adding-templates.md)
    - Docs-like-code
      - [Overview](features/techdocs/README.md)
      - [Getting Started](features/techdocs/getting-started.md)
      - [Concepts](features/techdocs/concepts.md)
      - [Reading Documentation](features/techdocs/reading-documentation.md)
      - [Writing Documentation](features/techdocs/writing-documentation.md)
      - [Publishing Documentation](features/techdocs/publishing-documentation.md)
      - [Contributing](features/techdocs/contributing.md)
      - [Debugging](features/techdocs/debugging.md)
      - [FAQ](features/techdocs/FAQ.md)
  - Plugins
    - [Overview](plugins/index.md)
    - [Existing plugins](plugins/existing-plugins.md)
    - [Creating a new plugin](plugins/create-a-plugin.md)
    - [Developing a plugin](plugins/developing-plugins.md)
    - [Structure of a plugin](plugins/structure-of-a-plugin.md)
    - Backends and APIs
      - [Proxying](plugins/proxying.md)
      - [Backstage backend plugin](plugins/proxying.md)
      - [Call existing API](plugins/call-existing-api.md)
    - Testing
      - [Overview](plugins/testing.md)
    - Publishing
      - [Open source and NPM](plugins/publish-open-source.md)
      - [Private/internal (non-open source)](plugins/publish-private.md)
  - Authentication and identity
    - [Overview](auth/index.md)
    - [Add auth provider](auth/add-auth-provider.md)
    - [Auth backend](auth/auth-backend.md)
    - [OAuth](auth/oauth.md)
    - [Glossary](auth/glossary.md)
  - Designing for Backstage
    - [Backstage Design Language System (DLS)](dls/design.md)
    - [Storybook -- reusable UI components](dls/storybook.md)
    - [Figma resources](dls/figma.md)
  - API references
    - [JavaScript/TypeScript API](api/javascript.md)
    - [Backend APIs](api/backend.md)
  - Tutorials
    - [Overview](tutorials/index.md)
  - Architecture Decision Records (ADRs)
    - [Overview](architecture-decisions/index.md)
    - [ADR001 - Architecture Decision Record (ADR) log](architecture-decisions/adr001-add-adr-log.md)
    - [ADR002 - Default Software Catalog File Format](architecture-decisions/adr002-default-catalog-file-format.md)
    - [ADR003 - Avoid Default Exports and Prefer Named Exports](architecture-decisions/adr003-avoid-default-exports.md)
    - [ADR004 - Module Export Structure](architecture-decisions/adr004-module-export-structure.md)
    - [ADR005 - Catalog Core Entities](architecture-decisions/adr005-catalog-core-entities.md)
    - [ADR006 - Avoid React.FC and React.SFC](architecture-decisions/adr006-avoid-react-fc.md)
  - [Contribute](../CONTRIBUTING.md)
  - [Support](overview/support.md)
  - [FAQ](FAQ.md)

## What is Backstage?

[Backstage](https://backstage.io/) is an open platform for building developer
portals. It’s based on the developer portal we’ve been using internally at
Spotify for over four years. Backstage can be as simple as a services catalog or
as powerful as the UX layer for your entire tech infrastructure.

For more information go to [backstage.io](https://backstage.io) or join our
[Discord chatroom](https://discord.gg/EBHEGzX).

### Features

- Create and manage all of your organization’s software and microservices in one
  place.
- Services catalog keeps track of all software and its ownership.
- Visualizations provide information about your backend services and tooling,
  and help you monitor them.
- A unified method for managing microservices offers both visibility and
  control.
- Preset templates allow engineers to quickly create microservices in a
  standardized way
  ([coming soon](https://github.com/spotify/backstage/milestone/11)).
- Centralized, full-featured technical documentation with integrated tooling
  that makes it easy for developers to set up, publish, and maintain alongside
  their code ([coming soon](https://github.com/spotify/backstage/milestone/15)).

### Benefits

- For _engineering managers_, it allows you to maintain standards and best
  practices across the organization, and can help you manage your whole tech
  ecosystem, from migrations to test certification.
- For _end users_ (developers), it makes it fast and simple to build software
  components in a standardized way, and it provides a central place to manage
  all projects and documentation.
- For _platform engineers_, it enables extensibility and scalability by letting
  you easily integrate new tools and services (via plugins), as well as
  extending the functionality of existing ones.
- For _everyone_, it’s a single, consistent experience that ties all your
  infrastructure tooling, resources, standards, owners, contributors, and
  administrators together in one place.
