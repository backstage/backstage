'use client';

import { ToggleButton } from '../../../../../packages/ui/src/components/ToggleButton/ToggleButton';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { RiCheckLine } from '@remixicon/react';
import { useState } from 'react';

export const Default = () => {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <ToggleButton isSelected={isSelected} onChange={setIsSelected}>
      Toggle
    </ToggleButton>
  );
};

export const WithIcon = () => {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <ToggleButton
      isSelected={isSelected}
      onChange={setIsSelected}
      iconStart={<RiCheckLine />}
    >
      With Icon
    </ToggleButton>
  );
};

export const Sizes = () => {
  const [small, setSmall] = useState(false);
  const [medium, setMedium] = useState(false);

  return (
    <Flex align="center" gap="2">
      <ToggleButton size="small" isSelected={small} onChange={setSmall}>
        Small
      </ToggleButton>
      <ToggleButton size="medium" isSelected={medium} onChange={setMedium}>
        Medium
      </ToggleButton>
    </Flex>
  );
};

export const Disabled = () => {
  return (
    <Flex gap="2">
      <ToggleButton isDisabled isSelected={false} onChange={() => {}}>
        Disabled Off
      </ToggleButton>
      <ToggleButton isDisabled isSelected={true} onChange={() => {}}>
        Disabled On
      </ToggleButton>
    </Flex>
  );
};
