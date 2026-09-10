---
'@backstage/plugin-scaffolder-react': patch
---

Fixed the scaffolder `Stepper` ignoring browser back/forward navigation. Previously the wizard's active step lived only in React state, so no history entries were pushed as a user moved through steps — the browser's (or a mouse's) back/forward buttons would skip the whole wizard and land on whichever page was open before the template was opened, instead of stepping back and forward like the on-page Back/Next buttons do. Each step change now also pushes a history entry, and a `popstate` listener drives the step back in sync with it.
