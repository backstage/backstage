---
'@backstage/plugin-catalog-react': patch
---

Added OnBlur to TextField of the EntityOwnerPicker to set text to empty string. This fixes bug of when user types into picker then clicks off of it. Current behavior when the user returns to picker the list is still filtered off of previous text string, but no text is displayed.
