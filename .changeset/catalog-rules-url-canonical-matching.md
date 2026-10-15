---
'@backstage/plugin-catalog-backend': patch
---

Match URL locations in catalog rules in canonical form.

URL locations are now matched against catalog rules in a canonical form of the URL, so that rule decisions agree with how the location target is resolved when its content is fetched. URL patterns that relied on percent-encoded characters being matched as written, or on default ports being kept, no longer match and should be updated.
