---
'@backstage/core-components': patch
'@backstage/plugin-catalog': patch
---

fixed route resolving (ssue #7741) when user cannot select a tab in any of the tabbed pages (like the Catalog page) if it shares the same initial letters as a preceding tab. (i.e. where tab with a path of /ci is followed by a path of /cid, user cannot select /cid as /ci will always be selected first).
