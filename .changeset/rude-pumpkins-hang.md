---
'@backstage/core-components': patch
---

Make `ErrorBoundary` display more helpful information about the error that
occurred.

The `slackChannel` (optional) prop can now be passed as an object on the form
`{ name: string; href?: string; }` in addition to the old string form. If you
are using the error boundary like

```tsx
<ErrorBoundary slackChannel="#support">
  <InnerComponent>
</ErrorBoundary>
```

you may like to migrate it to

```tsx
const support = {
  name: '#support',
  href: 'https://slack.com/channels/your-channel',
};

<ErrorBoundary slackChannel={support}>
  <InnerComponent>
</ErrorBoundary>
```

Also deprecated the prop `slackChannel` on `TabbedCard` and `InfoCard`, while
adding the prop `errorBoundaryProps` to replace it.
