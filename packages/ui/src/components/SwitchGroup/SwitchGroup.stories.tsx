/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useState } from 'react';
import preview from '../../../../../.storybook/preview';
import { SwitchGroup } from './SwitchGroup';
import { Switch } from '../Switch/Switch';
import { Text } from '../Text';

const meta = preview.meta({
  title: 'Backstage UI/SwitchGroup',
  component: SwitchGroup,
});

export const Default = meta.story({
  args: {
    label: 'Notification preferences',
    defaultValue: ['email'],
  },
  render: args => (
    <SwitchGroup {...args}>
      <Switch value="email" label="Email notifications" />
      <Switch value="slack" label="Slack notifications" />
      <Switch value="push" label="Push notifications" />
    </SwitchGroup>
  ),
});

export const Controlled = meta.story({
  args: {
    label: 'Notification preferences',
  },
  render: args => {
    const [values, setValues] = useState<string[]>(['email']);

    return (
      <>
        <SwitchGroup {...args} value={values} onChange={setValues}>
          <Switch value="email" label="Email notifications" />
          <Switch value="slack" label="Slack notifications" />
          <Switch value="push" label="Push notifications" />
        </SwitchGroup>
        <Text>Selected: {values.join(', ') || 'none'}</Text>
      </>
    );
  },
});

export const Horizontal = meta.story({
  args: {
    ...Default.input.args,
    orientation: 'horizontal',
  },
  render: args => (
    <SwitchGroup {...args}>
      <Switch value="email" label="Email notifications" />
      <Switch value="slack" label="Slack notifications" />
      <Switch value="push" label="Push notifications" />
    </SwitchGroup>
  ),
});

export const Disabled = meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true,
  },
  render: args => (
    <SwitchGroup {...args}>
      <Switch value="email" label="Email notifications" />
      <Switch value="slack" label="Slack notifications" />
      <Switch value="push" label="Push notifications" />
    </SwitchGroup>
  ),
});

export const DisabledSingle = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => (
    <SwitchGroup {...args}>
      <Switch value="email" label="Email notifications" />
      <Switch value="slack" label="Slack notifications" isDisabled />
      <Switch value="push" label="Push notifications" />
    </SwitchGroup>
  ),
});

export const DisabledAndSelected = meta.story({
  args: {
    ...Default.input.args,
    defaultValue: ['slack'],
  },
  render: args => (
    <SwitchGroup {...args}>
      <Switch value="email" label="Email notifications" />
      <Switch value="slack" label="Slack notifications" isDisabled />
      <Switch value="push" label="Push notifications" />
    </SwitchGroup>
  ),
});

export const Invalid = meta.story({
  args: {
    ...Default.input.args,
    isInvalid: true,
  },
  render: args => (
    <SwitchGroup {...args}>
      <Switch value="email" label="Email notifications" />
      <Switch value="slack" label="Slack notifications" />
      <Switch value="push" label="Push notifications" />
    </SwitchGroup>
  ),
});

export const ReadOnly = meta.story({
  args: {
    ...Default.input.args,
    isReadOnly: true,
    defaultValue: ['email'],
  },
  render: args => (
    <SwitchGroup {...args}>
      <Switch value="email" label="Email notifications" />
      <Switch value="slack" label="Slack notifications" />
      <Switch value="push" label="Push notifications" />
    </SwitchGroup>
  ),
});

export const WithDescription = meta.story({
  args: {
    ...Default.input.args,
    description:
      'Select which channels you want to receive notifications through.',
  },
  render: args => (
    <SwitchGroup {...args}>
      <Switch value="email" label="Email notifications" />
      <Switch value="slack" label="Slack notifications" />
      <Switch value="push" label="Push notifications" />
    </SwitchGroup>
  ),
});

export const Required = meta.story({
  args: {
    ...Default.input.args,
    isRequired: true,
  },
  render: args => (
    <SwitchGroup {...args}>
      <Switch value="email" label="Email notifications" />
      <Switch value="slack" label="Slack notifications" />
      <Switch value="push" label="Push notifications" />
    </SwitchGroup>
  ),
});

export const Validation = meta.story({
  args: {
    ...Default.input.args,
    defaultValue: ['email', 'slack'],
    validationBehavior: 'aria',
    validate: (value: string[]) =>
      value.includes('slack')
        ? 'Slack notifications are not available in your region.'
        : null,
  },
  render: args => (
    <SwitchGroup {...args}>
      <Switch value="email" label="Email notifications" />
      <Switch value="slack" label="Slack notifications" />
      <Switch value="push" label="Push notifications" />
    </SwitchGroup>
  ),
});
