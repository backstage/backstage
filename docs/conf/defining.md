---
id: defining
title: Defining Configuration for your Plugin
---

There is currently no tooling support or helpers for defining plugin
configuration. But it's on the roadmap.

Meanwhile, document the config values that you are reading in your plugin
README.

## Format

When defining configuration for your plugin, keep keys camelCased and stick to
existing casing conventions such as `baseUrl`.

It is also usually best to prefer objects over arrays, as it makes it possible
to override individual values using separate files or environment variables.
