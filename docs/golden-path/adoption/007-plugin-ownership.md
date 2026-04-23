---
id: plugin-ownership
sidebar_label: 007 - Plugin Ownership
title: Plugin Ownership
description: How to establish and manage plugin ownership across your organization
---

You're now well on your way to a healthy Backstage instance! It's been launched to the whole company and you're loving the feedback developers are giving you. Some developers have even started expressing interest in writing their own plugins.

## Inner source

Accepting internal contributions from other teams is a good sign that you are on the road to a developer portal tailored for your developers. This is a well-paved path with many upsides, but a few downsides as well. As your Backstage instance grows in size and age, those same developers may be difficult to find and your team may start to experience more friction updating Backstage.

### Readiness before you start

Inner sourcing is a genuinely rewarding initiative, but it works best when some
groundwork is already in place. Jumping into it too early can create unnecessary
friction for both the contributing teams and the team that owns Backstage.

Before inviting contributions, its a good idea to have the following in place:

- **A consistent starting point for new plugins.** Running `yarn new` out of the
  box will scaffold a working Backstage plugin, which is a great starting point.
  However, the CLI also supports
  [custom templates](../../tooling/cli/04-templates.md#creating-your-own-cli-templates)
  that you define yourself. With a custom template you can bake in your
  company's best practices, coding conventions, and shared components from the
  start, so every plugin begins from a baseline that already meets your
  standards rather than having contributors piece that together themselves.
- **Style guides.** Document the coding conventions your plugins follow. This
  includes TypeScript standards, test coverage expectations, and naming
  conventions.
- **UI and UX guidelines.** Contributors should know how their plugin is
  expected to look and behave within Backstage. Share your design system, any
  component libraries you use, and patterns for things like loading states and
  error handling.

Sharing these resources with a contributing team before they start is far more
effective than reviewing them in a pull request after the fact.

### Have a conversation before a team starts building

When a team comes to you wanting to build a plugin, that is a great sign. Take
some time to chat with them about what they have in mind. This is not a review
process, it is a chance to understand what they are building and make sure you
can set them up for success.

Some useful things to explore together:

- What does the plugin do, and what problem does it solve?
- Is this something specific to their team, or would it be useful to a broader
  audience across the organization?
- How do they plan to keep it maintained over time?

These conversations give you the context you need to point them toward the right
starting template, flag any overlap with existing plugins, and think about where
it fits.

## Registering plugins in your catalog

Once a team has built a plugin and it is ready for wider use, they should register it in the Software Catalog. This makes the plugin discoverable, gives
it a clear owner, and surfaces any dependencies that other teams need to be
aware of.

### Fill out catalog-info.yaml completely

When the plugin is registered in the catalog, the contributing team should make
sure their `catalog-info.yaml` is complete. At a minimum this means listing
themselves as the owner and documenting any dependencies on backend APIs,
external services, or other Backstage plugins. This gives other teams a clear
point of contact for questions or feedback, and an accurate picture of what the
plugin depends on.

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-plugin
  description: A short description of what this plugin does.
spec:
  type: plugin
  lifecycle: production
  owner: team-name
  dependsOn:
    - component:my-backend-api
```
