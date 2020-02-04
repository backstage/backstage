import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { DataGrid } from 'shared/components/DataGrid';
import { act } from 'react-dom/test-utils';
import TruncatedCell from 'shared/components/DataGrid/Cells/TruncatedCell';

describe('<TruncatedCell/>', () => {
  it('shows the complete text in a DataGridPopover on click', () => {
    // const TruncatedCell = getTruncatedCellWithContext();
    const data = [
      {
        text: 'Going to space is very fun, but verrrrry cold!',
      },
    ];
    const columns = [
      {
        name: 'text',
        renderer: ({ row }) => <TruncatedCell value={row.text} />,
      },
    ];

    let wrapped;
    // flush context state
    act(() => {
      wrapped = render(<DataGrid columns={columns} data={data} />);
    });

    const { getByTestId } = wrapped;

    // popover is not showing
    expect(() => getByTestId('data-grid-popover')).toThrow();
    fireEvent.click(getByTestId('truncated-cell'));
    // popover is now showing
    expect(getByTestId('data-grid-popover')).toBeInTheDocument();
    // and has the correct content
    expect(getByTestId('data-grid-popover').textContent).toBe('Going to space is very fun, but verrrrry cold!');
  });
});
