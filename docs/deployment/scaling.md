---
id: scaling
title: Scaling Backstage Deployments
sidebar_label: Scaling
description: Scaling Backstage production deployments
---

There are several different methods for scaling Backstage deployments. The most
straight-forward one is to simply deploy multiple identical instances and distributing
incoming requests across them. The one requirement for this to work is that all instances
need to share the same external resources, such as the database, and optional caching or
search services. The Backstage backend plugins will coordinate through the database
to share state and coordinate work.

Another method for scaling Backstage deployments is to break apart the backend
into multiple different services, each running a different set of plugins. This
is a more advanced approach and requires you to be able to route requests to
the appropriate backends based on the plugin ID. Both for ingress, but also
internal traffic between Backstage backends, which is done by creating a custom
implementation of the [DiscoveryService](../reference/backend-plugin-api.discoveryservice.md) interface.

Lastly, you can also replicate the Backstage deployments across multiple regions.
This is not a pattern that there is built-in support for and typically only makes
sense to do for individual backend plugins.
