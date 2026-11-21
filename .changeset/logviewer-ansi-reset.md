---
'@backstage/core-components': patch
---

Fixed `LogViewer` styles not being reset by ANSI reset codes such as `ESC[0m`, which made colors leak into the following text and lines. Combined codes such as `ESC[1;31m` are now applied as well.
