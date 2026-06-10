---
'@backstage/plugin-catalog': patch
---

Added the correctly-spelled `RelatedEntitiesCard.domainEntityColumns` static property and deprecated the previous typoed `RelatedEntitiesCard.domainEntityColums` property. Existing references to the old property continue to work; switch to `domainEntityColumns` to avoid future removal.
