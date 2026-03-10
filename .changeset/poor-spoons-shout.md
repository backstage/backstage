---
'@backstage/plugin-skills': major
'@backstage/plugin-skills-backend': major
'@backstage/plugin-skills-common': major
'@backstage/plugin-skills-node': major
---

Add support for managing agent skills in Backstage.

This change introduces a new skills frontend and backend, along with shared client APIs and
a backend-side registration service. Backstage adopters can now publish skills from backend
plugins, browse available skills in the Backstage UI, inspect skill details and included
files, and install skills using the `npx skills add` CLI flow.

The backend plugin provides authenticated APIs for listing and reading skills, batch
registration for service callers, and root-level `/.well-known/skills` endpoints for
CLI-compatible skill discovery and file serving using [skills.sh](https://skills.sh).
Skills are stored with their source identity so adopters can track which service
registered them.

The frontend plugin adds pages for viewing all registered skills and showing
individual skill details. It also includes install command boxes with copy actions, making
it easier for users to copy the correct CLI command for either the full skills catalog or
an individual skill.

For backend plugin authors, the new node library makes it possible to register skills from
local files or supported SCM URLs. Additional skill files can be included alongside
`SKILL.md`, and registration supports partial success by warning and skipping invalid
or unreadable sources instead of failing the entire batch.
