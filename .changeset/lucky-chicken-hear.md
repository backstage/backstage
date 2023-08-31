---
'@backstage/plugin-code-coverage-backend': patch
---

Replace `express-xml-bodyparser` with `body-parser-xml`.

`express-xml-bodyparser` was last updated 8 years ago
and currently depends on a version of `xml2js` which
contains a vulnerability.

This change will swap it out in favor of `body-parser-xml`
which is more maintained and depends on a more recent `xml2js`
version without the vulnerability.
