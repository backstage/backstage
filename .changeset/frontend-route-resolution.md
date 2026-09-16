---
'@backstage/frontend-app-api': patch
---

Added resolution of route references by installed extension ID, alongside historical page-associated routes. Named module routes and external routes follow extension override precedence, and app assembly validates target extensions and parameter contracts. External bindings also support duplicated named refs and preserve explicitly disabled defaults.

Deprecated page registrations provide a fallback for extension-targeted refs when the target extension is absent, preserving hybrid conversion with generated or overridden extension IDs. Installed targets, including disabled ones, take precedence.

Module route overrides now redirect existing references to the original target, including duplicated refs and aliases exposed under multiple names. Final overrides are selected before validation; conflicting destinations, redirect cycles, and incompatible parameters cause app assembly to fail.
