import React from 'react';
import { render } from '@testing-library/react';
import NumberCell from 'shared/components/DataGrid/Cells/NumberCell';

describe('<NumberCell/>', () => {
  it('renders a number', () => {
    render(<NumberCell value={1} column={{}} />).getByText('1');
  });

  it('displays percent of total', () => {
    render(<NumberCell value={1} column={{ percentOf: 3 }} />).getByText('33.33%');
    render(<NumberCell value={3} column={{ percentOf: 3 }} />).getByText('100%');
    render(<NumberCell value={1} column={{ percentOf: 4 }} />).getByText('25%');
    render(<NumberCell value={1} column={{ percentOf: 3, roundTo: 1 }} />).getByText('33.3%');
  });

  it('rounds numbers if needed', () => {
    render(<NumberCell value={2 / 3} column={{}} />).getByText('0.67');
    render(<NumberCell value={2 / 3} column={{ roundTo: 0 }} />).getByText('1');
    render(<NumberCell value={2 / 3} column={{ roundTo: 1 }} />).getByText('0.7');
    render(<NumberCell value={100000} column={{}} />).getByText('100000');
    render(<NumberCell value={100000} column={{ roundTo: 6 }} />).getByText('100000.000000');
  });
});
