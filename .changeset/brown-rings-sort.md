---
'@backstage/ui': patch
---

Added interactive support to the `Card` component. Pass `onPress` to make the entire card surface pressable, or `href` to make it navigate to a URL. A transparent overlay handles the interaction while nested buttons and links remain independently clickable.
