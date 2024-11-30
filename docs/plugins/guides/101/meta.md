<!-- THIS FILE IS NOT INTENDED TO BE DISPLAYED ON THE DOCSITE -->

# Intro to Plugin Development

## Writing Guidelines

The goal of this section is to take the reader from zero-to-situated. Docs should assume that the user has _only_ gone through the initial getting started docs. At the end of this guide, the user will understand the basics of plugin development.

### Why build plugins?

This section should answer definitely why you should build a new plugin. The Backstage framework is deeply empowered by plugins and plugins are core to the project's success. Users should walk away from reading this section with a conviction that plugins are the right path for new functionality.

### Creating a plugin

This section should be extremely deliberate in showing readers every step of the way to create a plugin using Backstage's best practises. A reader that finishes this section should feel extremely comfortable adding and installing new plugins regardless of their experience with JS/TS and Backstage.

- Setting up your environment
- Scaffolding a new plugin
- Installation syntax
- Core services
- Debugging
  - Declaration error, `export default` missing
  - Startup error, `httpRouter` failed to start

### Sustainable plugin development

Plugins are not developed in a vacuum. Users should reach for them to solve specific business problems facing their developers, for example, you may be tasked to create

- a new vendor integration like PagerDuty,
- a new plugin backend that talks to an internal service,
- etc.

This section should contain learnings from successful Backstage deployments about how to engage with stakeholders, how/when to iterate on your plugin, and setting yourself up for future success.
