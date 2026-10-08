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

import { render, screen } from '@testing-library/react';
import { CellText, Table, type ColumnConfig } from '.';

type Item = {
  id: string;
  name: string;
};

const data: Item[] = [{ id: 'item-1', name: 'First item' }];

function renderTable(columnConfig: ColumnConfig<Item>[]) {
  return render(
    <Table
      columnConfig={columnConfig}
      data={data}
      pagination={{ type: 'none' }}
    />,
  );
}

describe('Table', () => {
  it('renders a resize handle and resizable container for resizable columns', () => {
    const { container } = renderTable([
      {
        id: 'name',
        label: 'Name',
        isResizable: true,
        cell: item => <CellText title={item.name} />,
      },
    ]);

    expect(
      screen.getByRole('slider', { name: 'Resizer Name' }),
    ).toBeInTheDocument();
    expect(
      container.querySelector('.bui-TableResizableContainer'),
    ).not.toBeNull();
  });

  it('does not render resizing controls for standard columns', () => {
    const { container } = renderTable([
      {
        id: 'name',
        label: 'Name',
        cell: item => <CellText title={item.name} />,
      },
    ]);

    expect(screen.queryByRole('slider')).toBeNull();
    expect(container.querySelector('.bui-TableResizableContainer')).toBeNull();
  });
});
