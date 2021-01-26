---
'@backstage/plugin-kafka': minor
'@backstage/plugin-kafka-backend': minor
---

Added support for multiple Kafka clusters and multiple consumers per component.
Note that this introduces several breaking changes.

1. Configuration in `app-config.yaml` has changed to support the ability to configure multiple clusters. This means you are required to update the configs in the following way:

```diff
kafka:
   clientId: backstage
-  brokers:
-    - localhost:9092
+  clusters:
+    - name: prod
+      brokers:
+        - localhost:9092
```

2. Configuration of services has changed as well to support multiple clusters:

```diff
  annotations:
-    kafka.apache.org/consumer-groups: consumer
+    kafka.apache.org/consumer-groups: prod/consumer
```

3. Kafka Backend API has changed, so querying offsets of a consumer group is now done with the following query path:
   `/consumers/${clusterId}/${consumerGroup}/offsets`
