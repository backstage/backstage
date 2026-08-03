---
id: customize-your-instance
sidebar_label: 005 - Customizing your instance
title: Customizing your instance
description: How to customize your Backstage instance based on user feedback
---

You now have evidence from developers and leadership support for continued investment. Use that evidence to decide what to change. Customization should make a validated workflow clearer or more useful; it should not become a substitute for product strategy.

## Prioritize the experience

For each proposed customization, ask:

- Which user and problem does this serve?
- What evidence shows that the change matters?
- Could an existing plugin or integration solve enough of the problem?
- Who will own the experience and maintain it after launch?
- How will you know whether the change helped?

Favor a small number of coherent workflows over a large collection of disconnected features. A portal that exposes every tool without a clear journey can reproduce the same fragmentation it was meant to reduce.

## Adopt or build

Start with the [Backstage plugin directory](https://backstage.io/plugins). Existing plugins can shorten delivery time and let your team benefit from community maintenance. Evaluate whether a plugin fits your user journey, security model, experience standards, and ownership expectations before adopting it.

Build a plugin when the workflow is important, specific to your organization, and not served well enough by an existing option. Account for product discovery, design, operation, upgrades, and long-term ownership—not only the initial implementation. If no team can commit to that lifecycle, reduce the scope or defer the work.

## Customize as a system

Branding can help developers recognize the portal as part of their internal platform, but it should not delay useful workflows. Establish shared navigation, language, components, and interaction patterns before different teams customize individual plugins. Reusable patterns make the portal more coherent and give future contributors a safer starting point.

## Learn from adopters

### [The Lego approach: Leveraging reusability for a seamless user experience](https://www.youtube.com/watch?v=QV40Yz2i3jQ)

_BackstageCon North America, 2024 · 24:30 video_

- Customize through reusable patterns so separate plugins do not become a fragmented user experience.
- Treat branding and component contribution as governed system decisions, not isolated page-level work.

### [Insights from internal developer portal rollouts in large enterprises](https://www.youtube.com/watch?v=DAjhjS2Xg4Q)

_BackstageCon North America, 2024 · 47:19 video_

- Decide whether to build or adopt from organizational scale, legacy constraints, and the custom workflows that create value—not from plugin count alone.
- Establish central experience and quality boundaries before inviting distributed templates or plugins.
