---
'@backstage/core-components': patch
---

Add `alignGauge` prop to the `GaugeCard`, and a small size version. When `alignGauge` is `'bottom'` the gauge will vertically align the gauge in the cards, even when the card titles span across multiple lines.
Add `alignContent` prop to the `InfoCard`, defaulting to `'normal'` with the option of `'bottom'` which vertically aligns the content to the bottom of the card.
