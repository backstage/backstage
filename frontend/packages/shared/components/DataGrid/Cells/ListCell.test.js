import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ListCell from 'shared/components/DataGrid/Cells/ListCell';

describe('<ListCell/>', () => {
  it('renders without exploding', () => {
    render(<ListCell />);
  });

  it('renders a list of items', () => {
    const rendered = render(<ListCell value={['a', 'b', 'c']} column={{}} />);
    rendered.getByText('a');
    rendered.getByText('b');
    rendered.getByText('c');
  });

  it('hides long lists', () => {
    const rendered = render(<ListCell value={['a', 'b', 'c']} column={{ maxRows: 1, listItemsStyle: {} }} />);
    expect(rendered.queryByText('a')).not.toBeNull();
    expect(rendered.queryByText('b')).toBeNull();
    expect(rendered.queryByText('c')).toBeNull();
    fireEvent.click(rendered.getByText('And 2 More'));
    expect(rendered.queryByText('a')).not.toBeNull();
    expect(rendered.queryByText('b')).not.toBeNull();
    expect(rendered.queryByText('c')).not.toBeNull();
  });

  it('uses a custom item renderer', () => {
    function listItemRenderer(options, text, index) {
      return <div>{`item[${index}]: ${text}`}</div>;
    }
    const rendered = render(<ListCell value={['a', 'b', 'c']} column={{ maxRows: -1, listItemRenderer }} />);
    rendered.getByText('item[0]: a');
    rendered.getByText('item[1]: b');
    rendered.getByText('item[2]: c');
  });

  it('sorts based on length', () => {
    expect(ListCell.sort([], [0])).toBe(1);
    expect(ListCell.sort([0, 0], [0])).toBe(-1);
    expect(ListCell.sort([0, 0], [0, 0])).toBe(0);
  });
});
