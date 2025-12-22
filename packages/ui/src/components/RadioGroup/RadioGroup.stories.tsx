/*
 * Copyright 2025 The Backstage Authors
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
import preview from '../../../../../.storybook/preview';
import { RadioGroup, Radio } from './RadioGroup';

const meta = preview.meta({
  title: 'Backstage UI/RadioGroup',
  component: RadioGroup,
});

export const Default = meta.story({
  args: {
    label: 'What is your favorite pokemon?',
  },
  render: args => (
    <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
  ),
});

export const Horizontal = meta.story({
  args: {
    ...Default.input.args,
    orientation: 'horizontal',
  },
  render: args => (
    <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
  ),
});

export const Disabled = meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true,
  },
  render: args => (
    <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
  ),
});

export const DisabledSingle = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => (
    <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander" isDisabled>
        Charmander
      </Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
  ),
});

export const DisabledAndSelected = meta.story({
  args: {
    ...Default.input.args,
    value: 'charmander',
  },
  render: args => (
    <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander" isDisabled>
        Charmander
      </Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
  ),
});

export const Invalid = meta.story({
  args: {
    ...Default.input.args,
    name: 'pokemon',
    isInvalid: true,
  },
  render: args => (
    <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander" isDisabled>
        Charmander
      </Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
  ),
});

export const Validation = meta.story({
  args: {
    ...Default.input.args,
    name: 'pokemon',
    defaultValue: 'charmander',
    validationBehavior: 'aria',
    validate: value => (value === 'charmander' ? 'Nice try!' : null),
  },
  render: args => (
    <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
  ),
});

export const ReadOnly = meta.story({
  args: {
    ...Default.input.args,
    isReadOnly: true,
    defaultValue: 'charmander',
  },
  render: args => (
    <RadioGroup {...args}>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
  ),
});
