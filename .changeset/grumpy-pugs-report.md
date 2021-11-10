---
'@backstage/core-components': patch
---

Add new way to override color selection to progress bar/gauge components.

`Gauge`, `LinearGauge` and `GaugeCard` all accept a `getColor` prop,
which is a function of the type:

```ts
export type GaugePropsGetColor = (args: {
  palette: Palette;
  value: number;
  inverse?: boolean;
  max?: number;
}) => string;
```

Return a standard CSS color string (e.g. "red", "#f02020"), and the gauge will
be set to that color.

If the prop is omitted, the default implementation is unchanged from previous
versions.
