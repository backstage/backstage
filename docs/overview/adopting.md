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
   support, infrastructure, CI/CD and, as your Backstage product grows, on-call
   support.

2. Drive adoption of customers (developers at your company).

3. Work with senior tech leadership and architects to ensure your organizations
   best practices for software development are encoded into a set of
   [Software Templates](../features/software-templates/index.md).

4. Evangelize Backstage as a central platform towards other
   infrastructure/platform teams.

## Internal evangelization

The last objective deserves more attention, since it is the least obvious, but
also the most critical to successfully creating a consolidated platform. When
done right, Backstage acts as a "platform of platforms" or marketplace between
infra/platform teams and end-users:

![pop](../assets/pop.png)

While anyone at your company can contribute to the platform, the vast majority
of work will be done by teams that also has internal engineers as their
customers. The central team should treat these _contributing teams_ as customers
of the platform as well.

These teams should be able to autonomously deliver value directly to their
customers. This is done primarily by building [plugins](../plugins/index.md).
Contributing teams should themselves treat their plugins as, or part of, the
products they maintain.

> Case study: Inside Spotify we have a team that owns our CI platform. They
> don't only maintain the pipelines and build servers, but also expose their
> product in Backstage through a plugin. Since they also
> [maintain their own API](../plugins/call-existing-api.md), they can improve
> their product by iterating on API and UI in lockstep. Because the plugin
> follows our [platform design guidelines](../dls/design.md) their customers get
> a CI experience that is consistent with other tools on the platform (and the
> don't have to become experts in Jenkins).

### Tactics

Example of tactics we have used to evangelize Backstage internally:

- Arrange "Lunch & Learns" and seminars. Frequently offer teams interested
  Backstage development to come to a seminar where we show how to build a plugin
  from scratch.
- Embedding. As contributing teams start development of their first plugin it is
  often very appreciated to have one person from the central team come over and
  "embed" for a Sprint or two.
- Hack days. Backstage-focused Hackathons or hack days is a fun way to get
  people into plugin development.
- Show & tell meetings. In order to build an internal community around Backstage
  we have quarterly meetings where anyone working on Backstage is invited to
  present their work. This is a not only a great way to get early feedback, but
  also helps coordination between teams that are building overlapping
  experiences.
- Provide metrics. Add instrumentation to your Backstage deployment and make
  metrics available to contributing teams. At Spotify we have even gone so far
  as sending out weekly digest email showing how usage metrics have changed for
  individual plugins.
- Pro-actively identify new plugins. Reach out to teams that own internal UIs or
  platforms that you think would make sense to consolidate into Backstage.

## Metrics

Inside Spotify the number of contributing teams have increased significantly
over the years -- now exceeding 60.

- Number of deploys per developer/day
- Number of experiments run per developer/month
- Nr of PRs merged per developer/day
- etc

* **Onboarding time** New engineers.

* **Context switching** Service Catalog

* **Deploys to production** .

* **Deploys to production** .

* **T-shapedness**
  [T-shaped](https://medium.com/@jchyip/why-t-shaped-people-e8706198e437).

* **eNPS** .

- Onboarding time for a new engineer -- measured in "time until 10th PR" (before
  Backstage: ~45 days, now: 22 days)
- Context switching -- number of different tools an engineer have to interact
  with in order to get a certain job done (used to be 7-8 systems just to follow
  your code into production, now it's down to 2 (GitHub, Backstage)
- Surveys asking about how productive people feel, how easy it is to find
  information, etc.

To track the "platform health" of Backstage I look at things like:

- Nr of teams that have contributed at least one plugin (currently 63, see
  below)
- Nr of total plugins (currently 135, see below)
- % of contributions coming from outside the Backstage core team (currently 85%)

Success as a platform:
