# Debug: Tab Indicator Opacity Not Updating After Remount

## Context

PR: https://github.com/backstage/backstage/pull/33835

There's a bug where the active tab indicator disappears on page load for non-routed (uncontrolled) Tabs in Portal (but not in Storybook). The indicator briefly appears, then vanishes. Hovering a tab brings it back.

## What We Know So Far

### The component remounts

Debug logging in `TabsIndicators` revealed that the component is being **unmounted and remounted** (likely by the consumer app or React Strict Mode). The logs show `prevSelectedKey` (a `useRef`) resetting from `'overview'` back to `null`, confirming a fresh instance.

### First mount works, remount doesn't

- **First mount:** 4 renders happen before effects fire (selectedKey: undefined → null → null → 'overview'). By the time `updateCSSVariables` runs, `selectedKey` has settled to `'overview'` → opacity set to `1`.
- **Remount:** Effect fires with `selectedKey: undefined`, `tabRefsSize: 2` → hits the `else` branch → opacity set to `0`. Then `updateCSSVariables` **never fires again**, even though subsequent renders show `selectedKey: 'overview'`.

### The renders are interleaved from two instances

After the remount, the logs show renders from two different instances:

- Instance with `selectedKey: 'overview'`, `prevSelectedKey: 'overview'` (old/surviving)
- Instance with `selectedKey: undefined`, `prevSelectedKey: null` (remount)

The remount instance's `selectedKey` **never changes from `undefined`**. The `TabListStateContext` update doesn't seem to propagate to it.

### Console logs for reference

```
[TabsIndicators] render {selectedKey: undefined, prevSelectedKey: null, hoveredKey: undefined}
[TabsIndicators] render {selectedKey: null, prevSelectedKey: null, hoveredKey: undefined}
[TabsIndicators] updateCSSVariables {selectedKey: undefined, prevSelectedKey: null, tabRefsSize: 0}
[TabsIndicators] updateCSSVariables {selectedKey: null, prevSelectedKey: null, tabRefsSize: 0}
[TabsIndicators] render {selectedKey: null, prevSelectedKey: null, hoveredKey: undefined}
[TabsIndicators] render {selectedKey: 'overview', prevSelectedKey: null, hoveredKey: undefined}
[TabsIndicators] updateCSSVariables {selectedKey: 'overview', prevSelectedKey: null, tabRefsSize: 2}
[TabsIndicators] → set opacity 1 {selectedKey: 'overview'}
[TabsIndicators] render {selectedKey: undefined, prevSelectedKey: null, hoveredKey: undefined}
[TabsIndicators] render {selectedKey: 'overview', prevSelectedKey: 'overview', hoveredKey: undefined}
[TabsIndicators] updateCSSVariables {selectedKey: undefined, prevSelectedKey: null, tabRefsSize: 2}
[TabsIndicators] render {selectedKey: 'overview', prevSelectedKey: 'overview', hoveredKey: undefined}
[TabsIndicators] render {selectedKey: undefined, prevSelectedKey: null, hoveredKey: undefined}
[TabsIndicators] render {selectedKey: 'overview', prevSelectedKey: 'overview', hoveredKey: undefined}
[TabsIndicators] render {selectedKey: 'overview', prevSelectedKey: 'overview', hoveredKey: undefined}
```

## The Open Question

**Why doesn't `TabListStateContext` update propagate to the remount instance?**

The remount instance always sees `selectedKey: undefined` from `useContext(TabListStateContext)`. Meanwhile another instance in the same logs sees `selectedKey: 'overview'`. Either:

1. The remount instance is under a **different `TabListStateContext` provider** that never settles
2. The provider the remount instance consumes is **stale or disconnected**
3. There's something about React Aria's internal `Tabs` → `TabsInner` → `Provider` chain that doesn't re-provide the context after the state settles during a remount
4. React's reconciliation is reusing the DOM but creating a new component instance that doesn't subscribe to context updates properly

## Key Files

- `packages/ui/src/components/Tabs/TabsIndicators.tsx` — the component with the bug
- `packages/ui/src/components/Tabs/Tabs.tsx` — where `TabsIndicators` is rendered inside `TabList`
- `node_modules/react-aria-components/src/Tabs.tsx` — where `TabListStateContext` is provided (look at `TabsInner`, around line 180-220)
- `node_modules/@react-stately/tabs/src/useTabListState.ts` — where `selectedKey` is managed (look at the effect with no dependency array, around line 48-64)

## Suggested Investigation Steps

1. Add an instance ID to `TabsIndicators` (e.g. `useRef(Math.random())`) to distinguish the two instances in logs
2. Add logging to the `TabListStateContext` provider in react-aria-components to see if the context value is actually updating
3. Check if the `Tabs`/`TabList` parent components are also remounting — if the provider remounts, the new provider's `useTabListState` would start fresh with `selectedKey: null`
4. Check if Portal uses React Strict Mode (`<StrictMode>`) or if there's a Suspense boundary that could cause the remount
5. Check if there's a key prop changing on a parent component that forces the subtree to remount
