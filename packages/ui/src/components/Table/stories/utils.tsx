/* eslint-disable no-restricted-syntax */
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

import type { Meta } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { CellText, type ColumnConfig } from '..';

// Selection demo data
export const selectionData = [
  { id: 1, name: 'Component Library', owner: 'Design System', type: 'library' },
  { id: 2, name: 'API Gateway', owner: 'Platform', type: 'service' },
  { id: 3, name: 'Documentation Site', owner: 'DevEx', type: 'website' },
];

// Selection demo columns
export const selectionColumns: ColumnConfig<(typeof selectionData)[0]>[] = [
  {
    id: 'name',
    label: 'Name',
    isRowHeader: true,
    cell: item => <CellText title={item.name} />,
  },
  {
    id: 'owner',
    label: 'Owner',
    cell: item => <CellText title={item.owner} />,
  },
  { id: 'type', label: 'Type', cell: item => <CellText title={item.type} /> },
];

// Shared meta config for Table stories
export const tableStoriesMeta = {
  decorators: [
    (Story: () => JSX.Element) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Partial<Meta>;
