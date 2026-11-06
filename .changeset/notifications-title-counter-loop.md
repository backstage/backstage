---
'@backstage/plugin-notifications': patch
---

Fixed the browser tab title flickering between a page's previous and current title, and sometimes staying on the previous one, when a page changed its title twice in quick succession, for example while loading its data. The notifications sidebar item also no longer touches the title while there are no unread notifications or its title counter is disabled.
