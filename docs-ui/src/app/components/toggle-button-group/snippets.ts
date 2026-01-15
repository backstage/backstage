export const toggleButtonGroupUsageSnippet = `import { ToggleButtonGroup, ToggleButton } from '@backstage/ui';
import { useState } from 'react';

const [selected, setSelected] = useState<string[]>([]);

<ToggleButtonGroup
  selectionMode="multiple"
  selectedKeys={selected}
  onSelectionChange={(keys) => setSelected(Array.from(keys))}
>
  <ToggleButton id="bold" icon={<RiBold />} />
  <ToggleButton id="italic" icon={<RiItalic />} />
  <ToggleButton id="underline" icon={<RiUnderline />} />
</ToggleButtonGroup>`;

export const defaultSnippet = `const [selected, setSelected] = useState<string[]>([]);

<ToggleButtonGroup
  selectionMode="multiple"
  selectedKeys={selected}
  onSelectionChange={(keys) => setSelected(Array.from(keys))}
>
  <ToggleButton id="bold" icon={<RiBold />} />
  <ToggleButton id="italic" icon={<RiItalic />} />
  <ToggleButton id="underline" icon={<RiUnderline />} />
</ToggleButtonGroup>`;

export const singleSelectionSnippet = `const [selected, setSelected] = useState<string>('left');

<ToggleButtonGroup
  selectionMode="single"
  selectedKeys={[selected]}
  onSelectionChange={(keys) => {
    const key = Array.from(keys)[0];
    if (key) setSelected(key);
  }}
>
  <ToggleButton id="left">Left</ToggleButton>
  <ToggleButton id="center">Center</ToggleButton>
  <ToggleButton id="right">Right</ToggleButton>
</ToggleButtonGroup>`;

export const sizesSnippet = `<ToggleButtonGroup size="small" selectionMode="multiple">
  <ToggleButton id="bold" icon={<RiBold />} />
  <ToggleButton id="italic" icon={<RiItalic />} />
  <ToggleButton id="underline" icon={<RiUnderline />} />
</ToggleButtonGroup>

<ToggleButtonGroup size="medium" selectionMode="multiple">
  <ToggleButton id="bold" icon={<RiBold />} />
  <ToggleButton id="italic" icon={<RiItalic />} />
  <ToggleButton id="underline" icon={<RiUnderline />} />
</ToggleButtonGroup>`;

export const disabledSnippet = `<ToggleButtonGroup isDisabled selectionMode="multiple">
  <ToggleButton id="bold" icon={<RiBold />} />
  <ToggleButton id="italic" icon={<RiItalic />} />
  <ToggleButton id="underline" icon={<RiUnderline />} />
</ToggleButtonGroup>`;
