'use client';

import { useState } from 'react';
import { CheckboxGroup } from '../../../../../packages/ui/src/components/CheckboxGroup/CheckboxGroup';
import { Checkbox } from '../../../../../packages/ui/src/components/Checkbox/Checkbox';
import { Text } from '../../../../../packages/ui/src/components/Text/Text';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';

export const Default = () => {
  return (
    <CheckboxGroup
      label="Choose platforms for notifications"
      defaultValue={['github']}
    >
      <Checkbox value="github">GitHub</Checkbox>
      <Checkbox value="slack">Slack</Checkbox>
      <Checkbox value="email">Email</Checkbox>
    </CheckboxGroup>
  );
};

export const Controlled = () => {
  const [values, setValues] = useState<string[]>(['email']);

  return (
    <Flex direction="column" gap="2">
      <CheckboxGroup
        label="Choose platforms for notifications"
        value={values}
        onChange={setValues}
      >
        <Checkbox value="github">GitHub</Checkbox>
        <Checkbox value="slack">Slack</Checkbox>
        <Checkbox value="email">Email</Checkbox>
      </CheckboxGroup>
      <Text>Selected: {values.join(', ') || 'none'}</Text>
    </Flex>
  );
};

export const Horizontal = () => (
  <CheckboxGroup
    label="Choose platforms for notifications"
    defaultValue={['github']}
    orientation="horizontal"
  >
    <Checkbox value="github">GitHub</Checkbox>
    <Checkbox value="slack">Slack</Checkbox>
    <Checkbox value="email">Email</Checkbox>
  </CheckboxGroup>
);

export const Disabled = () => (
  <CheckboxGroup
    label="Choose platforms for notifications"
    defaultValue={['github']}
    isDisabled
  >
    <Checkbox value="github">GitHub</Checkbox>
    <Checkbox value="slack">Slack</Checkbox>
    <Checkbox value="email">Email</Checkbox>
  </CheckboxGroup>
);

export const DisabledSingle = () => (
  <CheckboxGroup
    label="Choose platforms for notifications"
    defaultValue={['github']}
  >
    <Checkbox value="github">GitHub</Checkbox>
    <Checkbox value="slack" isDisabled>
      Slack
    </Checkbox>
    <Checkbox value="email">Email</Checkbox>
  </CheckboxGroup>
);

export const Validation = () => (
  <CheckboxGroup
    label="Choose platforms for notifications"
    defaultValue={['github']}
    validationBehavior="aria"
    validate={(value: string[]) =>
      value.includes('slack') ? 'Slack is not available in your region.' : null
    }
  >
    <Checkbox value="github">GitHub</Checkbox>
    <Checkbox value="slack">Slack</Checkbox>
    <Checkbox value="email">Email</Checkbox>
  </CheckboxGroup>
);

export const ReadOnly = () => (
  <CheckboxGroup
    label="Choose platforms for notifications"
    defaultValue={['github']}
    isReadOnly
  >
    <Checkbox value="github">GitHub</Checkbox>
    <Checkbox value="slack">Slack</Checkbox>
    <Checkbox value="email">Email</Checkbox>
  </CheckboxGroup>
);
