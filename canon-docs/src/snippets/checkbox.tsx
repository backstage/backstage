'use client';

import { Checkbox, Flex, Text } from '../../../packages/canon';

export const CheckboxPreview = () => {
  return <Checkbox label="Accept terms and conditions" />;
};

export const CheckboxAllVariants = () => {
  return (
    <Flex align="center">
      <Checkbox />
      <Checkbox checked />
      <Checkbox label="Checkbox" />
      <Checkbox label="Checkbox" checked />
    </Flex>
  );
};

export const CheckboxPlayground = () => {
  return (
    <Flex direction="column">
      <Text>All variants</Text>
      <Flex align="center">
        <Checkbox />
        <Checkbox checked />
        <Checkbox label="Checkbox" />
        <Checkbox label="Checkbox" checked />
      </Flex>
    </Flex>
  );
};
