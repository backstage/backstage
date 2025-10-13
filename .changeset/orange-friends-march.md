---
'@backstage/plugin-search': patch
---

Fix SearchModal Dialog not unmounting properly on close

Fixed issue where Dialog was hidden but not unmounted, preventing
Material-UI from removing overflow:hidden from body element.
Added tests to verify Dialog is properly removed from DOM.

Signed-off-by: fcamgz <fatihcamgoz@hotmail.com.tr>
