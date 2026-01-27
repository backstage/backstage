export const toggleButtonUsageSnippet = `import { ToggleButton } from '@backstage/ui';
import { useState } from 'react';

const [isSelected, setIsSelected] = useState(false);

<ToggleButton isSelected={isSelected} onChange={setIsSelected}>
  Toggle
</ToggleButton>`;

export const defaultSnippet = `const [isSelected, setIsSelected] = useState(false);

<ToggleButton isSelected={isSelected} onChange={setIsSelected}>
  Toggle
</ToggleButton>`;

export const withIconSnippet = `const [isSelected, setIsSelected] = useState(false);

<ToggleButton
  isSelected={isSelected}
  onChange={setIsSelected}
  iconStart={<RiCheckLine />}
>
  With Icon
</ToggleButton>`;

export const sizesSnippet = `<Flex align="center" gap="2">
  <ToggleButton size="small" isSelected={small} onChange={setSmall}>
    Small
  </ToggleButton>
  <ToggleButton size="medium" isSelected={medium} onChange={setMedium}>
    Medium
  </ToggleButton>
</Flex>`;

export const disabledSnippet = `<Flex gap="2">
  <ToggleButton isDisabled isSelected={false} onChange={() => {}}>
    Disabled Off
  </ToggleButton>
  <ToggleButton isDisabled isSelected={true} onChange={() => {}}>
    Disabled On
  </ToggleButton>
</Flex>`;
