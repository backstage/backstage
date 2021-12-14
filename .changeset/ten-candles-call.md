---
'@backstage/core-components': minor
'@backstage/plugin-scaffolder': minor
---

In @backstage/plugin-scaffolder - When user will have one option available in hostUrl or owner - autoselect and select component should be readonly.

in @backstage/core-components - Select component has extended API with few more props: native : boolean, disabled: boolean. native - if set to true - Select component will use native browser select picker (not rendered by Material UI lib ).
disabled - if set to true - action on component will not be possible.
