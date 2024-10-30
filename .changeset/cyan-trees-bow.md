---
'@backstage/plugin-events-node': patch
---

Fixed an issue where subscribing to events threw an error and gave up too easily. Calling the subscribe method will cause the background polling loop to keep trying to connect to the events backend, even if the initial request fails.

By default the events service will attempt to publish and subscribe to events from the events bus API in the events backend, but if it fails due to the events backend not being installed, it will bail and never try calling the API again. There is now a new `events.useEventBus` configuration and option for the `DefaultEventsService` that lets you control this behavior. You can set it to `'never'` to disabled API calls to the events backend completely, or `'always'` to never allow it to be disabled.
