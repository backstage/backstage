---
'@backstage/cli': patch
---

Fixed an issue where published frontend packages would end up with an invalid import structure if a single module imported both `.css` and `.svg` files.
