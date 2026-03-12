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
import { CheckboxGroup } from './CheckboxGroup';
import { Checkbox } from '../Checkbox/Checkbox';
import { Text } from '../Text';

const meta = preview.meta({
  title: 'Backstage UI/CheckboxGroup',
  component: CheckboxGroup,
});

export const Default = meta.story({
  args: {
    label: 'Choose platforms for notifications',
    defaultValue: ['github'],
  },
  render: args => (
    <CheckboxGroup {...args}>
      <Checkbox value="github">GitHub</Checkbox>
      <Checkbox value="slack">Slack</Checkbox>
      <Checkbox value="email">Email</Checkbox>
    </CheckboxGroup>
  ),
});

export const Controlled = meta.story({
  args: {
    label: 'Choose platforms for notifications',
  },
  render: args => {
    const [values, setValues] = useState<string[]>(['email']);

    return (
      <>
        <CheckboxGroup {...args} value={values} onChange={setValues}>
          <Checkbox value="github">GitHub</Checkbox>
          <Checkbox value="slack">Slack</Checkbox>
          <Checkbox value="email">Email</Checkbox>
        </CheckboxGroup>
        <Text>Selected: {values.join(', ') || 'none'}</Text>
      </>
    );
  },
});
