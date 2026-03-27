/*
 * Copyright 2020 The Backstage Authors
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
import type { ComponentType } from 'react';
import { OverflowTooltip } from './OverflowTooltip';
import { TooltipProvider } from '../ui/tooltip';

export default {
  title: 'Data Display/OverflowTooltip',
  component: OverflowTooltip,
  tags: ['!manifest'],
  decorators: [
    (Story: ComponentType) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};

const text =
  'Lorem Ipsum is simply sample text of the printing and typesetting industry.';

export const Default = () => (
  <div className="max-w-[200px]">
    <OverflowTooltip text={text} />
  </div>
);

export const MultiLine = () => (
  <div className="max-w-[200px]">
    <OverflowTooltip text={text} line={2} />
  </div>
);

export const DifferentTitle = () => (
  <div className="max-w-[200px]">
    <OverflowTooltip
      title="Visit loremipsum.io for more info"
      text={text}
      line={2}
    />
  </div>
);
