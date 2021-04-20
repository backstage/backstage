---
id: search-overview
title: Search Documentation
sidebar_label: Overview
# prettier-ignore
description: Backstage Search lets you find the right information you are looking for in the Backstage ecosystem.
---

# Backstage Search

## What is it?

Backstage Search lets you find the right information you are looking for in the
Backstage ecosystem.

## Features

- A federated, faceted search, searching across all entities registered in your
  Backstage instance.

- A search that lets you plug in your own search engine of choice.

- A standardized search API where you can choose to index other plugins data.

## Project roadmap

| Version                           | Description                                                                                                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Backstage Search v0 ✅            | Search Frontend letting you search through the entities of the software catalog. [See v0 Use Cases.](#backstage-search-v0)                                         |
| [Backstage Search V0.5 ✅ ][v0.5] | Foundations for the architecture.                                                                                                                                  |
| [Backstage Search v1 ⌛][v1]      | Basic “out-of-the-box” in-memory indexing process of entities, and their metadata, registered to the Software Catalog. [See v1 Use Cases.](#backstage-search-v1)   |
| [Backstage Search v2 ⌛][v2]      | Search Backend responsible for the indexing process of entities, and their metadata, registered to the Software Catalog. [See v2 Use Cases.](#backstage-search-v2) |
| [Backstage Search v3 ⌛][v3]      | Standardized Search API lets you index other plugins data to the search engine of choice. [See v3 Use Cases.](#backstage-search-v3)                                |

[v0.5]: https://github.com/backstage/backstage/milestone/25
[v1]: https://github.com/backstage/backstage/milestone/26
[v2]: https://github.com/backstage/backstage/milestone/27
[v3]: https://github.com/backstage/backstage/milestone/28

## Use Cases

#### Backstage Search V.0

- As a software engineer I should be able to navigate to a search page and
  search for entities registered in the Software Catalog.
- As a software engineer I should be able to use the search input field in the
  sidebar to search for entities registered in the Software Catalog.
- As a software engineer I should be able to see the number of results my search
  returned.
- As a software engineer I should be able to filter on metadata (kind,
  lifecycle) when I’ve performed a search.
- As a software engineer I should be able to hide the filters if I don’t need to
  use them.

#### Backstage Search V.1

- As a software engineer I should be able to get a match of a search on all
  entity metadata (e.g. owner, name, description, kind).
- As an integrator I should not have to plug in any search engine, instead I can
  use the out of the box in-memory indexing process to index entities and their
  metadata registered in the Software Catalog.

#### Backstage Search V.2

- As an integrator I should be able to spin up an instance of ElasticSearch.
- As an integrator I should be able to define a ElasticSearch cluster in my
  app_config.yaml where my data gets indexed to.

more to come...

#### Backstage Search V.3

- As a contributor I should be able to integrate plugin data to the indexing
  process of Backstage Search by using the standardized API.
- As a software engineer I should be able to search for all content (for
  example, entities, metadata, documentation) in Backstage search.

more to come...

## Search Engines Supported

See [Backstage Search Architecture](architecture.md) to get an overview of how
the search engines are used.

| Search Engine | Support Status |
| ------------- | -------------- |
| Basic (lunr)  | Not yet ❌     |
| ElasticSearch | Not yet ❌     |

[Reach out to us](#feedback) if you want to chat about support for more search
engines.

## Tech Stack

| Stack           | Location                              |
| --------------- | ------------------------------------- |
| Frontend Plugin | @backstage/plugin-search              |
| Backend Plugin  | @backstage/plugin-search-backend      |
| Indexer Plugin  | @backstage/plugin-search-backend-node |
| Common Code     | @backstage/search-common              |

## Get Involved

For any questions, feedback, or to help move search forward, reach out to us in
the `#search` channel of our
[Discord chatroom](https://github.com/backstage/backstage#community).
