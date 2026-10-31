---
name: plugin-analytics-instrumentation
description: Instrument a Backstage frontend plugin with analytics events using the Backstage Analytics API. Use this skill when adding, reviewing, or extending event capture (`captureEvent`, `AnalyticsContext`) in plugin components, deciding whether an interaction warrants an event, or writing tests for analytics behavior.
---

# Plugin Analytics Instrumentation Skill

This skill helps you add analytics instrumentation to a Backstage frontend plugin so that app integrators can measure how the plugin is used.

## Guiding principles

Follow these before writing a single `captureEvent` call.

### 1. Less is more — instrument semantic events, not every interaction

Capture events that represent things **your plugin is semantically responsible for** — the domain actions only your plugin knows how to describe. Events should reflect **user intent** (something a person chose to do), not the lifecycle of your UI. Avoid instrumenting generic UI noise that the framework or design system already handles.

Good candidates for plugin-owned events:

- A domain verb only your plugin performs (`deploy`, `create`, `merge`, `approve`, `trigger`, `refresh`, `rerun`).
- An outcome you uniquely know about (a search returning N results, a scaffolder template saving Y minutes, a task transitioning to a terminal state).
- A context-carrying interaction where the attributes matter (clicking a search result with its `rank` and `to` target).

Poor candidates — avoid these:

- Routine clicks on navigation links, buttons, tabs, menu items — these are covered by the `navigate` event and by built-in instrumentation in `@backstage/ui` (see next principle).
- Low-value UI state toggles (expanding a panel, opening a tooltip, hovering).
- Every field edit in a form — usually one `submit`-style event at the end captures the intent.
- Component lifecycle signals — mounts, unmounts, re-renders, effect firings, data fetches. These describe the machinery of the UI, not the user, and will fire in plenty of contexts the user never initiated (route prefetches, Suspense boundaries, tab switches). Narrow exceptions exist for terminal states the user _lands on_ (e.g. `not-found`).
- Events whose `action` and `subject` duplicate what is already captured upstream.

If you can't answer the question _"what question does this event help someone answer?"_ in one sentence, it's probably best not to add the event.

### 2. Prefer `@backstage/ui` components — they already instrument clicks

Components from `@backstage/ui` (BUI) have built-in click instrumentation wired to the Analytics API. As of today this includes at least `Link`, `ButtonLink`, `Tab`, `MenuItem`, `Tag`, and `Table` row clicks. When these components are used for navigation (i.e. rendered with an `href`), a `click` event is fired with the destination included as a `to` attribute. For most of them the `subject` is a best-effort human-readable label — the `aria-label`, the visible text, or the `href` as a fallback. `Table` rows are the exception: their `subject` is the `href` string itself, not derived from visible row content.

Consequences:

- If you render a `Link`/`ButtonLink` from `@backstage/ui`, you do **not** need to add a `click` event by hand. Doing so would produce duplicate events.
- If a plain `<a>` or a MUI button handles a navigation or action that you care about analytically, migrate it to the BUI equivalent first (see the `mui-to-bui-migration` skill). You'll get the click event for free and can focus your manual instrumentation on plugin-specific actions.
- Manual `captureEvent('click', ...)` calls are reserved for cases where **no** BUI component fits — for example, clicks on a canvas, a custom widget, or a non-link element whose interaction needs tracking.

#### Overriding the default event with `noTrack`

Occasionally a BUI component is the right UI primitive but the default event it fires isn't the one you want — for example, the interaction has a domain-specific verb (`approve`, `rerun`) rather than a generic `click`, or the subject should be a stable identifier rather than the visible link text. In that case, pass `noTrack` to suppress the built-in event and fire your own from the click handler:

```tsx
import { Link } from '@backstage/ui';
import { useAnalytics } from '@backstage/frontend-plugin-api';

function ApproveLink({ requestId, href }: Props) {
  const analytics = useAnalytics();
  return (
    <Link
      noTrack
      href={href}
      onClick={() => analytics.captureEvent('approve', requestId)}
    >
      Approve
    </Link>
  );
}
```

Reach for `noTrack` only when you're **replacing** the default event, not layering a second event on top of it. If both the default `click` and your custom event are useful, the custom one probably belongs on a different component or in a different handler. `noTrack` is available on all BUI components with built-in instrumentation (`Link`, `ButtonLink`, `Tab`, `MenuItem`, `Tag`, and `Table` rows).

### 3. Split events so analysis stays flexible

An `AnalyticsEvent` has an `action`, a `subject`, and surrounding `context` (which is filled in with `pluginId` and `extension` automatically). Keep each dimension disaggregated so questions can be answered at any level of granularity.

- **Action** is the verb — kept generic and reused across plugins (`click`, `search`, `filter`, `create`, `discover`). Avoid squashing what belongs in context into the action (e.g. don't use `filterEntityTable` — use `filter` and let the `extension` / `AnalyticsContext` identify the table).
- **Subject** is the noun — the specific thing acted upon (a PR name, a template name, a search term, a result title).
- **Attributes** are optional key/value dimensions available at capture time (`to`, `org`, `repo`, `entityRef`).
- **Context** is for metadata coming from further up the React tree, or shared across many events in a region.

When in doubt about attribute naming, reuse what existing events in the repo use (e.g. `entityRef` for catalog entities, `to` for destinations, `searchTypes` for search). Consistency across plugins makes aggregation possible.

## How to capture an event

Get a tracker with `useAnalytics()` and call `captureEvent(action, subject, options?)`.

```tsx
import { useAnalytics } from '@backstage/frontend-plugin-api';

function DeployButton({ serviceName }: { serviceName: string }) {
  const analytics = useAnalytics();
  const handleDeploy = () => {
    // ...perform the deploy
    analytics.captureEvent('deploy', serviceName);
  };
  return <Button onClick={handleDeploy}>Deploy</Button>;
}
```

For old-system plugins, the same hook is re-exported from `@backstage/core-plugin-api`; the behavior is identical. New plugins targeting the new frontend system should import from `@backstage/frontend-plugin-api`.

### Adding `value` and `attributes`

`value` is a single numeric metric associated with the event (duration, rank, count). `attributes` are dimensional string/number/boolean pairs.

```tsx
analytics.captureEvent('merge', pullRequestName, {
  value: pullRequestAgeInMinutes,
  attributes: { org, repo },
});
```

Keep attributes flat and serializable. Don't stuff large objects or PII in here.

### Using `AnalyticsContext` for ambient metadata

When the same attribute applies to many events under a subtree — or when the metadata lives further up the tree than the component firing the event — wrap the subtree in an `<AnalyticsContext>` instead of passing props down:

```tsx
import { AnalyticsContext } from '@backstage/frontend-plugin-api';

function TaskPage({ taskId, entityRef }: Props) {
  return (
    <AnalyticsContext attributes={{ taskId, entityRef }}>
      <TaskToolbar />
      <TaskTimeline />
    </AnalyticsContext>
  );
}
```

Every `captureEvent` fired inside that subtree will have `taskId` and `entityRef` merged into its `context`. Contexts nest and merge; inner values override outer ones.

Good uses of `AnalyticsContext`:

- Page- or route-level attributes that apply to every interaction on that page (`entityRef`, `taskId`, a tab selection).
- Cross-cutting aggregation keys that let app integrators group events (`segment`, `workspace`).

Don't wrap every small component in its own context — prefer to set context once at the boundary where the metadata first becomes available.

## Unit testing event capture

Use `mockApis.analytics()` from `@backstage/frontend-test-utils` — it returns a mock `AnalyticsApi` implementation with a `getEvents()` helper for assertions. Prefer one thorough test with multiple assertions over many small ones.

```tsx
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { analyticsApiRef } from '@backstage/frontend-plugin-api';
import {
  mockApis,
  TestApiProvider,
  wrapInTestApp,
} from '@backstage/frontend-test-utils';

it('captures a deploy event with the service name', async () => {
  const analytics = mockApis.analytics();

  render(
    wrapInTestApp(
      <TestApiProvider apis={[[analyticsApiRef, analytics]]}>
        <DeployButton serviceName="payments-api" />
      </TestApiProvider>,
    ),
  );

  fireEvent.click(await screen.findByRole('button', { name: /deploy/i }));

  await waitFor(() => {
    expect(analytics.getEvents()[0]).toMatchObject({
      action: 'deploy',
      subject: 'payments-api',
    });
  });
});
```

Assert on `action`, `subject`, and any `attributes`/`value` you explicitly set. Don't assert on auto-populated context keys like `pluginId` — those are the framework's responsibility.

## Review checklist

Before submitting instrumentation changes:

1. [ ] Every new `captureEvent` call represents a **plugin-semantic, user-initiated** action (not a click already covered by BUI, a navigation, or a component-lifecycle trigger).
2. [ ] Route to a BUI component (`Link`, `ButtonLink`, `Tab`, `MenuItem`, `Tag`, `Table`) wherever one fits, rather than instrumenting a plain element by hand.
3. [ ] `action` is a short generic verb; plugin/extension identity is left to the auto-populated `context`.
4. [ ] Attribute keys reuse established conventions where applicable (`entityRef`, `to`, `searchTypes`, etc.).
5. [ ] Shared attributes are set via a single `<AnalyticsContext>` at a boundary, not duplicated across events.
6. [ ] `value` is numeric and meaningful (duration, rank, count) — not a stand-in for a string dimension.
7. [ ] No PII, secrets, tokens, or large serialized payloads in attributes.
8. [ ] At least one unit test covers each new event using `MockAnalyticsApi`.
