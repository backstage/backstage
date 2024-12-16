/*
 * Copyright 2024 The Backstage Authors
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

import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

const meta = {
  title: 'Components/Text',
  component: Text,
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children:
      ' Lorem ipsum dolor sit amet consectetur. Nec arcu vel lacus magna adipiscing nisi mauris tortor viverra. Enim rhoncus quisque consectetur ligula diam ac lacus massa. Id interdum id pellentesque justo ut massa nibh amet. Odio massa in scelerisque tortor massa integer purus amet enim. Eros sit neque nullam facilisis. Purus massa dignissim aliquet purus eu in. Urna consequat ullamcorper arcu amet dictumst. Commodo praesent turpis fringilla tristique congue volutpat in. Nulla in nulla ultrices lacus. In ultrices id tellus ut. Semper duis in in non proin et pulvinar. Sit amet vulputate lorem sit ipsum quis amet pulvinar ultricies. Imperdiet enim molestie habitant eget. Aenean mollis aenean dolor sodales tempus blandit.',
  },
};

export const Responsive: Story = {
  args: {
    ...Default.args,
    variant: {
      xs: 'label',
      md: 'body',
    },
  },
};
