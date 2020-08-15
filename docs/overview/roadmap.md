---
id: roadmap
title: Project roadmap
---

## Current status

Backstage is currently in Alpha. This means that you can expect APIs and
features to change until we reach our
[Backstage Beta milestone](https://github.com/spotify/backstage/milestone/19).
Before we have API stability, plugins will need ongoing maintenance. It is also
recommended that teams who adopt Backstage today upgrades their installation as
new [releases](https://github.com/spotify/backstage/releases) are available.

## Phases

We created Backstage about 4 years ago. While our internal version of Backstage
has had the benefit of time to mature and evolve, the first iteration of our
open source version is still nascent. We are envisioning three phases of the
project and we have already begun work on various aspects of these phases:

- 🐣 **Phase 1:** Extensible frontend platform (Done ✅) - You will be able to
  easily create a single consistent UI layer for your internal infrastructure
  and tools. A set of reusable
  [UX patterns and components](http://backstage.io/storybook) help ensure a
  consistent experience between tools.

- 🐢 **Phase 2:** Service Catalog
  ([alpha released](https://backstage.io/blog/2020/06/22/backstage-service-catalog-alpha)) -
  With a single catalog, Backstage makes it easy for a team to manage ten
  services — and makes it possible for your company to manage thousands of them.
  Developers can get a uniform overview of all their software and related
  resources, regardless of how and where they are running, as well as an easy
  way to onboard and manage those resources.

- 🐇 **Phase 3:** Ecosystem (later) - Everyone's infrastructure stack is
  different. By fostering a vibrant community of contributors we hope to provide
  an ecosystem of Open Source plugins/integrations that allows you to pick the
  tools that match your stack.

## Detailed roadmap

### Q2-Q3 2020

**Features**

- [Backstage Service Catalog (alpha)](https://backstage.io/blog/2020/06/22/backstage-service-catalog-alpha)
  ✅
- [Backstage Software Templates (alpha)](https://backstage.io/blog/2020/08/05/announcing-backstage-software-templates)
  ✅
- [TechDocs v0](https://github.com/spotify/backstage/milestone/15) ✅
- [TechDocs v1](https://github.com/spotify/backstage/milestone/16)
- [Initial GraphQL API](https://github.com/spotify/backstage/milestone/13)

**Platform**

- [Make it possible to add custom auth providers](https://github.com/spotify/backstage/milestone/8)
  ✅
- GitLab support in Backstage Service Catalog ✅
- Auth providers
  - Google, GitHub and GitLab ✅
  - [AWS](https://github.com/spotify/backstage/issues/290)

**Plugins**

- Plugins for managing micro services end-2-end
  - GitHub Actions ✅
  - CircleCI ✅
  - [Service API documentation](https://github.com/spotify/backstage/pull/1737)
  - Kubernetes deployment visualisation
  - PagerDuty

### Q4 2020

**Features**

**Platform**

**Plugins**
