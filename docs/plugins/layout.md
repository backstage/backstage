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
- Proper handling of the support button. It's likely owned by the layout has
  methods for overriding who the support contacts are.
- User defined layouts with drag-and-drop.

## API Experiments

Now what might this look like x)

### Experiment 1 - What are layouts?

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

### Experiment 2 - Localized layouts?

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

### Experiment 3 - Who owns layout data?

#### App PoV

```tsx
// If we assume that the app controls the labels and menu items and whatnot, how?
<MyCustomLayout>
  <Route path="/lighthouse" element={<LighthousePage />} />
  <Route path="/api-docs" element={<ApiExplorerPage />} />
  {/* This is stupid, we need to bring some of the labels in from the plugin */}
  <MyOtherCustomLayout labels={{ plugin: 'gcp-project' }}>
    <Route path="/gcp-projects" element={<GcpProjectsPage />} />
  </MyOtherCustomLayout>
</MyCustomLayout>
```

#### Layout PoV

```tsx
// The layout implementation could handle a lot of things and provide a nicer
// API to the app integrators. With that any of our core layout APIs can be
// quite bulky with a lot of power if needed.
type Props = {
  labels: Record<string, string>;
};
const MyCustomLayout = createLayout<Props>({
  component: ({ labels, layoutApi }) => {
    // Maybe some API provided to layouts that they use?
    const allLabels = layoutApi.getLabels({ extraLabels: labels });
    return; // ... the layout
  },
});
```

#### Plugin PoV

```tsx
// It should actually be fine to keep using `createRoutableExtension`, it's just that we
// want to have it just provide contents instead of the entire layout in some cases.
createRoutableExtension({
  component: () => import('./components/MyPage').then(m => m.MyPage),
  labels: {
    // Providing header labels probably stop at this level, so we end up with
    // the ones provided here + the plugin system + overrides in the app
    // Overall this kind of pattern could be something that helps us out with the support button?
    extraPluginLabel: 'my-label',
  },
});
```

### Experiment 4 - What about cards?

Time to have a look at how cards and smaller pieces of content could be handled.

#### App PoV

Existing code:

```tsx
<Grid container spacing={3} alignItems="stretch">
  {entityWarningContent}
  <Grid item md={8} xs={12}>
    <EntityAboutCard variant="gridItem" />
  </Grid>

  <EntitySwitch>
    <EntitySwitch.Case if={isPagerDutyAvailable}>
      <Grid item md={6}>
        <EntityPagerDutyCard />
      </Grid>
    </EntitySwitch.Case>
  </EntitySwitch>

  <Grid item md={4} xs={12}>
    <EntityLinksCard />
  </Grid>

  {cicdCard}
</Grid>
```

Would it look any different?

```tsx
// It would probably make sense to have each layout provide their own primitives for how
// to do layout within them? And they could ofc also just defer to MUI grid or other things.
<EntityLayout.Grid container>
  {entityWarningContent}
  <EntityLayout.Grid item md={8} xs={12}>
    {/* This should not need the variant prop */}
    <EntityAboutCard />
  </EntityLayout.Grid>

  {/* Maybe there's an opportunity to flatten some of the APIs? */}
  {/* We didn't really want the layout primitives to be too specific though, but worth it? */}
  <EntityLayout.Grid item md={6} if={isPagerDutyAvailable}>
    <EntityPagerDutyCard />
  </EntityLayout.Grid>

  <EntityLayout.Grid item md={4} xs={12}>
    <EntityLinksCard />
  </EntityLayout.Grid>

  {cicdCard}
</EntityLayout.Grid>
```

Maybe needs a bit of help to keep things less verbose?

```tsx
<TheAwesomeEntityLayoutOverviewPageGrid>
  {({Item}) => (
    <>
      {entityWarningContent}
      <Item md={8} xs={12}>
        <EntityAboutCard />
      </Item>

      <Item md={6} if={isPagerDutyAvailable}>
        <EntityPagerDutyCard />
      </Item>

      <Item md={4} xs={12}>
        <EntityLinksCard />
      </Item>

      {/* This makes it tricky to spread out the definitions, so probably not a good idea */}
      {cicdCard}
    </>
  )}
</EntityLayout.Grid>
```

Although it could make a lot of sense to have a new card extension that is an
item in itself?

```tsx
<GridLayout>
  {/* What happens with other content like this? */}
  {entityWarningContent}

  {/*
    This does create a tight coupling between the layout implementation and the cards.
    Perhaps they shouldn't be called cards? Widget/Gadget/Slice/Item

    There could also be multiple types of smaller pieces that could potentially be
    handled by a layout, perhaps leave it completely open to extension?
  */}
  <EntityAboutCard />

  <EntitySwitch>
    <EntitySwitch.Case if={isPagerDutyAvailable}>
      <EntityPagerDutyCard />
    </EntitySwitch.Case>
  </EntitySwitch>

  {/*
    What about customizing the layout of the cards? It does feel a lot cleaner to separate
    the concerns of layout and content as it's done currently, might not be worth to remove
    that for this just slightly cleaner API.

    A benefit of this API is that we might be able to have a more tighter coupling to the card
    though, such as providing menu items and actions that the layout then gets to render.

    Maybe it's possible to have some kind of fallback rendering of theses cards so that
    if you put them in a regular MUI grid they get rendered as some default, but if you
    put them in a card-aware layout the layout is able to do a lot more?

    Still though, how do we manage the actual laying out of stuff?
  */}
  <EntityLinksCard />

  {cicdCard}
</GridLayout>
```

The home page plugin uses `Renderer`s for rendering cards in different ways,
perhaps that's something that can be worked into layout items?

```tsx
<GridLayout>
  {entityWarningContent}

  <GridLayout.Card size="medium">
    <EntityAboutCard />
  </GridLayout.Card>

  <EntitySwitch>
    <EntitySwitch.Case if={isPagerDutyAvailable}>
      <EntityPagerDutyCard />
    </EntitySwitch.Case>
  </EntitySwitch>

  {/* This could give us a way to group smaller things */}
  <GridLayout.Accordion size="medium">
    <EntityLinksCard />
    <EntityInsightsCard />
  </GridLayout.Accordion>

  {/*
    nesting? get a bit weird because some things are plain components and other ones
    are renderers, could definitely cause some confusion.

    Perhaps we pass renderers to cards after all? <EntityAboutCard renderer={GridLayout.CardRenderer} />
  */}
  <GridLayout.Column size="small">
    <GridLayout.Card>
      <EntityStuffCard />
    </GridLayout.Card>
    <GridLayout.Card>{cicdCard}</GridLayout.Card>
  </GridLayout.Column>
</GridLayout>
```

### Experiment 5 - How would we implement cards?

Let's look at some possible card managing implementations, as that's likely to
be the most complex part for now and we can let the further-up layout stuff grow
from it.

#### Core PoV

```tsx
function createCardExtension(options) {
  // very much pseudo code, but this would be similar to the home page plugin
  const { content, actions, settings } = await options.card;

  // Perhaps we pass in parameters for laying out the content? Probably a set
  // of minimum constraints or something like that, perhaps different types?
  const { params: layoutParams } = options.layout;

  // type?
  if (layoutParams.type === 'page') {
    throw new Error("A card can't be a page!");
  }

  // What contract are we actually trying to create here and how open can we keep it?
  // does the core need to know about all possible layout parameters? - probably.
  // The layout parameters would be produced by the implementer of a card and consumed
  // by the layout in order to give the correct space to a card.
  //
  // What do they actually need to contain and what established stuff can we lean on?
  // Maybe we can select a subset of DOM styles?
  //
  // Either way we want them to be evolvable over time

  // Prolly just a placeholder component that is consumed by the layout using element traversal
  const Extension = () => null;

  // Attach whatever we need, may want to wrap this up a bit with types and whatnot
  attachComponentData(Extension, 'core.layout', {
    params: layoutParams,
    content,
    actions,
    settings,
  });
}
```

#### Layout PoV

```tsx
function MyLayout({ children }) {
  return (
    <Main>
      <Header />
      <Content>{children}</Content>
    </Main>
  );
}

function MyTabbedLayout({ children }) {
  const { routes, content } = useLayoutRoutes(children);
  return (
    <Main>
      <Header />
      <RoutedTabs routes={routes} />
      <Content>{content}</Content>
    </Main>
  );
}

function MyCardLayout({ children }) {
  const cardLayouts = useElementFilter(children, collection =>
    collection
      .selectByComponentData({ key: 'core.layout', strictError: 'not a card' })
      .findComponentData({ key: 'core.layout' }),
  );
  // what now? it's be a pain to reconstruct things at this point, needs a different approach

  // Maybe this is just more of a context provider instead?
  return (
    <MyCardLayoutContext.Provider value={/* ... */}>
      {/* Could serve as the layout base too */}
      <Grid container spacing={3}>
        {/*
          Then the children could be grid items, but really this is up to each layout
          to implement in any way they want. The important contract is really between
          the layout and the content.
        */}
        {children}
      </Grid>
    </MyCardLayoutContext.Provider>
  );
}

function MyCardLayoutItem({ children, hints }) {
  // Pick out the card extension and make sure it's sane
  const layouts = useElementFilter(children, c =>
    c.findComponentData({ key: 'core.layout' }),
  );
  if (layouts.length !== 1) {
    throw new Error('only one card!');
  }
  const [layout] = layouts;
  if (layout.params.type !== 'card') {
    throw new Error('gotta be a card!');
  }

  // Then the bit where we actually wire things up for display
  return (
    <Grid item>
      <InfoCard actions={layout.actions} settings={layout.settings}>
        {/*
          Maybe something like this?

          It could also be providing a context for cards to be able to
          query about their space options etc.

          This is most likely a very good point to continue further work
          and getting more concrete. Nailing a layout contract component
          could likely shed light on what paths we have forward.
        */}
        <LayoutContract constraints={layout.params} hints={hints}>
          {layout.content}
        </LayoutContract>
      </InfoCard>
    </Grid>
  );
}
```

### Experiment 6 - How to LayoutContract?

#### Research

First off some research on prior art...

Some grid implementation, ideally we should be able to use any of these in the
end, but it's interesting to see how each of these handle sizing of their items:

- https://github.com/react-grid-layout/react-grid-Layout
  - https://github.com/react-grid-layout/react-grid-layout#grid-item-props
  - Uses "grid units", `x`, `y`, `w`, `h`, `minW`, `maxW`, `minH`, `maxH`
- http://dsmorse.github.io/gridster.js/
  - Similar to react-grid-layout
- https://packery.metafizzy.co/
  - Just CSS? not entirely sure to be honest
- https://www.npmjs.com/package/@egjs/react-grid
  - CSS sizing but with specific direction
- https://mui.com/components/grid/
  - Good old MUI Grid. Sized using responsive break point in divisions of 12
  - Cross-axis size is left as an exercise to the reader - usually by nesting
- Plain CSS grid or flex:
  - Grid items sized by the grid itself along with spanning multiple cells
  - Flex doesn't always fill all space, which is why MUI Grid sometimes looks
    quite awkward.

---

Why not a tiling layout? 🤔

Stuff like https://www.npmjs.com/package/react-collapse-pane, doesn't need to be
editable by the user though. Could be a good first implementation as it's
probably relatively simple to do - although responsiveness could be a problem.

---

We actually likely want to have layouts that behave a lot like image layouts
that avoid shuffling content as images load, perhaps there's something there?

... nope, all just dynamic detection which makes sense, otherwise you gotta just
set the size.

---

Probably just start with assuming that we're filling up all space given to us,
but then allow that to be limited (?) and queried in different ways.

---

So what could the actual parameters and constraints look like?

Some utilities...

- https://elementqueries.com/
- https://github.com/joeybaker/react-element-query
  - Only cares about width, should we too?
- https://www.npmjs.com/package/react-measure
- https://github.com/FezVrasta/react-resize-aware
- https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
  - Browser standard! Would be easy to lean on this, let's try it!

#### Implementation

[Off we go!](../../plugins/welcome/src/components/Experiment/Experiment6.tsx)

#### Learnings

A layout provider + card extension seems pretty smooth.

The internal layout contract seem sane as well and is likely something we can
use anywhere where content is supposed to be supplied.

The sizing and size parameters don't quite work out though. Getting the size
from the layout contract could be a nice utility, but one could also just have a
resize hook to use when it's actually needed.

Supplying layout parameters and whatnot doesn't work at all in this experiment,
as the laying out of cards is completely separate from the card wrapping.
Perhaps just drop that entire part of this and leave that to be completely open?

We probably want to continue in the direction of investigating just
LayoutContract + Layout providers of various kinds. We can figure out the exact
interface for the provider(s) at some point, but next experiment should probably
be around what one of these single layout items might looks like, probably a
card. There's also some naming that needs to be figured out. After that
experiment we could potentially then have a look at how to make it easy to
create custom layouts that work well with all parts of Backstage.

### Experiment 7 - What's in the Box?

Let's poke around the project and figure out what kind of properties of the
`InfoCard` people are using at the moment, and then make an attempt at some kind
of interface for describing that in a generic way.

#### Research - `InfoCard` usage

- `DocsCardGrid`
  - uses `ItemCardGrid` (?????)
- `EntitySplunkOnCallCard`
  - `Card` + `CardHeader` with `title`, `subheader` + Divider + `CardContent`
- `SonarQubeCard`
  - `title`, `deepLink`, `variant`, `headerProps` ..., `className` ...
- `EntitySentryCard`
  - `title`, `variant`
- `EntityPagerDutyCard`
  - `Card` + `CardHeader` with `title`, `subheader` + Divider + `CardContent`
- `EntityGroupProfileCard`
  - `title` (`CardTitle`), `subheader`, `variant`, `action`
- `EntityMembersListCard`
  - `Grid item` ???, then `InfoCard` with `title`, `subheader`, `action`
- `EntityOwnershipCard`
  - `title`, `variant`
- `EntityUserProfileCard`
  - `title` (`CardTitle`), `variant`
- `EntityLatestJenkinsRunCard`
  - `title`, `variant`
- `EntityILertCard`
  - Uses `Card`..., `CardHeader` with `title`, `subheader`, `action` + Divider +
    `CardContent
- `GitReleaseManagerPage`
  - `Box maxWith={999}` + `ContentHeader title='...'` + `InfoCardPlus`...
- `EntityFossaCard`
  - `title`, `deepLink`, `variant`, `className`
- `FirehydrantCard`
  - Plain `<InfoCard>`
- `EntityLatestCloudbuildRunCard`
  - `title`
- `EntityLatestCloudbuildsForBranchCard`
  - `title`
- `EntityAboutCard`
  - `Card` + `CardHeader` with `title`, `action` + `Divider` + `CardContent`
- `EntityLinksCard`
  - `title`, `variant`
- `EntityHasSystemsCard`
  - `RelatedEntitiesCard` -> `EntityTable` -> `Table` with `title`
- `EntityHasComponentsCard`
  - ''
- `EntityHasSubcomponentsCard`
  - ''
- `EntityHasResourcesCard`
  - ''
- `EntityDependsOnComponentsCard`
  - ''
- `EntityDependencyOfComponentsCard`
  - ''
- `EntityDependsOnResourcesCard`
  - ''
- `EntitySystemDiagramCard`
  - `title`

#### Plan

Looks like there's about as many different ways to do card extensions as there
are card extensions. The main pattern however seems to be an `InfoCard` with
`title`, `subheader`, `action`, and `deepLink`. The `variant` and `className`
usages are things we want to get rid of and standardize as part of the
`LayoutContract`. There are a couple of deconstructed `InfoCard` where `Card`
with `CardHeader` and `CardContent` is used instead, and these will need a
deeper look once we approach some kind of API, just to figure out why and if
it's something we need to support.

For the actual implementation of this experiment we'll want to look at a
concrete implementation that supports the basic `InfoCard` usage, but also
provides a way for the base card rendering to be replaced with something
completely different.

#### Implementation

[Off we go!](../../plugins/welcome/src/components/Experiment/Experiment7.tsx)

#### Learnings

The current solution for the home page cards puts a bit too much burden on the
consumer of the API. I'd really like to have an API where you give full
ownership of the layout to the provider, but full and simple control of all the
content to the consumer.

The inverted solutions like `useCardAction` do provide this, but the API surface
is quite large and the flow of information is pretty awkward. It's also a
non-standard pattern that has the risk of causing bugs like render loops.

The plain component solution using `LayoutCard` (or `render()`, but why?) use
standard things, but leave perhaps a little bit too much flexibility to the
consumer. Arguably that could be a good thing, but it can also make it tricky
for us to provide more utility around the management and implementation of cards
and layout components as a whole.

The non-standard object rendering solution is pretty nice, but has the drawback
of being non-standard. I'd argue that it's not very magic, as in the end it's
really just the fact that you can call React hooks that makes it different from
any regular function. I think this and the plain component solution are worth
exploring further, but will ditch the rest.
