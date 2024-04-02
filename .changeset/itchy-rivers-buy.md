---
'@backstage/plugin-scaffolder-backend': major
'@backstage/plugin-scaffolder-node': patch
---

We've added a function called "parseJSON" which receives an object transformed into a string, treats it and returns a parsed object which allows you to use each property of the object as values in the scaffolder template.
