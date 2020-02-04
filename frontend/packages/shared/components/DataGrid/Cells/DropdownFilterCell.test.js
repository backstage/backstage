import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { DataGrid } from 'shared/components/DataGrid';
import DropdownFilterCell from 'shared/components/DataGrid/Cells/DropdownFilterCell';

const data = [
  {
    text: 'data: a b',
  },
  {
    text: 'data: a',
  },
];

const columns = [
  {
    name: 'text',
    width: 100,
    filteringEnabled: true,
    filterCell: data => <DropdownFilterCell filter={data.filter} onFilter={data.onFilter} options={['a', 'b', 'c']} />,
  },
];

describe('<DropdownFilterCell/>', () => {
  it('works in isolation', async () => {
    const handleFilter = jest.fn();
    const rendered = await render(
      <table>
        <tbody>
          <tr>
            <DropdownFilterCell filter={{ value: 'a' }} onFilter={handleFilter} options={['a', 'b']} />
          </tr>
        </tbody>
      </table>,
    );

    expect(handleFilter).not.toHaveBeenCalled();
    fireEvent.mouseDown(rendered.getByText('a'));
    fireEvent.click(rendered.getByText('b'));

    expect(handleFilter).toHaveBeenCalledWith({ value: 'b' });
    handleFilter.mockReset();
    fireEvent.click(rendered.container.querySelector('[aria-haspopup="listbox"]'));
    fireEvent.click(rendered.getByText('None'));

    expect(handleFilter).toHaveBeenCalledWith(null);
  });

  it('works in data grid', async () => {
    const rendered = await render(<DataGrid columns={columns} data={data} filtering />);

    expect(rendered.queryByText('data: a')).not.toBeNull();
    expect(rendered.queryByText('data: a b')).not.toBeNull();

    fireEvent.mouseDown(rendered.container.querySelector('[aria-haspopup="listbox"]'));
    fireEvent.click(rendered.getByText('a'));

    expect(rendered.queryByText('data: a')).not.toBeNull();
    expect(rendered.queryByText('data: a b')).not.toBeNull();

    fireEvent.click(rendered.container.querySelector('[aria-haspopup="listbox"]'));
    fireEvent.click(rendered.getByText('b'));

    expect(rendered.queryByText('data: a')).toBeNull();
    expect(rendered.queryByText('data: a b')).not.toBeNull();

    fireEvent.click(rendered.container.querySelector('[aria-haspopup="listbox"]'));
    fireEvent.click(rendered.getByText('c'));

    expect(rendered.queryByText('data: a')).toBeNull();
    expect(rendered.queryByText('data: a b')).toBeNull();
  });
});
