---
'@backstage/core-components': patch
---

fixed route resolving (issue #7741) when user cannot select a tab in any of the tabbed pages (like the Catalog page) if it shares the same initial letters as a preceding tab. (i.e. where tab with a path of /ci is followed by a path of /ci-2, user cannot select /ci-2 as /ci will always be selected first).
