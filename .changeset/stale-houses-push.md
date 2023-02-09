---
'@backstage/plugin-org': patch
---

Updated `LinksGroup` to use `Link` over `ListItem` as this makes the links more obvious and follows the pattern already used in the `GroupProfileCard`. Also updated the `GroupProfileCard` `ExtraDetails` story in Storybook to enable the `showLinks` feature whith this off there is no difference between it and the `default` story.
