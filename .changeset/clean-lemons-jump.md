---
'@backstage/core-components': patch
---

Button labels in the sidebar (previously displayed in uppercase) will be displayed in the case that is provided without any transformations.
For example, a sidebar button with the label "Search" will appear as Search, "search" will appear as search, "SEARCH" will appear as SEARCH etc.
This can potentially affect any overriding styles previously applied to change the appearance of Button labels in the Sidebar.
