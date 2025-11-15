---
'@backstage/ui': minor
---

**BREAKING**: Removed `Collapsible` component. Migrate to `Accordion` or use React Aria `Disclosure`.

## Migration Path 1: Accordion (Opinionated Styled Component)

Accordion provides preset styling with a similar component structure.

```diff
- import { Collapsible } from '@backstage/ui';
+ import { Accordion, AccordionTrigger, AccordionPanel } from '@backstage/ui';

- <Collapsible.Root>
-   <Collapsible.Trigger render={(props) => <Button {...props}>Toggle</Button>} />
-   <Collapsible.Panel>Content</Collapsible.Panel>
- </Collapsible.Root>

+ <Accordion>
+   <AccordionTrigger title="Toggle" />
+   <AccordionPanel>Content</AccordionPanel>
+ </Accordion>
```

CSS classes: `.bui-CollapsibleRoot` → `.bui-Accordion`, `.bui-CollapsibleTrigger` → `.bui-AccordionTrigger` (now on heading element), `.bui-CollapsiblePanel` → `.bui-AccordionPanel`

## Migration Path 2: React Aria Disclosure (Full Customization)

For custom styling without preset styles:

```tsx
import { Disclosure, Button, DisclosurePanel } from 'react-aria-components';

<Disclosure>
  <Button slot="trigger">Toggle</Button>
  <DisclosurePanel>Content</DisclosurePanel>
</Disclosure>;
```
