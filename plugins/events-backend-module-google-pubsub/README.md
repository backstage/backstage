# @backstage/plugin-events-backend-module-google-pubsub

This package is a module for the `events-backend` backend plugin
and extends the events system with Google Pub/Sub related capabilities.

## Configuration

The following configuration enables the transfer of messages from a Google
Pub/Sub subscription into a topic on the Backstage events system.

```yaml
events:
  modules:
    googlePubSub:
      googlePubSubConsumingEventPublisher:
        subscriptions:
          # A unique key for your subscription, to be used in logging and metrics
          mySubscription:
            # The fully qualified name of the subscription
            subscriptionName: 'projects/my-google-project/subscriptions/github-enterprise-events'
            # The event system topic to transfer to. This can also be just a plain string
            targetTopic: 'github.{{ event.attributes.x-github-event }}'
```

The following configuration enables the transfer of events from a Backstage events topic into a Google
Pub/Sub topic.

```yaml
events:
  modules:
    googlePubSub:
      eventConsumingGooglePubSubPublisher:
        subscriptions:
          # A unique key for your subscription, to be used in logging and metrics
          mySubscription:
            # The source topic (or array of topics)
            sourceTopic: 'github'
            # The fully qualified name of the target topic
            targetTopicName: 'projects/my-google-project/topics/github-enterprise-events'
```

## Installation

1. Install this module
2. Add your configuration.

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-events-backend-module-google-pubsub
```

```ts
// packages/backend/src/index.ts
backend.add(import('@backstage/plugin-events-backend-module-google-pubsub'));
```
