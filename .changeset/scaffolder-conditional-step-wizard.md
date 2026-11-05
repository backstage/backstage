---
'@backstage/plugin-scaffolder-react': minor
---

The scaffolder wizard now shows or hides parameter steps based on their `when` condition, and values from hidden steps are left out of the submitted parameters. Navigation stays on the current step when visibility changes. Steps that become visible must pass frontend validation before review, including steps that were hidden after an earlier validation. Changing a step definition, its effective validation constraints, or its shared input values requires validation again. Steps with custom validators must also be validated again after changes to the form context. Previously visited visible steps remain reachable so users can correct values needed by validation on another page.
