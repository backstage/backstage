'use client';

import { Checkbox } from '../../../../../packages/ui/src/components/Checkbox/Checkbox';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';

export const Default = () => {
  return <Checkbox>Accept terms and conditions</Checkbox>;
};

export const AllVariants = () => {
  return (
    <Flex direction="column" gap="2">
      <Checkbox>Unchecked</Checkbox>
      <Checkbox isSelected>Checked</Checkbox>
      <Checkbox isDisabled>Disabled</Checkbox>
      <Checkbox isSelected isDisabled>
        Checked & Disabled
      </Checkbox>
    </Flex>
  );
};
