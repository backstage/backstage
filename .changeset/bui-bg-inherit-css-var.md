---
'@backstage/ui': patch
---

Added a public `--bui-bg-inherit` CSS variable that resolves to the background
color of the nearest enclosing bg provider (`Box`, `Flex`, `Grid`, `Card`,
`Accordion`, or any element with a `data-bg` attribute), falling back to
`--bui-bg-app`. Use it from CSS for sticky or fixed elements that need to match
their surrounding surface without hardcoding a specific level.

```css
.searchBarContainer {
  position: sticky;
  top: 0;
  background-color: var(--bui-bg-inherit);
}
```

As part of this change, the `data-bg` painting rules previously duplicated in
`Box`, `Flex`, `Grid`, `Accordion`, and `Card` have been centralized into a
single source in `core.css`. Painting and component behavior are unchanged for
all existing usages, with one minor expansion: any element with a `data-bg`
attribute (including provider elements and any element that sets it directly)
is now painted, not only `Box`/`Flex`/`Grid`/`Card`/`Accordion` elements.
