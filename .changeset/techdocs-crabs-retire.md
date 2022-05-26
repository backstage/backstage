---
'@backstage/plugin-techdocs': patch
---

Restructures reader style transformations to improve code readability:

- Extracts the style rules to separate files;
- Creates a hook that processes each rule;
- And creates another hook that returns a transformer responsible for injecting them into the head tag of a given element.
