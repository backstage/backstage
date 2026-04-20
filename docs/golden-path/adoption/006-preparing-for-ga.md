---
id: preparing-for-ga
sidebar_label: 006 - Preparing for GA
title: Preparing for GA
description: How to prepare your Backstage instance for a company-wide general availability launch
---

We hope at this point that the developers you're working with have read the [golden path on deploying Backstage](../deployment/index.md). Your Backstage instance should be ready for the scale that comes with a full company launch.

## Launch announcements

Getting the word out is one of the most important parts of a successful general
availability (GA) launch. A good announcement does two things: it tells
developers that Backstage is available, and it tells them why they should care.

### Use your internal communication channels

Start with the channels your developers already use. Post in Slack or Teams
channels that reach engineering broadly, share a short write-up in your company
newsletter or engineering blog, and send a targeted email to team leads who can
cascade the message to their reports. Tailor the message for each channel; a
Slack announcement can be shorter and more conversational than a written post.

Lead with the problem Backstage solves for your developers, not with a list of
features. Developers respond better to "you no longer need to chase down
ownership information across five different tools" than "we have launched a
software catalog."

### Host an internal meetup or demo

A live demo builds trust in a way that a written announcement cannot. Developers
can see the product in action, ask questions, and leave with a concrete
impression of how Backstage fits into their day-to-day work.

Keep the demo short and focused. Walk through one or two high-value workflows,
ideally ones that address the pain points you identified during your stakeholder
feedback sessions. Leave time for questions. If the session is recorded, share
the recording in your communication channels so developers who couldn't attend can catch
up.

Consider running multiple sessions to reach different time zones or teams.
Smaller, more targeted demos for specific teams can be more effective than a
single large all-hands.

:::tip
Invite a developer from the teams that participated in your proof of concept
(PoC) to co-present. Peer endorsement carries more weight than a platform team
talking about their own product.
:::

## What to expect in the coming months

The period immediately after GA is often slower than you expect. This is normal.
Developers are busy, habits are hard to change, and adoption takes time to build
momentum. The goal in these early months is not to force adoption but to remove
the friction that prevents it.

### Listen to feedback early and often

Set up a clear feedback channel from day one. This could be a dedicated Slack
channel, a form, or a recurring office hours session. Make it visible in your
launch announcement so developers know where to go. The feedback you receive in
the first few weeks is some of the most valuable you will ever get, because it
reflects the real first-time experience.

Pay attention to the things developers are struggling with, not just the feature
requests. Struggles point to gaps in documentation, confusing workflows, or
missing integrations that are blocking adoption.

### Use analytics to guide your decisions

Backstage does not ship with usage analytics by default, but you can integrate
an analytics provider through the plugin ecosystem, you can find more information on this in the [Analytics](../../plugins/analytics.md) section of the Backstage documentation. Tracking which parts of
Backstage developers actually use helps you make informed decisions about where
to invest your time.

Look for patterns: Are developers landing on the catalog but not drilling into
entity pages? Is the search feature underused? Are Software Templates being
triggered but not completed? These signals tell you where the experience is
breaking down and where it is working well.

### Talk to your users directly

Analytics tell you what is happening. Conversations tell you why. Schedule
regular check-ins with developers across different teams, especially those who
were early adopters. Ask them what they use, what they avoid, and what would
make Backstage more useful in their daily work.

Short, informal conversations are often more revealing than formal surveys.
A five-minute chat with a developer who almost never opens Backstage can give
you more actionable insight than a month of dashboards.

## How to keep iterating

GA is not the finish line. The most successful Backstage instances are the ones
that keep improving after launch, driven by a clear process for taking feedback
and turning it into changes.

### Make decisions based on feedback

Prioritize work that addresses real developer pain points over work that feels
interesting to build. When you receive recurring feedback about the same issue,
treat that as a strong signal. When feedback is mixed or unclear, go back to
your users and dig deeper before committing to a direction.

Document the decisions you make and the reasoning behind them. This helps your
team stay aligned and gives you a record to reference when revisiting past
choices.

### Look for processes that could be improved

As Backstage matures in your organization, you will start to notice patterns in
how developers interact with it. Some of those patterns will reveal manual steps
that Backstage could automate, or workflows that exist outside Backstage that
would benefit from being brought in.

Review your catalog regularly. Are entities going stale? Is ownership information
drifting out of date? These are signs that the processes around Backstage need
attention, not the product itself. Work with teams to build the habits and
automation that keep the data accurate.

### Keep stakeholders informed

Your leadership and key stakeholders backed this investment. Keep them updated
with regular progress reports that connect Backstage's impact to the outcomes
they care about: developer productivity, reduced toil, faster onboarding, and
improved system reliability.

Share wins, but also be transparent about what is not working and what you plan
to do about it. Stakeholders who trust your judgment are more likely to continue
investing in the platform over time.
