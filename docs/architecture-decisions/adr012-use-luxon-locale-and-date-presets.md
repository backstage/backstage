---
id: adrs-adr012
title: ADR000: Use Luxon.toLocaleString and date/time presets
description: Architecture Decision Record (ADR) for using Luxon's toLocaleString method and date/time presets for displaying dates and times
---

## Context

User's locales will have their own style of reading dates. It's counter
intuitive to not have dates formatted in their familiar formats, it can cause
users to have to think harder about what the date is and could even lead to
interpreting dates incorrectly (e.g. 05/03/2021, this could be March 5th or May
3rd, depending on where the user is). At the moment, plugins are defining dates
and times using custom formats and the `toFormat` method, which leads to
inconsistent and unfamiliar formats.

## Decision

To keep the UI consistent and familiar to users, irrespective of their location,
we have decided that we use `toLocaleString` and Luxon's
[extensive list](https://github.com/moment/luxon/blob/master/docs/formatting.md#presets)
of Date and Time presets.

Here is an example:

```typescript
const date = new luxon.DateTime();

/* Avoid this: */
date.toFormat('yyyy LLL dd'); // 2014 Aug 06
date.toFormat('yyyy LLL dd hh:mm'); // 2014 Aug 06 12:01

/* Do this instead: */
date.toLocaleString(luxon.DateTime.DATE_MED); // US: Oct 14, 1983 | FR: 14 oct. 1983
date.toLocaleString(luxon.DateTime.DATETIME_MED); // US: Oct 14, 1983, 9:30 | FR: 14 oct. 1983 9:30
```

## Consequences

- We will need to audit the current places Date/Times are being displayed in the
  UI and update them to follow this ADR.
- We will need to keep in mind for reviewing PRs going forward to follow this
  ADR, or find/create a linting rule to automate this in the review process.
