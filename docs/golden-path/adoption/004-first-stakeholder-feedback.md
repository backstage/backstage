---
id: first-stakeholder-feedback
sidebar_label: 004 - Stakeholder Feedback
title: First round of stakeholder feedback
description: How to gather and incorporate stakeholder feedback on your Backstage PoC
---

Now that you have a PoC, use stakeholder feedback to decide what deserves further investment. The goal is not to collect a feature wish list. It is to understand whether the initial problem matters, where the proposed experience breaks down, and which change would create the most value next.

## Choose participants

Include people who experience the problem from different positions. Start with developers from the PoC cohort, then include adjacent teams, platform owners, and people who were not eager to participate. Early champions explain what creates enthusiasm; skeptical or infrequent users reveal barriers that champions may overlook.

If you have a platform or developer experience organization, involve it early. That team may eventually own the product or depend on it to deliver wider platform goals. A technical partner can also help translate feedback into realistic options without turning every interview into a design review.

When reviewing a custom plugin, also include the team that owns any service or
data source it integrates. They can identify operational constraints and warn
you about changes that may affect the plugin.

## Listen for evidence

Ask participants to describe recent work rather than speculate about features. Useful areas to explore include:

1. **Approval and handoff delays.** Which tasks depend on tickets, specialist teams, or undocumented contacts?
2. **User toil.** Which repetitive or error-prone steps slow developers down?
3. **Information sprawl.** Which services, owners, documents, or tools are difficult to find?
4. **Workarounds.** What have teams already built or documented to compensate for the problem?
5. **Adoption barriers.** What would prevent this person or team from changing its current workflow?

When possible, watch someone perform the task. Observed work often exposes missing context and cultural constraints that a feature request does not.

For a plugin, ask participants to complete the real workflow. Notice whether
they return to the plugin, still switch to another tool for part of the task, or
avoid it altogether. These behaviors reveal gaps more reliably than a feature
wish list.

## Turn feedback into decisions

Group the findings into patterns, then compare them with the outcome and measures agreed with leadership. Prioritize changes that remove a repeated barrier or strengthen the evidence for the next adoption stage. Avoid prioritizing an isolated request simply because it came from the most senior participant.

Close the feedback loop. Tell participants what you learned, what the team will change, and what it will not pursue yet. Keep a visible channel for follow-up and invite a small group of champions to test the next iteration. This demonstrates that participation affects the product and makes later adoption conversations more credible.

Low plugin adoption does not automatically mean the plugin needs more features.
Investigate discoverability, missing context, and workflow mismatches first.
[Post-launch feedback and analytics](./006-preparing-for-ga.md#operate-after-launch)
can help you decide whether to iterate, maintain, or retire the plugin.

## Learn from adopters

<!-- vale off -->

### [Countercultural: Backstage for consultants](https://www.youtube.com/watch?v=RTYVmMbkdNA)

<!-- vale on -->

_BackstageCon North America, 2024 · 9:36 video_

- Treat resistance as evidence about organizational culture, not merely as a technical adoption problem.
- Use existing communities to recruit varied perspectives, alpha testers, and champions, then reinforce participation through recognition and visible support.

### [Harmonizing strategy and engineering](https://www.youtube.com/watch?v=2t_Pdiu3B1E)

_KubeCon + CloudNativeCon North America, 2025 · 16:49 video_

- Keep product strategy and engineering decisions connected as feedback reveals different user groups.
- Evolve from the initial use case only when research shows how the next audience's needs differ.
