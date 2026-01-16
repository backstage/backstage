---
'@backstage/ui': patch
---

Fixed Menu component trigger button not toggling correctly. Removed custom click-outside handler that was interfering with React Aria's built-in state management, allowing the menu to properly open and close when clicking the trigger button.
