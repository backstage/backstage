---
id: search-overview
title: Search Documentation
sidebar_label: Overview
# prettier-ignore
description: Backstage Search lets you find the right information you are looking for in the Backstage ecosystem.
---

# Backstage Search

## What is it?

Backstage Search lets you find the right information you are looking for in the Backstage ecosystem.

## Features

- A search that lets you bring your own search engine.
- A search that lets you extend it by creating collators for easily indexing content from plugins and other sources.
- A search that lets you create composable search page experiences.
- A search that lets you customize the look and feel of each search result.

See the more detailed [architecture](./architecture.md) and [tech stack](./architecture.md#tech-stack).

## Project roadmap

No current plans. Check [Backstage issues labeled `search`](https://github.com/backstage/backstage/issues?q=is%3Aopen+is%3Aissue+label%3Asearch)
for community-led ideas and initiatives.

## Supported

The following sections show the plugins and search engines currently supported by Backstage Search.

### Plugins integrated with Backstage Search

| Plugin                                                                                                                                                 | Support Status |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| Software Catalog                                                                                                                                       | ✅             |
| [TechDocs](./how-to-guides.md#how-to-index-techdocs-documents)                                                                                         | ✅             |
| [Stack Overflow](https://github.com/backstage/backstage/blob/master/plugins/stack-overflow-backend/README.md#index-stack-overflow-questions-to-search) | ✅             |

### Search engines

See [Backstage Search Architecture](architecture.md) to get an overview of how
the search engines are used.

| Search Engines                                                | Support Status |
| ------------------------------------------------------------- | -------------- |
| [Elasticsearch/OpenSearch](./search-engines.md#elasticsearch) | ✅             |
| [Lunr](./search-engines.md#lunr)                              | ✅             |
| [Postgres](./search-engines.md#postgres)                      | Community ✅   |

[Reach out to us](#get-involved) if you want to chat about support for more plugin integrations and
search engines.

## Get involved

For any questions, feedback, or to help move search forward, reach out to us in
the **#search** channel of our
[Discord chatroom](https://github.com/backstage/backstage#community).
