---
'@backstage/plugin-splunk-on-call': minor
---

Updated splunk-on-call plugin to use the REST endpoint (incident creation-acknowledgement-resolution).
It implies switching from `splunkOnCall.username` annotation to `splunkOnCall.eventsRestEndpoint` annotation, this is a breaking change.
