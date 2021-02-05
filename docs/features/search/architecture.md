---
id: architecture
title: Search Architecture
description: Documentation on Search Architecture
---

# Search Architecture

> _This is a proposed architecture which has not been implemented yet. We are
> still looking for feedback to improve the architecture to fit your use-case,
> see [this open issue](https://github.com/backstage/backstage/issues/4078)._

Below you can explore the Search Architecture. Our aim with this architecture is
to support a wide variety of search engines, while providing a simple developer
experience for plugin developers, and a good out-of-the-box experience for
Backstage end-users.

<img data-zoomable src="../../assets/search/architecture.drawio.svg" alt="Search Architecture" />

At a base-level, we want to support the following:

- We aim to enable the capability to search across the entire Backstage
  ecosystem by decoupling search from content management.
- We aim to enable the capability to deploy Backstage using any search engine,
  by providing an integration and translation layer between the core search
  plugin and search engine specific logic that can be extended for different
  search engines. We may also introduce the ability to replace the backend API
  endpoint with a custom endpoint for simpler customization.

More advanced use-cases we hope to support with this architecture include:

- It should be easy for any plugin to expose new content to search. (e.g. entity
  metadata, documentation from TechDocs)
- It should be easy for any plugin to append relevant metadata to existing
  content in search. (e.g. location (path) for TechDocs page)
- It should be easy to refine search queries (e.g. ranking, scoring, etc.)
- It should be easy to customize the search UI
- It should be easy to add search functionality to any Backstage plugin or
  deployment
