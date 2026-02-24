---
id: persistence
sidebar_label: 003 - Persisting your TODOs
title: 003 - Persisting your TODOs
---

## Saving Plugin State Indefinitely

You may have noticed that your list of TODOs disappears after you restart your Backstage backend. The general flow to restart your backend without having to rerun `yarn start` is to press ENTER on the terminal running `yarn start`. This will force the Backstage backend to restart completely, wiping out any in memory data and starting everything from scratch -- everything except your database.

### Quick intro to SQLite

SQLite is the default database for local development. It runs in memory (and can also run from a file on disk). It supports quick iteration cycles and can be easily deleted if anything goes wrong.

## Adding the `databaseService` to your plugin

<!--TODO-->

## Testing your changes
