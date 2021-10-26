---
'@backstage/plugin-pagerduty': minor
---

# What is Changing

Switch from Integration-Key to ServiceId in the pagerduty plugin

# Why did this change

Integration key is a secret that shouldn't be committed to source code directly. Service Id is simply an identifier and can be safely committed

# How Does this Change Integrations

Simply change the `pagerduty.com/integration-key` annotation to `pagerduty.com/service-id` instead.

There is a workflow change that accompanies this where a user enters a title and a from email address when creating an incident from the backstage UI.
