---
id: first-stakeholder-feedback
sidebar_label: 003 - Evaluate the PoC
title: Evaluate the PoC
description: Compare a Backstage PoC with the original problem and decide what to do next
---

Evaluation turns a working PoC into evidence. The goal is not to collect a
feature wish list. It is to learn whether the original problem matters, whether
the proposed experience improves it, and what remains uncertain.

**Decision prompt:** Should we continue, adjust the approach, or pause?

## Observe the workflow

Ask the original cohort to complete the task represented by the PoC. When
possible, watch the work instead of relying only on opinions. Record the same
measure used for the baseline, then ask participants about:

1. **User toil:** Which repetitive or error-prone steps remain?
2. **Information gaps:** What was difficult to find or understand?
3. **Handoffs:** Where did the participant still need another person or tool?
4. **Workarounds:** What would they continue doing outside Backstage?
5. **Adoption barriers:** What would prevent them from using this experience in
   regular work?

Include skeptical participants as well as early champions. If the PoC integrates
another service or data source, involve its owning team so that operational
constraints are not mistaken for product feedback.

## Compare results with the hypothesis

Compare the observed result with the baseline and expected result in the PoC
charter. Quantitative evidence shows what changed; direct conversations help
explain why.

Group feedback into repeated patterns. Avoid prioritizing an isolated request
because it came from the most senior participant. Also avoid treating lower
than expected use as proof that the PoC needs more features. Discoverability,
missing context, or a workflow mismatch may be the more important finding.

## Worked example

Eight of ten on-call developers find the owner and runbook in under five
minutes, compared with three before the PoC. The median time falls from 15
minutes to three. Two participants still fail because the source documentation
is missing, not because they cannot navigate Backstage.

The group recommends continuing. It records catalog data quality as the main
risk and proposes testing automated ownership ingestion when the PoC evolves
into a shared pilot.

## Before you continue

You should now be able to explain what improved, what remained difficult, and
which evidence supports continuing, adjusting, or pausing the work. Share that
reasoning with participants and keep the unanswered questions visible to the
people making the next decision.

If the evidence supports continued work,
[request leadership investment](./004-leadership-buy-in.md).

## Learn from adopters

<!-- vale off -->

### [Countercultural: Backstage for consultants](https://www.youtube.com/watch?v=RTYVmMbkdNA)

<!-- vale on -->

_BackstageCon North America, 2024 · 9:36 video_

- Treat resistance as evidence about organizational culture, not merely as a
  technical adoption problem.
- Use existing communities to recruit varied perspectives and reinforce
  participation through recognition and visible support.

### [Harmonizing strategy and engineering](https://www.youtube.com/watch?v=2t_Pdiu3B1E)

_KubeCon + CloudNativeCon North America, 2025 · 16:49 video_

- Keep product strategy and engineering decisions connected as feedback reveals
  different user groups.
- Evolve from the initial use case only when research shows how the next
  audience's needs differ.
