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

- A federated, faceted search, searching across all entities registered in your Backstage instance.

- A search that lets you plug in your own search engine of choice.

- A standardized search API where you can choose to index data from other plugins.

## Project roadmap

### Now

**Backstage Search 1.0**

A stable Search API for plugin developers to add search to their plugins, and app integrators to expose that to their users.

We will consider Backstage Search to be 1.0 when the above
use-cases are met, and an ecosystem of search-enabled plugins are available and
stable.

- As a plugin developer, there should be at least one example of a Backstage
  plugin that integrates with search that I can use as inspiration for my own
  plugin's search capabilities (for example, the TechDocs plugin).
- As an app integrator, there should be plenty of examples and documentation on
  how to customize and extend search in my Backstage instance to meet my
  organization's needs.

### Next

_Not specified_

### Someday/Maybe

_Not specified_

### Done

See [Done](#done) below for a list of completed roadmap items.

## Supported

The following sections show the search engines and plugins currently supported by Backstage Search.

### Search engines

See [Backstage Search Architecture](architecture.md) to get an overview of how
the search engines are used.

| Search Engines                                     | Support Status |
| -------------------------------------------------- | -------------- |
| [Lunr](./search-engines.md#lunr)                   | ✅             |
| [ElasticSearch](./search-engines.md#elasticsearch) | ✅             |
| [Postgres](./search-engines.md#postgres)           | ✅             |

[Reach out to us](#get-involved) if you want to chat about support for more
search engines.

### Plugins integrated with Backstage Search

| Plugin                                                                                                                                                 | Support Status |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| Software Catalog                                                                                                                                       | ✅             |
| [TechDocs](./how-to-guides.md#how-to-index-techdocs-documents)                                                                                         | ✅             |
| [Stack Overflow](https://github.com/backstage/backstage/blob/master/plugins/stack-overflow-backend/README.md#index-stack-overflow-questions-to-search) | ✅             |

[Reach out to us](#get-involved) if you want to chat about support for more
plugins integrated to search.

## Tech Stack

| Stack                     | Location                                              |
| ------------------------- | ----------------------------------------------------- |
| Frontend Plugin           | @backstage/plugin-search                              |
| Frontend Plugin Library   | @backstage/plugin-search-react                        |
| Isomorphic Plugin Library | @backstage/plugin-search-common                       |
| Backend Plugin            | @backstage/plugin-search-backend                      |
| Backend Plugin Library    | @backstage/plugin-search-backend-node                 |
| Backend Plugin Module     | @backstage/plugin-search-backend-module-elasticsearch |
| Backend Plugin Module     | @backstage/plugin-search-backend-module-pg            |

## Get involved

For any questions, feedback, or to help move search forward, reach out to us in
the **#search** channel of our
[Discord chatroom](https://github.com/backstage/backstage#community).

## Done

**Backstage Search Pre-Alpha**

Search Frontend letting you search through the entities of the software catalog.

The pre-alpha is intended to solve for the following user stories, but will get
there by means of a front-end only, non-extensible MVP.

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

**Backstage Search Alpha**

Basic “out-of-the-box” in-memory indexing process of entities, and their metadata, registered to the Software Catalog.

We will consider Backstage Search to be in alpha when the above use-cases are
met, but built on top of a flexible, extensible platform.

- As an integrator, I should be able to provide all of the pre-alpha experiences
  to my users if I choose, but also be able to customize the experience using a
  composable set of components.
- As a plugin developer, I should have a standard way to expose my plugin's data
  to Backstage Search.
- As an integrator, I should still be able to expose everything in the Software
  Catalog in search, but it should be possible to customize what is searchable.
- As an integrator, although I should be able to customize all of the above, it
  should be possible to have the pre-alpha user experiences covered without
  having to set up and configure a search engine.

**Backstage Search Beta**

At least one production-ready search engine that supports the same use-cases as in the alpha.

We will consider Backstage Search to be in a beta phase when the above use-cases
are met, and can be deployed using a production-ready search engine.

- As an integrator, I should be able to power my Backstage Search experience
  (including querying and indexing) using a production-ready search engine like
  ElasticSearch.
- As an integrator, I should be able to configure the connection to my search
  engine in **app_config.yaml**.
- As an integrator, I should be able to tune the queries sent to my chosen
  search engine according to my organization's needs, but a sensible default
  query should be in place so that I am not required to do so.
