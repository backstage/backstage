---
'@backstage/plugin-org': patch
---

Enhance user profile card configuration:

- Added a new optional `maxRelations` numerical configuration that controls over how many user groups are shown directly on the profile card:
  - If the setting is omitted, all relations will be shown.
  - If `maxRelations` is set to `0`, the list of user groups is not displayed.
  - If `maxRelations` is set to a positive number, up to that many groups are displayed.
  - If the user belongs to more groups than the specified limit, a clickable link appears that opens a dialog showing all associated user groups.
- A complementary boolean configuration, `hideIcons`, was added to optionally hide the visual icons associated with each group in the displayed list.
- Usage example:
  ```yaml
  # Example in app-config.yaml
  app:
    extensions:
      - entity-card:org/user-profile:
          config:
            maxRelations: 5 # (optional) Show up to 5 groups on the card
            hideIcons: true # (optional) Hide the group icons
  ```
