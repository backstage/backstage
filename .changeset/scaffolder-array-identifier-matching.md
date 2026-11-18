---
'@backstage/plugin-scaffolder-backend': patch
---

Fixed matching of action input values in scaffolder permission policies, including identifiers that are provided as arrays of values, such as the path of the `gitlab:group:ensureExists` action. Conditional policies now apply to every identifier that the array denotes, including the parent groups that `gitlab:group:ensureExists` ensures along the way, so allow-list policies for that action need to allow those parent groups as well. Inputs that denote no identifiers at all, such as an empty array, are now rejected.
