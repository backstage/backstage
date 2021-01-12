---
id: search-overview
title: Search Documentation
sidebar_label: Overview
description: Backstage Global Search lets you find the right information you are
looking for in the Backstage ecosystem.
---

# Backstage Global Search

## What is it?

Backstage Global Search lets you find the right information you are looking for
in the Backstage ecosystem.

## Features

- A federated, faceted search, searching across all entities registered in your
  Backstage instance.

- A search that lets you plug in your own search engine of choice.

- A standardized search API where plugin owners can choose to index their own
  data.

## Project roadmap

| Version                 | Description                                                                                                                                                       |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backstage Search V.0 ✅ | Search Frontend letting you search through the entities of the software catalog. [See V.0 Use Cases.](#backstage-search-v0)                                       |
| Backstage Search V.1 ⌛ | Basic “out-of-the-box” in-memory indexing process of entities, and its metadata, registered to the Software Catalog. [See V.1 Use Cases.](#backstage-search-v1)   |
| Backstage Search V.2 ⌛ | Search Backend responsible for the indexing process of entities, and its metadata, registered to the Software Catalog. [See V.2 Use Cases.](#backstage-search-v2) |
| Backstage Search V.3 ⌛ | Standardized Search API lets you index your own data from your plugin to the search engine cluster of choice. [See V.3 Use Cases.](#backstage-search-v3)          |

## Use Cases

#### Backstage Search V.0

- As a user I should be able to navigate to a search page and search for
  entities registered in the Software Catalog.
- As a user I should be able to use the search input field in the sidebar to
  search for entities registered in the Software Catalog.
- As a user I should be able to see the number of results my search returned.
- As a user I should be able to filter on metadata (kind, lifecycle) when I’ve
  performed a search.
- As a user I should be able to hide the filters if I don’t need to use them.

#### Backstage Search V.1

- As a user I should be able to get a match of a search on all entity metadata
  (e.g. owner, name, description, kind).
- As an app developer I should not have to plug in any search engine, instead I
  can use the out of the box in-memory indexing process to index entities and
  its metadata registered in the Software Catalog.

#### Backstage Search V.2

- As an app developer I should be able to spin up an instance of ElasticSearch.
- As an app developer I should be able to define a ElasticSearch cluster in my
  app_config where my data gets indexed to.

more to come...

#### Backstage Search V.3

- As a plugin developer I should be able to integrate my plugins data to the
  indexing process of Global Search by using the standardized API.
- As a user I should be able to search for all content (for example, entities,
  metadata, documentation) in global search.

more to come...

## Backstage Search Big Picture

To be created...

## Search Engines Supported

See [Backstage Search Architecture](architecture.md) to get an overview of how
the search engines are used.

| Search Engine | Support Status |
| ------------- | -------------- |
| ElasticSearch | Not yet ❌     |

[Reach out to us](#search) if you want to chat about support for more search
engines.

## Tech Stack

| Stack           | Location                 |
| --------------- | ------------------------ |
| Frontend Plugin | @backstage/plugin-search |
| Backend Plugin  | ⌛                       |

## Feedback

For any questions of feedback, reach out to us in the `#search` channel of our
[Discord chatroom](https://github.com/backstage/backstage#community).
