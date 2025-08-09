---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: In an attempt to align some of the API's around providing components to `Blueprints`, we've renamed the parameters for both the `RouterBlueprint` and `AppRootWrapperBlueprint` from `Component` to `component`.

```tsx
// old
RouterBlueprint.make({
  params: {
    Component: ({ children }) => <div>{children}</div>,
  },
});

// new
RouterBlueprint.make({
  params: {
    component: ({ children }) => <div>{children}</div>,
  },
});
```

```tsx
// old
AppRootWrapperBlueprint.make({
  params: {
    Component: ({ children }) => <div>{children}</div>,
  },
});

// new
AppRootWrapperBlueprint.make({
  params: {
    component: ({ children }) => <div>{children}</div>,
  },
});
```

As part of this change, the type for `component` has also changed from `ComponentType<PropsWithChildren<{}>>` to `(props: { children: ReactNode }) => JSX.Element | null` which is not breaking, just a little more reflective of the actual expected component.
