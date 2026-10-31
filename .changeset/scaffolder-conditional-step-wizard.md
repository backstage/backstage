---
'@backstage/plugin-scaffolder-react': minor
---

Added conditional step visibility in the scaffolder wizard. Parameter steps with a `when` field are now shown or hidden based on the current form state. When a step is hidden, its field values are excluded from the submitted parameters. Uses the same Nunjitsu expressions as backend parameter validation. Steps with identical titles keep separate identities during navigation.

Hidden values are removed at their field paths, including nested fields, array items, and local schema references. Fields shared with visible steps remain included.
