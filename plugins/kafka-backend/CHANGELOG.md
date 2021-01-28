# @backstage/plugin-kafka-backend

## 0.2.0

### Minor Changes

- 234e7d985: Added support for multiple Kafka clusters and multiple consumers per component.
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

### Patch Changes

- Updated dependencies [26a3a6cf0]
- Updated dependencies [664dd08c9]
- Updated dependencies [9dd057662]
  - @backstage/backend-common@0.5.1

## 0.1.1

### Patch Changes

- Updated dependencies [def2307f3]
- Updated dependencies [0b135e7e0]
- Updated dependencies [294a70cab]
- Updated dependencies [0ea032763]
- Updated dependencies [5345a1f98]
- Updated dependencies [09a370426]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/backend-common@0.5.0
