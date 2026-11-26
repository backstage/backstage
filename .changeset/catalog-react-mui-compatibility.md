---
'@backstage/plugin-catalog-react': patch
---

Migrated entity peek-ahead previews to Backstage UI, removing their Material UI v5 dependency. Previews retain delayed opening on hover and support keyboard navigation into their content. Email actions now link directly to the mail client.

**BREAKING PRODUCERS**: Removed the unused `entityPeekAheadPopover.entityCardActionsAriaLabel` and `entityPeekAheadPopover.emailCardAction.subTitle` translation keys. Remove these entries from custom translations; the details action uses `entityPeekAheadPopover.entityCardActionsTitle`, and email link destinations are no longer translated.
