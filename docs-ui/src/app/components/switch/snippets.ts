export const snippetUsage = `import { Switch } from '@backstage/ui';

<Switch />`;

export const defaultSnippet = `<Switch label="Switch" />`;

export const disabledSnippet = `<Switch label="Switch" isDisabled />`;

export const defaultSelectedSnippet = `<Switch label="Switch" defaultSelected />`;

export const readOnlySnippet = `<Switch label="Switch" isSelected isReadOnly />`;

export const controlledSnippet = `import { useState } from 'react';
import { Switch } from '@backstage/ui';

const [selected, setSelected] = useState(false);

<Switch
  label={selected ? 'On' : 'Off'}
  isSelected={selected}
  onChange={setSelected}
/>`;
