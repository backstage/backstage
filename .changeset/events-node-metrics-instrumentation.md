---
'@backstage/plugin-events-node': patch
---

Added OpenTelemetry metrics instrumentation to the events service, recording `events.publish.duration` and `events.subscribe.process.duration` histograms for publish and subscribe operations. The optional `events.metrics.reportTopics` config option can be set to `true` to include the `events.topic` attribute in metrics for installations with a bounded set of topics.
