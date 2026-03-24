---
'@backstage/ui': patch
---

Fixed `Cell` component to support rendering SVG elements and other non-text DOM content. When `textValue` is provided, children that require browser-specific APIs (such as `createElementNS` for SVG) are now safely skipped during the internal collection pass and rendered only in the real DOM.

To render custom content inside a `Cell`, provide a `textValue` for accessibility:

```tsx
<Cell textValue="sparkline chart">
  <svg width={100} height={20}>
    <rect x={0} y={0} width={100} height={20} fill="blue" />
  </svg>
</Cell>
```

**Affected components:** Cell
