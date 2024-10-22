---
'@backstage/plugin-scaffolder': patch
---

fix(scaffolder): use onInputChange instead onChange in RepoUrlPickerRepoName because need to keep the input value when move focus.
