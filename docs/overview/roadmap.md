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

We have divided the project into three high-level _phases_ and we have already
begun work on various aspects of these phases:

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

## Detailed roadmap

### Ongoing work 🚧

- [Plugins for managing micro services end-2-end](https://github.com/spotify/backstage/milestone/14)
- [TechDocs v1](https://github.com/spotify/backstage/milestone/16)
- [Initial GraphQL API](https://github.com/spotify/backstage/milestone/13)
- Backstage Design Language System (DLS)
- Cloud Cost Insights plugin (from Spotify)
- Further improvements to platform documentation

### Future work 🔮

- [Backstage Beta](https://github.com/spotify/backstage/milestone/19)
- [Global search](https://github.com/spotify/backstage/issues/1499)
- [[TechDocs V.2] Stabilization release](https://github.com/spotify/backstage/milestone/17)
- Deploy a product demo at `demo.backstage.io`
- Plugin marketplace

### Completed milestones ✅

- [Improved and move documentation to backstage.io](https://backstage.io/docs/overview/what-is-backstage)
- [Backstage Service Catalog (alpha)](https://backstage.io/blog/2020/06/22/backstage-service-catalog-alpha)
- [Backstage Software Templates (alpha)](https://backstage.io/blog/2020/08/05/announcing-backstage-software-templates)
- [Make it possible to add custom auth providers](https://backstage.io/blog/2020/07/01/how-to-enable-authentication-in-backstage-using-passport)
- [TechDocs v0](https://github.com/spotify/backstage/milestone/15)
- CI plugins: CircleCI, Jenkins, GitHub Actions and TravisCI
- [Service API documentation](https://github.com/spotify/backstage/pull/1737)
- Backstage Service Catalog can read from: GitHub, GitLab,
  [Bitbucket](https://github.com/spotify/backstage/pull/1938)
- Support auth providers: Google, Okta, GitHub, GitLab,
  [auth0](https://github.com/spotify/backstage/pull/1611),
  [AWS](https://github.com/spotify/backstage/pull/1990)
