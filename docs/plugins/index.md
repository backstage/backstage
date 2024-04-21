---
id: index
title: Introduction to Plugins
description: Learn about integrating various infrastructure and software development tools into Backstage through plugins.
---

Backstage orchestrates a cohesive single-page application by seamlessly integrating a diverse set of plugins.

Our vision for the plugin ecosystem champions flexibility, empowering you to incorporate a broad spectrum of infrastructure and software development tools into Backstage as plugins. Adherence to stringent [design guidelines](../dls/design.md) guarantees a consistent and intuitive user experience across the entire plugin landscape.

![Plugin Screenshot](../assets/plugins/my-plugin_screenshot.png)

## Creating a Plugin

Embark on your plugin development journey by following the detailed steps provided [here](create-a-plugin.md).

## Suggesting a Plugin

If you're developing an open-source plugin, we encourage you to initiate a [new Issue in the community plugins repo](https://github.com/backstage/community-plugins/issues/new/choose). This gesture not only informs the community about upcoming plugins but also invites collaboration and feedback.

This approach is equally beneficial if you conceive an idea for a potentially impactful plugin but prefer if another contributor undertakes its development.

## Integration with the Software Catalog

Should your plugin complement the Software Catalog rather than exist as a standalone entity (for instance, as an additional tab or a card within an "Overview" tab), you'll find comprehensive guidance on achieving this integration [here](integrating-plugin-into-software-catalog.md).

## Guides for Plugin Development

### For Beginners: Building Your First Plugin
This section is designed for those new to plugin development. It covers the basics and provides a foundation for more advanced topics.

- **Plugin Basics**
  - What is a plugin and how does it fit into the Backstage ecosystem?
  - Introduction to plugins and their roles within Backstage.

- **Building Your First Plugin**
  - Step-by-step instructions on setting up your development environment and building your first plugin.
  - Configuration essentials.

### For Advanced Users: Enhancing and Maintaining Your Plugins
This section caters to experienced developers looking to refine their skills or find specific advanced information quickly.

- **Choosing Between a Module and a Plugin**
  - Understanding when to create a module instead of a new plugin.
  - Guidelines on extending existing plugins.

- **Advanced Plugin Development**
  - Best practices for ensuring code quality, integrating APIs, and handling databases.
  - How to publish and manage your plugin’s versions, perform security updates, and align with the main Backstage project.
  - Integrating advanced functionalities like the permissions API and the discovery API.
  - Using URL readers, SCM integrations, and the proxy API.

## Additional Resources and Further Reading

- **Real-world Implementations and Lessons**
  - Case studies and examples from the community.
  - Best practices derived from mature implementations.

- **Resource Compendium**
  - [Backstage Glossary](https://backstage.io/docs/references/glossary) of key terms.
  - Recommended readings and tools for advanced developers.

- **Certification and Learning Pathways**
  - Pathways to deepen your understanding and expertise in plugin development for Backstage.

Stay tuned for detailed exploration and guidance in each of these modules.
