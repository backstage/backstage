---
id: analytics
title: Plugin Analytics
description: Measuring usage of your Backstage instance.
---

Setting up, maintaining, and iterating on an instance of Backstage can be a
large investment. To help measure return on this investment, Backstage comes
with an event-based Analytics API that grants app integrators the flexibility to
collect and analyze Backstage usage in the analytics tool of their choice, while
providing plugin developers a standard interface for instrumenting key user
interactions.

## Concepts

- **Events** consist of, at a minimum, an `action` (like `click`) and a
  `subject` (like `thing that was clicked on`).
- **Attributes** represent additional dimensional data (in the form of key/value
  pairs) that may be provided on an event-by-event basis. To continue the above
  example, the URL a user clicked to might look like `{ "to": "/a/page" }`.
- **Context** represents the broader context in which an event took place. By
  default, information like `pluginId`, `extension`, and `routeRef` are
  provided.

This composition of events aims to allow analysis at different levels of detail,
enabling very granular questions (like "what is the most clicked on thing on a
particular route") as well as very high-level questions (like "what is the most
used plugin in my Backstage instance") to be answered.

## Supported Analytics Tools

While all that's needed to consume and forward these events to an analytics tool
is a concrete implementation of [AnalyticsApi][analytics-api-type], common
integrations are packaged and provided as plugins. Find your analytics tool of
choice below.

| Analytics Tool         | Support Status |
| ---------------------- | -------------- |
| [Google Analytics][ga] | Yes ✅         |

To suggest an integration, please [open an issue][add-tool] for the analytics
tool your organization uses. Or jump to [Writing Integrations][int-howto] to
learn how to contribute the integration yourself!

[ga]:
  https://github.com/backstage/backstage/blob/master/plugins/analytics-module-ga/README.md
[add-tool]:
  https://github.com/backstage/backstage/issues/new?assignees=&labels=plugin&template=plugin_template.md&title=%5BAnalytics+Module%5D+THE+ANALYTICS+TOOL+TO+INTEGRATE
[int-howto]: #writing-integrations
[analytics-api-type]:
  https://backstage.io/docs/reference/core-plugin-api.analyticsapi

## Key Events

The following table summarizes events that, depending on the plugins you have
installed, may be captured.

| Action     | Provided By    | Subject                                   |
| ---------- | -------------- | ----------------------------------------- |
| `navigate` | Backstage Core | The URL of the page that was navigated to |
| `click`    | Backstage Core | The text of the link that was clicked on  |

If there is an event you'd like to see captured, please [open an
issue][add-event] describing the event you want to see and the questions it
would help you answer. Or jump to [Capturing Events][event-howto] to learn how
to contribute the instrumentation yourself!

_OSS plugin maintainers: feel free to document your events in the table above._

[add-event]:
https://github.com/backstage/backstage/issues/new?assignees=&labels=enhancement&template=feature_template.md&title=[Analytics%20Event]:%20THE+EVENT+TO+CAPTURE
[event-howto]: #capturing-events

## Writing Integrations

Analytics event forwarding is implemented as a Backstage utility API. Just as
you might provide a custom API implementation for errors or SCM Authentication,
you can provide one for analytics.

The provided API need only provide a single method `captureEvent`, which takes
an `AnalyticsEvent` object.

```ts
import {
  analyticsApiRef,
  AnalyticsEvent,
  AnyApiFactory,
  createApiFactory,
} from '@backstage/core-plugin-api';

export const apis: AnyApiFactory[] = [
  createApiFactory(analyticsApiRef, {
    captureEvent: (event: AnalyticsEvent) => {
      window._AcmeAnalyticsQ.push(event);
    },
  }),
];
```

In reality, you would likely want to encapsulate instantiation logic and pull
some details from configuration. A more complete example might look like:

```ts
import {
  AnalyticsApi,
  analyticsApiRef,
  AnalyticsEvent,
  AnyApiFactory,
  configApiRef,
  createApiFactory,
} from '@backstage/core-plugin-api';
import { AcmeAnalytics } from 'acme-analytics';

class AcmeAnalytics implements AnalyticsApi {
  private constructor(accountId: number) {
    AcmeAnalytics.init(accountId);
  }

  static fromConfig(config) {
    const accountId = config.getString('app.analytics.acme.id');
    return new AcmeAnalytics(accountId);
  }

  captureEvent(event: AnalyticsEvent) {
    const { action, ...rest } = event;
    AcmeAnalytics.send(action, rest);
  }
}

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: analyticsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => AcmeAnalytics.fromConfig(configApi),
  }),
];
```

If you are integrating with an analytics service (as opposed to an internal
tool), consider contributing your API implementation as a plugin!

By convention, such packages should be named
`@backstage/analytics-module-[name]`, and any configuration should be keyed
under `app.analytics.[name]`.

## Capturing Events

To instrument an event in a component, start by retrieving an analytics tracker
using the `useAnalytics()` hook provided by `@backstage/core-plugin-api`. The
tracker includes a `captureEvent` method which takes an `action` and a `subject`
as arguments.

```ts
import { useAnalytics } from '@backstage/core-plugin-api';

const analytics = useAnalytics();
analytics.captureEvent('deploy', serviceName);
```

### Providing Extra Attributes

Additional dimensional `attributes` as well as a numeric `value` can be provided
on a third `options` argument if/when relevant for the event:

```ts
analytics.captureEvent('merge', pullRequestName, {
  value: pullRequestAgeInMinutes,
  attributes: {
    org,
    repo,
  },
});
```

In the above example, an event resembling the following object would be
captured:

```json
{
  "action": "merge",
  "subject": "Name of Pull Request",
  "value": 60,
  "attributes": {
    "org": "some-org",
    "repo": "some-repo"
  }
}
```

### Providing Context for Events

The `attributes` option is good for capturing details available to you within
the component that you're instrumenting. For capturing metadata only available
further up the react tree, or to help app integrators aggregate distinct events
by some common value, use an `<AnalyticsContext>`.

```tsx
import { AnalyticsContext, useAnalytics } from '@backstage/core-plugin-api';

const MyComponent = ({ value }) => {
  const analytics = useAnalytics();
  const handleClick = () => analytics.captureEvent('check', value);
  return <SomeThing value={value} onClick={handleClick} />;
};

const MyWrapper = () => {
  return (
    <AnalyticsContext attributes={{ segment: 'xyz' }}>
      <MyComponent value={'Some Value'} />
    </AnalyticsContext>
  );
};
```

In the above example, clicking on `<SomeThing />` would result in an analytics
event resembling:

```json
{
  "action": "check",
  "subject": "Some Value",
  "context": {
    "segment": "xyz"
  }
}
```

Note that, for brevity in the example above, the context keys provided by
Backstage core (`pluginId`, `extension`, and `routeRef`) have been omitted. In
reality, those details would be included alongside any additional context
provided by you.

Analytics contexts can be nested; their values are merged down the react tree,
allowing keys to be overwritten.

### Event Naming Considerations

An event is split into its constituent parts to enable analysis at various
levels of granularity. In order to maintain this flexibility at analysis-time,
it's important to keep each of these levels of detail disaggregated.

- Avoid providing an overly specific `action`. For example, instead of
  `filterEntityTable`, consider just using `filter` as the action, and allowing
  `EntityTable` to be specified as part of the event's `context` (most likely
  automatically as part of the `extension` in which the `filter` event was
  captured).

- On the flip side, when adding `attributes` to an event, look at existing
  events and see if the data you are capturing matches the intention, type, or
  even the content of _their_ `attributes`. For instance, it may be common for
  events that involve the Catalog to add details like entity `name`, `kind`,
  and/or `namespace` as `attributes`. Using the same keys in your event will
  ensure that events instrumented across plugins can easily be aggregated.

### Unit Testing Event Capture

The `@backstage/test-utils` package includes a `MockAnalyticsApi` implementation
that you can use in your unit tests to spy on and make assertions about any
analytics events captured.

Use it like this:

```tsx
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import { analyticsApiRef } from '@backstage/core-plugin-api';
import { MockAnalyticsApi, wrapInTestApp } from '@backstage/test-utils';
import { render, fireEvent, waitFor } from '@testing-library/react';

describe('SomeComponent', () => {
  it('should capture event on click', () => {
    // Use the Mock Analytics API to spy on event captures.
    const apiSpy = new MockAnalyticsApi();

    // Render the component being tested
    const { getByText } = render(
      wrapInTestApp(
        <ApiProvider apis={ApiRegistry.from([[analyticsApiRef, apiSpy]])}>
          <SomeComponentUnderTest />
        </ApiProvider>,
      ),
    );

    // Fire the event that triggers event capture.
    fireEvent.click(getByText('some component text'));

    // Assert that the event was captured with the expected data.
    await waitFor(() => {
      expect(apiSpy.getEvents()[0]).toMatchObject({
        action: 'expected action',
        subject: 'expected subject'',
        attributes: {
          foo: 'bar',
        },
      });
    });
  });
});
```
