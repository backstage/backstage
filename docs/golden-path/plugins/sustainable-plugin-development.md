---
id: sustainable-plugin-development
sidebar_label: Sustainable plugin development
title: Sustainably developing plugins in Backstage
description: Best practices for maintaining and iterating on Backstage plugins long-term
---

Plugins are not created in a vacuum, they generally solve a customer ask, be that

- a business problem, like showing cloud spend
- a new integration, like showing data from an external vendor such as PagerDuty
- a developer pain point, like organizing information from disjoint or disorganized systems.

To ensure that your plugin lives the test of time, you'll need to figure out how to keep it up-to-date,

## Finding your stakeholders

Your internal developer teams are your customers. They are the ones who will use your plugin day-to-day, and they are the best source of truth for whether it's solving the right problems. Before writing a single line of code, it's worth spending time talking to them.

Start by identifying which teams are most affected by the problem you're trying to solve. If you're building a cloud spend plugin, talk to the teams who own cloud infrastructure. If you're consolidating on-call information, find the teams that own your incident response process. These are your primary stakeholders.

When you meet with them, listen for:

- **Pain points**: What manual steps are slowing them down? What information do they have to hunt for across multiple tools?
- **Frequency**: How often do they hit this problem? A daily frustration is worth more investment than a quarterly one.
- **Workarounds**: What are they doing today instead? Existing workarounds often reveal what the minimum viable solution needs to cover.

Secondary stakeholders like platform teams, engineering managers, or team leads can give you a broader view of organizational needs and help you prioritize across teams. They can also act as champions who drive adoption once your plugin ships.

Keep these conversations ongoing. A quick check-in after you ship an early version is often more valuable than a long requirements-gathering session upfront. Your stakeholders will give you much clearer feedback once they've seen something working.

## Iterating on your plugin

In many cases, your first version of a plugin will cut a few corners. This is a good sign; you're more focused on delivering a strong use case to continue development than over-indexing on your initial code. It may be temporary after all, if you don't get the response you're looking for!

So, how do you decide when you should iterate on your plugin?

The clearest signal is feedback from the teams using it. Go back to the stakeholders you identified earlier. Are they actually using the plugin? Are they hitting friction you didn't anticipate? Direct conversations and usage patterns will tell you far more than assumptions made during initial development.

Some common triggers for iteration:

- **Stakeholder feedback reveals a gap**: A team is using your plugin but still switching to another tool for one specific thing. That gap is your next iteration.
- **Adoption is lower than expected**: If teams aren't using it, find out why before adding features. The problem is often discoverability, missing context, or a workflow mismatch rather than missing functionality.
- **The underlying data or service has changed**: External systems evolve. If your plugin surfaces data from another service, keep a line open with the team that owns it so you're not caught off guard.
- **Analytics surface unexpected patterns**: Backstage has built-in support for analytics events. If you've instrumented your plugin, usage data can reveal which parts of your plugin are heavily used, which are ignored, and where users drop off. A page with high traffic but short visit times might indicate users aren't finding what they need.

Not every piece of feedback warrants an immediate change. Weigh requests against how broadly they apply; a request from one team may not justify the complexity it adds for everyone else. Your stakeholders are your best guide for prioritization here too.

## Ensuring the success of your plugin

A successful plugin is one that continues to be used, trusted, and improved over time. That doesn't happen by accident. It's the result of staying connected to the people who depend on it.

The foundations are straightforward:

- **Keep your stakeholder relationships active.** Don't treat the initial conversations as a one-time exercise. Check in regularly, especially after shipping new versions. The teams using your plugin are the fastest way to find out what's working and what isn't.
- **Let feedback drive your priorities.** It can be tempting to iterate on the parts of your plugin you find most interesting technically. Let usage patterns and stakeholder feedback anchor your roadmap instead.
- **Instrument your plugin.** Analytics give you signal between conversations. If a feature is being ignored, or a page has high drop-off, that's worth investigating before investing further in that direction.
- **Treat it like a product, not a project.** A plugin that ships and gets abandoned quickly loses the trust of its users. Even small, regular improvements signal that the plugin is maintained and worth relying on.

The common thread across all of this is that your developers are your customers. Keeping that relationship healthy is what separates a plugin that becomes a critical part of your developer portal from one that quietly gets bypassed.
