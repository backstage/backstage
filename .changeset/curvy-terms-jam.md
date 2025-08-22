---
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-catalog-node': patch
---

Order catalog processors by priority.

This change enables the ordering of catalog processors by their priority,
allowing for more control over the catalog processing sequence.
The default priority is set to 20, and processors can be assigned a custom
priority to influence their execution order. Lower number indicates higher priority.
The priority can be set by implementing the `getPriority` method in the processor class
or by adding a `catalog.processors.<processorName>.priority` configuration
in the `app-config.yaml` file. The configuration takes precedence over the method.
