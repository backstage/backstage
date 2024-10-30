---
'@backstage/core-components': patch
---

Adds the ability to mock a media query per break point and to change the active break point during a test. Usage example:

```ts
const { set } = mockBreakpoint({
  initialBreakpoint: 'md',
  queryBreakpointMap: {
    '(min-width:1500px)': 'xl',
    '(min-width:1000px)': 'lg',
    '(min-width:700px)': 'md',
    '(min-width:400px)': 'sm',
    '(min-width:0px)': 'xs',
  },
});
// assertions for when the active break point is "md"
set('lg');
// assertions for when the active break point is "lg"
```
