---
'@backstage/plugin-catalog-react': minor
---

**BREAKING**: Removed the 'summary' entity card type from `EntityCardType`. Users should migrate to using 'content' or 'info' card types instead.

TypeScript will now show errors if you try to use `type: 'summary'` when creating entity cards.
