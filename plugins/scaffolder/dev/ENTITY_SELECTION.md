# Selection-first entity picker experiment

This playground explores an alternative to the paginated entity pickers in
[#35558](https://github.com/backstage/backstage/pull/35558). It does not replace
the standard Scaffolder fields or export a new public component.

From the repository root, after installing dependencies:

```sh
yarn workspace @backstage/plugin-scaffolder start --entrypoint dev/entity-selection --config dev/app-config.entity-selection.yaml
```

Open <http://localhost:3011>. The catalog and identity are mocked; no backend or
sign-in is needed. The current and experimental pickers have independent values.
Try the single-owner, multiple-owner, and membership-filtered group scenarios,
9,000 entities, delayed responses, and request failures.

## Interaction

- The entire title row opens the popup, including when nothing is selected.
  A visible popup title describes the action, separately from the field label.
- Selected values below the title are links when the entity and its destination
  are known, and non-linked badges otherwise. They do not open the picker. The playground
  links to mock catalog destinations and can render selections inline or as a list.
- Selected items use small neutral BUI badges, with minimal padding and rounded
  corners. Real entities retain the presentation API's title, icon, and secondary
  title (as a native tooltip). Popup rows are not links or badges, and missing
  references keep their reference-derived labels.
- The popup uses one scrollable list. Existing selections are placed first when
  it opens; selecting or removing an item does not move any rows until reopening.
  Selected rows show a checkmark and removal button in reserved spaces, without
  changing the row layout. Filtering applies to both selected and unselected rows.
- Typing only filters; choosing a row commits its canonical entity reference.
  Escape, Done, or clicking outside discards the search, not the selections.
- When missing references are allowed, a valid name such as `freben` offers
  explicit User and Group choices. Exact lookups distinguish missing entities
  from entities outside the current page, and errors do not create missing choices.
- Picked references remain available for the rest of the popup session, including
  after deselection, even when absent from the catalog or the current page.
  Selected missing references remain removable after searching or reopening.
  Toggle `User freben exists in catalog` to see a saved selection acquire its
  catalog display name without changing its reference.
- Multi-selection preserves off-page choices and enforces its maximum of three.
- More results load automatically when the bottom of the results approaches the
  viewport, including when the initial list is too short to scroll. A failed
  request shows a retry button in that same position instead of retrying repeatedly.
- Loading feedback occupies a reserved slot at the bottom of the results, so
  starting or completing a page request does not resize the popup.
- `Clear selection` removes all selected values while keeping the popup and
  current filter open. It is disabled when nothing is selected.

## Deliberate boundaries

The picker uses BUI badges, links, buttons, search field, and popover, with a
custom React Aria selection list styled using BUI tokens. Whether
that generic composition belongs in BUI is an open design question, not a new
Scaffolder API commitment. The experiment has no direct MUI dependency; icons
supplied by the app's presentation API remain app-owned. The comparison picker
is unchanged. This is not a full accessibility certification.

The internal experiment accepts `renderItem` for non-interactive selected-item
content, `itemLayout` for inline/list layout, and `getItemHref` for caller-owned
destinations. It owns the links, trigger, and removal controls itself. None of
these props are exported as public APIs.

Normal results use catalog-side search and filtering. Exact reference choices
honor kind/name/namespace constraints, but intentionally bypass other filters
when missing references are allowed: a missing entity has no relations or spec
to inspect. The membership-filtered scenario therefore disables this feature.
Catalog permissions still determine which entities can be retrieved. Neither a
picker filter nor the missing-reference option is an authorization boundary.

This does not add entity references to the catalog search index: a partial full
reference is not a general substring search over every catalog reference. Pages
are fetched on demand but accumulated rows are not virtualized yet. Default field
integration, validation/helper text, translation, final styling, and the BUI
boundary remain follow-up decisions after evaluating the interaction.
