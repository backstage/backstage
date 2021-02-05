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

| Version                 | Description                                                                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backstage Search V.0 ✅ | Search Frontend letting you search through the entities of the software catalog. [See V.0 Use Cases.](#backstage-search-v0)                                         |
| Backstage Search V.1 ⌛ | Basic “out-of-the-box” in-memory indexing process of entities, and their metadata, registered to the Software Catalog. [See V.1 Use Cases.](#backstage-search-v1)   |
| Backstage Search V.2 ⌛ | Search Backend responsible for the indexing process of entities, and their metadata, registered to the Software Catalog. [See V.2 Use Cases.](#backstage-search-v2) |
| Backstage Search V.3 ⌛ | Standardized Search API lets you index other plugins data to the search engine of choice. [See V.3 Use Cases.](#backstage-search-v3)                                |

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
| ElasticSearch | Not yet ❌     |

[Reach out to us](#feedback) if you want to chat about support for more search
engines.

## Tech Stack

| Stack           | Location                 |
| --------------- | ------------------------ |
| Frontend Plugin | @backstage/plugin-search |
| Backend Plugin  | ⌛                       |

## Feedback

For any questions of feedback, reach out to us in the `#search` channel of our
[Discord chatroom](https://github.com/backstage/backstage#community).

We are still looking for feedback to improve the architecture to fit your
use-case, see
[this open issue](https://github.com/backstage/backstage/issues/4078).
