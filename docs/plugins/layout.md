# Layout System

Backstage provides a layout system that allows you to customize the entire
layout of your app in a general way. There is a default layout with the familiar
colorful header and tab row, but you can also build your own layouts that fit
your needs.

## Design Goals

<!-- This part of the doc is to guide design and should be dropped later -->

### Roles priority

This is an ordered list of the priority of the different roles that need to
interact with the layout system. In general complexity should be pushed down the
list whenever there's an option to do that.

1. App Integrations - The experience for them should be simple and powerful
1. Plugin Builders - The system should stay out of the way of plugin development
1. Layout Builders - Building a layout could be a bit more complex, but not in
   the way it currently is.
1. Core Developers - Complexity goes here

### Goals & Constraints

These are a set of goals and constraints to guide the design of the layout
system.

- The system should add no additional complexity to existing apps.
- The system may add some complexity to plugins with regards to how they fit
  their content into a layout, which in the end is something we're lacking right
  now. There should be no other complexity on top of that.
- There should be one system that can be used by all parts of Backstage, e.g.
  entity pages, home page, search page, etc.
- The plugin API may have breaking changes but any migration should be
  effortless.

### Existing Problems

A list of problems with out current design that the layout system may attempt to
solve.

- Plugin developers have little control or ways of communicating the intended
  size and layout of their plugin content.
- The ownership of many visual layout elements like cards and headers are
  unnecessarily embedded withing plugins, making it impossible for app
  integrators to customize.
- Plugin developers do not have a set contract for how the layout of their
  components happen, i.e. `grid`/`flexbox`/`box`.
- Plugin developers do not have a convenient way to adapt their plugin content
  to the size of the area that they are given.

### Use-cases

A set of use-cases that the layout system attempts to cover.

- Complete layout switch a la Netflix. A complete overhaul of the
  header/tabs/content layout where headers and tabs are replaced.
- Generic and re-usable layout components that work well with various use-cases,
  such as a "home page layout" or "card page layout".
- Adaptive plugin cards that are able to change the way they show content based
  on the size that they are given.
- Switching out the vertical header/tabs/content layout for one with a vertical
  tab sidebar.
- Switching out the card wrapping component to something else than the MUI Card
  component
- Generic handling of the header items, "kebab menu"

## API Experiments

Now what might this look like x)

### Experiment 1

#### App PoV

```tsx
// Maybe it's possible to register a default layout in the app?
createApp({
  components: {
    DefaultLayout: MyCustomLayout,
  },
});
```

#### Layout PoV

```tsx
// The layout being a single component might be tricky though, could need to be an extension?
// Either way one way to implement one could be to pass in various pieces that we want to render
function MyCustomLayout({labels, menuItems, content}) {
  return (
    <Layout>
      <Header labels={labels} menuItems={menuItems}>
      {content}
    </Layout>
  )
}
```

#### Plugin PoV

```tsx
// It may be that these different layout elements call for a new extension type?
createPageExtension({
  component: () => import('./components/MyPage').then(m => m.MyPage),
  // Tbh these should probably always be controlled by the app
  menuItems: myMenuItems,
  labels: myLabels,
});
```

### Experiment 2

#### App PoV

```tsx
// It probably makes more sense to have the layout implemented as a provider to
// make it easier to apply different layouts to various parts of the app.
<MyCustomLayout>
  <Route path="/lighthouse" element={<LighthousePage />} />
  <Route path="/api-docs" element={<ApiExplorerPage />} />
  {/* We could also do <LayoutProvider layout={MyCustomLayout}>, maybe this is neater? */}
  <MyOtherCustomLayout>
    <Route path="/gcp-projects" element={<GcpProjectsPage />} />
  </MyOtherCustomLayout>
</MyCustomLayout>
```

#### Layout PoV

```tsx
// If the layout components themselves need to be part of the app element tree we need to
// wrap them up a bit. That's probably fine though as it gives us a nice place for docs
// and type inference too. Could be either a standalone thing or an extension (or both?)
const MyCustomLayout = createLayout({
  component: () =>
    import('./experiment1/MyCustomLayout').then(m => m.MyCustomLayout),
});
```

#### Plugin PoV

```tsx
// If the layout is provided through context, should that be consumed by plugins?
function MyPage() {
  // what would this even be?
  const layout = useLayout();

  // Could get some resolved size information?
  if (layout.size > 2) {
    /// ...
  }

  // Eh, this would probably be messy af, but could maybe have potential
  layout.provideMenuItem({
    /* ... */
  });
}
```
