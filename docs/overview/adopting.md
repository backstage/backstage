---
id: adopting
title: Strategies for adopting
---

This document outlines some general best practices that have been key to
Backstage's success inside Spotify. Every organization is different and some of
these learnings will therefore not be applicable for your company. We are hoping
that this can become a living document, and strongly encourage you to contribute
back whatever learnings you gather while adopting Backstage inside your company.

## Organizational setup

The true value of Backstage is unlocked when it becomes _THE_ developer portal
at your company. As such it is important to recognize that you will need a
central team that owns your Backstage deployment and treats it like a product.

This team will have **four** primary objectives:

1. Maintain and operate your deployment of Backstage. This includes customer
   support, infrastructure, CI/CD and, as your Backstage product evolves,
   on-call support.

2. Drive adoption of customers (developers at your company).

3. Work with senior tech leadership and architects to ensure your organizations
   best practices for software development are encoded into a set of
   [Software Templates](../features/software-templates/index.md).

4. Evangelize Backstage as a central platform towards other
   infrastructure/platform teams.

## Internal evangelization

The last objective deserves more attention, since it is the least obvious, but
also the most critical to successfully creating a consolidated platform. When
done right, Backstage acts as a marketplace between infra/platform teams, and
end-users.

![pop](../assets/pop.png)

While anyone at your company can contribute to the platform, the vast majority
of work will be done by teams that also has internal engineers as their
customers. The central team should treat these _contributing teams_ as customers
of the platform as well.

These teams should be able to autonomously deliver value directly to their
customers. This done primarily by building [plugins](../plugins/index.md).
Contributing teams should themselves treat their plugins as, or part of, the
products they maintain.

> Case study: Inside Spotify we have a team that owns our CI platform. They
> don't only maintain the pipelines and build servers, but also expose their
> product in Backstage through a plugin. Since they also
> [maintain their own API](../plugins/call-existing-api.md), they can improve
> their product by iterating on API and UI in lockstep. Since the plugin is
> following our [platform design guidelines](../dls/design.md) their customers
> get a CI experience that is consistent with other tools on the platform (and
> the don't have to become experts in Jenkins).

## Metrics

Inside Spotify the number of contributing teams have increased significantly
over the years -- now exceeding 60.

- 🐣 **Phase 1:** Extensible frontend platform (Done ✅) - You will be able to
  easily create a single consistent UI layer for your internal infrastructure
  and tools. A set of reusable
  [UX patterns and components](https://backstage.io/storybook) help ensure a
  consistent experience between tools.

- 🐢 **Phase 2:** Service Catalog
  ([alpha released](https://backstage.io/blog/2020/06/22/backstage-service-catalog-alpha)) -
  With a single catalog, Backstage makes it easy for a team to manage ten
  services — and makes it possible for your company to manage thousands of them.

- 🐇 **Phase 3:** Ecosystem (later) - Everyone's infrastructure stack is
  different. By fostering a vibrant community of contributors we hope to provide
  an ecosystem of Open Source plugins/integrations that allows you to pick the
  tools that match your stack.
