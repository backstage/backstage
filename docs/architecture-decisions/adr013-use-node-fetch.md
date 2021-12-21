---
id: adrs-adr013
title: 'ADR013: Use node-fetch for data fetching'
description: Architecture Decision Record (ADR) for HTTP data fetching packages
---

## Context

Using multiple HTTP packages for data fetching increases the complexity and the
support burden of keeping said package up to date.

## Decision

Node packages should use the `node-fetch` package for HTTP data fetching.
Isomorphic packages should use the `cross-fetch` as a development dependency and
rely on the built-in `fetch` API.

## Consequences

We will gradually transition away from third party packages such as `axios`,
`got` and others. Once we have transitioned to `node-fetch` we will add lint
rules to enforce this decision.
