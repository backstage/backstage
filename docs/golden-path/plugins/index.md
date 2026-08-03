---
id: index
sidebar_label: Backstage Plugins!
title: Backstage plugins
description: Learn why and how to build frontend and backend plugins in Backstage
---

## Prerequisites

Complete the [Create App Golden Path](../create-app/index.md) before starting
this guide.

## Scenario

You have an idea for a todo list tracker to build in your Backstage instance at
an upcoming company hackathon. Backstage unifies the information developers
need, so it should be able to track future tasks too.

Many Backstage plugins started in a similar way: a developer noticed that other
teams were manually compiling error-prone data, searching across disconnected
tools, or repeating work that interrupted their development flow. They created
a shared plugin to solve that problem.

## Why build plugins?

Backstage plugins bring external data and workflows into the developer portal.
Build one when a shared experience can reduce context switching, automate
organization-specific work, or help teams follow consistent practices.

Plugins also let teams reuse consistent user experiences and platform APIs
while keeping capabilities modular. When a use case is useful beyond your
organization, contributing the plugin can expand the Backstage ecosystem.

## Build the example plugin

This guide teaches you how to build a plugin and prepare it to become a
production-ready part of your developer portal. Start with the backend plugin,
where you will work with an HTTP API, a database, and the Backstage backend
system. Then build a frontend page and connect it to the API.

Continue with:

- [Backend plugins](./backend/001-first-steps.md).
- [Frontend plugins](./frontend/001-first-steps.md).
