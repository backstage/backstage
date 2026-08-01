---
'@backstage/core-compat-api': patch
---

Apps migrating from the old frontend system no longer print a `RouterBlueprint` deprecation warning in the console at startup. The warning is meant for apps that deliberately replace the app root router, but the migration helper sets one up on the adopter's behalf, so the warning pointed at a choice the adopter had never made and there was nothing to act on. Apps that attach their own root router still see it.
