---
'@backstage/plugin-fossa': patch
---

Request a sorted response list to select the project with the correct title. The FOSSA API
matches title searches with "starts with" so previously it used the response for `my-project-part`
if you searched for `my-project`.
