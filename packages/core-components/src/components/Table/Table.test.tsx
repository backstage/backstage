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

import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import { Table } from './Table';

const column1 = {
  title: 'Column 1',
  field: 'col1',
};

const column2 = {
  title: 'Column 2',
  field: 'col2',
};

const minProps = {
  columns: [column1, column2],
  data: [
    {
      col1: 'first value, first row',
      col2: 'second value, first row',
    },
    {
      col1: 'first value, second row',
      col2: 'second value, second row',
    },
  ],
};

describe('<Table />', () => {
  it('renders without exploding', async () => {
    const rendered = await renderInTestApp(<Table {...minProps} />);
    expect(rendered.getByText('second value, second row')).toBeInTheDocument();
  });

  describe('with style rows', () => {
    describe('with CSS Properties object', () => {
      const styledColumn2 = {
        ...column2,
        cellStyle: {
          color: 'blue',
        },
      };

      it('renders non-highlighted correctly', async () => {
        const columns = [column1, styledColumn2];

        const rendered = await renderInTestApp(
          <Table data={minProps.data} columns={columns} />,
        );
        expect(rendered.getByText('second value, first row')).toHaveStyle({
          color: 'blue',
        });
      });

      it('renders highlighted column correctly', async () => {
        const columns = [
          column1,
          {
            ...styledColumn2,
            highlight: true,
          },
        ];

        const rendered = await renderInTestApp(
          <Table data={minProps.data} columns={columns} />,
        );
        expect(rendered.getByText('second value, first row')).toHaveStyle({
          color: 'blue',
          'font-weight': 700,
        });
      });
    });

    describe('with CSS Properties function', () => {
      const styledColumn2 = {
        ...column2,
        cellStyle: (
          _data: any,
          rowData: any & { tableData: { id: number } },
        ) => {
          return rowData.tableData.id % 2 === 0
            ? {
                color: 'green',
              }
            : {
                color: 'red',
              };
        },
      };

      it('renders non-highlighted columns correctly', async () => {
        const columns = [column1, styledColumn2];

        const rendered = await renderInTestApp(
          <Table data={minProps.data} columns={columns} />,
        );
        expect(rendered.getByText('second value, first row')).toHaveStyle({
          color: 'green',
        });
        expect(rendered.getByText('second value, second row')).toHaveStyle({
          color: 'red',
        });
      });

      it('renders highlighted columns correctly', async () => {
        const columns = [
          column1,
          {
            ...styledColumn2,
            highlight: true,
          },
        ];

        const rendered = await renderInTestApp(
          <Table data={minProps.data} columns={columns} />,
        );
        expect(rendered.getByText('second value, first row')).toHaveStyle({
          color: 'green',
          'font-weight': 700,
        });
        expect(rendered.getByText('second value, second row')).toHaveStyle({
          color: 'red',
          'font-weight': 700,
        });
      });
    });
  });

  it('renders with subtitle', async () => {
    const rendered = await renderInTestApp(
      <Table subtitle="subtitle" {...minProps} />,
    );
    expect(rendered.getByText('subtitle')).toBeInTheDocument();
  });

  it('renders custom empty component if empty', async () => {
    const rendered = await renderInTestApp(
      <Table
        subtitle="subtitle"
        emptyContent={<div>EMPTY</div>}
        columns={minProps.columns}
        data={[]}
      />,
    );
    expect(rendered.getByText('EMPTY')).toBeInTheDocument();
  });

  describe('with custom components', () => {
    const CustomRow = ({ data }: any) => {
      return (
        <tr>
          <td>customised cell {data.col1}</td>
          <td>customised cell {data.col2}</td>
        </tr>
      );
    };

    it('should not override the toolbar implementation', async () => {
      const rendered = await renderInTestApp(
        <Table
          subtitle="subtitle"
          emptyContent={<div>EMPTY</div>}
          columns={minProps.columns}
          data={minProps.data}
          filters={[
            {
              column: column1.title,
              type: 'select',
            },
          ]}
          components={{
            Row: CustomRow,
          }}
        />,
      );

      expect(rendered.getByText('Filters (0)')).toBeInTheDocument();
    });

    it('should render the provided custom row component correctly', async () => {
      const rendered = await renderInTestApp(
        <Table
          subtitle="subtitle"
          emptyContent={<div>EMPTY</div>}
          columns={minProps.columns}
          data={minProps.data}
          components={{
            Row: CustomRow,
          }}
        />,
      );

      expect(
        rendered.getByText('customised cell first value, first row'),
      ).toBeInTheDocument();
    });
  });
});
