---
'@backstage/cli-module-build': patch
---

Suppress false-positive `@protobufjs/inquire` "Critical dependency" warning in the bundler. Since `protobufjs` 7.5.9, the dynamic require path in inquire is no longer exercised, but webpack/rspack still flags it during static analysis.
