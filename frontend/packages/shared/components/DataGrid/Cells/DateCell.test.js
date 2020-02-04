import React from 'react';
import { render } from '@testing-library/react';
import DateCell from 'shared/components/DataGrid/Cells/DateCell';

describe('<DateCell/>', () => {
  it('renders no date', () => {
    render(<DateCell column={{}} />);
  });

  it('renders a date with format', () => {
    const rendered = render(<DateCell value={'2020-01-01'} column={{ format: 'YYYY-MM-DD' }} />);
    rendered.getByText('2020-01-01');
  });

  it('renders a UTC date', () => {
    const rendered = render(<DateCell value={'2020-01-01'} column={{ utc: true }} />);
    rendered.getByText('Wed Jan 01 2020 00:00:00 GMT+0000');
  });

  it('sorts dates', () => {
    expect(DateCell.sort(new Date(0), new Date(1))).toBe(-1);
    expect(DateCell.sort(new Date(2), new Date(1))).toBe(1);
    expect(DateCell.sort(new Date(1), new Date(1))).toBe(1);
  });
});
