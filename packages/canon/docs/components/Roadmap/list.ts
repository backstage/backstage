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
export type RoadmapItem = {
  title: string;
  status: 'notStarted' | 'inProgress' | 'inReview' | 'completed';
};

export const list: RoadmapItem[] = [
  {
    title: 'Remove Vanilla Extract and use pure CSS instead',
    status: 'inProgress',
  },
  {
    title: 'Add collapsing across breakpoints for the Inline component',
    status: 'notStarted',
  },
  {
    title: 'Add reversing the order for the Inline component',
    status: 'notStarted',
  },
  {
    title: 'Set up Storybook',
    status: 'completed',
  },
  {
    title: 'Set up iconography',
    status: 'completed',
  },
  {
    title: 'Set up global tokens',
    status: 'inProgress',
  },
  {
    title: 'Set up theming system',
    status: 'inProgress',
  },
  {
    title: 'Create first pass at box component',
    status: 'completed',
  },
  {
    title: 'Create first pass at stack component',
    status: 'completed',
  },
  {
    title: 'Create first pass at inline component',
    status: 'completed',
  },
];
