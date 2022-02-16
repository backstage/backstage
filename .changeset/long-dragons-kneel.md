---
'@backstage/plugin-home': patch
---

Add Renderer support for the HomePageToolkit component.

Previously `<HomePageToolkit Renderer={ComponentAccordion} Tools={[]} />` would
result in the error `can't access property "map", props.tools is undefined`.
This change adds a context that can pass props down to the HomePageToolkit.
Also introduced is an `expanded` prop on the `ComponentAccordion` to setting
the default expanded state. See `In Accordian` story for details.
