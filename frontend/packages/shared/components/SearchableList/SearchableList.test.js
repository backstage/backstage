import React from 'react';
import SearchableList from 'shared/components/SearchableList';
import { render, fireEvent } from '@testing-library/react';

import { wrapInTestApp } from 'testUtils';
import { ListItem } from '@material-ui/core';

describe('<SearchableList/>', () => {
  it('Renders an empty list (without exploding)', () => {
    const { getByText, getAllByText } = render(wrapInTestApp(<SearchableList items={[]} />));
    expect(getByText('No items found')).toBeVisible();
    expect(getAllByText('No items found').length).toBe(1);
  });

  it('Renders a simple list', () => {
    const items = ['Apple', 'Banana', 'Cherry'];
    const { getAllByText } = render(wrapInTestApp(<SearchableList items={items} />));

    expect(getAllByText('Apple').length).toBe(1);
    expect(getAllByText('Banana').length).toBe(1);
    expect(getAllByText('Cherry').length).toBe(1);
  });

  it('Hides search if not enabled', () => {
    const items = ['Apple', 'Banana', 'Cherry'];
    const { queryByTestId } = render(wrapInTestApp(<SearchableList items={items} />));
    expect(queryByTestId('search-button')).toBeNull();
  });

  it('Filters items on search', () => {
    const items = ['Apple', 'Banana', 'Cherry'];
    const { getAllByText, queryAllByText, getByPlaceholderText, getByTestId } = render(
      wrapInTestApp(<SearchableList items={items} enableSearch />),
    );

    fireEvent.click(getByTestId('search-button'));

    const input = getByPlaceholderText('Search...');
    expect(input).toBeVisible();

    fireEvent.change(input, { target: { value: 'che' } });

    expect(queryAllByText(/Apple|Banana/).length).toBe(0);
    expect(getAllByText('Cherry').length).toBe(1);
  });

  it('Uses a custom item renderer if provided', () => {
    const items = ['Apple', 'Banana', 'Cherry'];
    const customItemRenderer = (clickHandler, item, index) => <ListItem key={index}>Kiwi</ListItem>; // Replace all inferior fruit with kiwi
    const { getAllByText, queryAllByText } = render(
      wrapInTestApp(<SearchableList items={items} itemRenderer={customItemRenderer} />),
    );

    expect(queryAllByText(/Apple|Banana|Cherry/).length).toBe(0);
    expect(getAllByText('Kiwi').length).toBe(3);
  });

  it('Uses a custom click handler if provided', () => {
    const itemsAndClickCount = { Apple: 0, Banana: 0, Cherry: 0 };
    const customClickHandler = (e, item) => {
      itemsAndClickCount[item]++;
    };
    const { getByTestId } = render(
      <SearchableList items={Object.keys(itemsAndClickCount)} onItemClick={customClickHandler} />,
    );

    fireEvent.click(getByTestId('ListItem-Apple'));
    fireEvent.click(getByTestId('ListItem-Apple'));
    fireEvent.click(getByTestId('ListItem-Cherry'));

    expect(itemsAndClickCount['Apple']).toBe(2);
    expect(itemsAndClickCount['Banana']).toBe(0);
    expect(itemsAndClickCount['Cherry']).toBe(1);
  });

  it('Renders labels using a custom field if provided', () => {
    const items = [
      { name: 'Apple', upc: '1234' },
      { name: 'Banana', upc: '5678' },
      { name: 'Cherry', upc: '9012' },
    ];
    const { getAllByText, queryAllByText } = render(wrapInTestApp(<SearchableList items={items} labelField="upc" />));

    expect(queryAllByText(/Apple|Banana|Cherry/).length).toBe(0);
    expect(getAllByText('1234').length).toBe(1);
    expect(getAllByText('5678').length).toBe(1);
    expect(getAllByText('9012').length).toBe(1);
  });

  it('Renders labels using a custom label function if provided', () => {
    const items = ['Apple', 'Banana', 'Cherry'];
    const customLabelFn = item => `${item}berry`;

    const { getAllByText, queryAllByText } = render(
      wrapInTestApp(<SearchableList items={items} labelFunction={customLabelFn} />),
    );

    expect(queryAllByText(/(Apple|Banana|Cherry)$/).length).toBe(0);
    expect(getAllByText('Appleberry').length).toBe(1);
    expect(getAllByText('Bananaberry').length).toBe(1);
    expect(getAllByText('Cherryberry').length).toBe(1);
  });

  it('Filters entries if a global filter is provided', () => {
    const items = ['Apple', 'Banana', 'Blackberry', 'Cherry', 'Lingonberry', 'Strawberry'];
    const { getAllByText, queryAllByText } = render(wrapInTestApp(<SearchableList items={items} globalFilter="b" />));

    expect(queryAllByText(/Apple|Cherry|Lingonberry|Strawberry/).length).toBe(0);
    expect(getAllByText('Banana').length).toBe(1);
    expect(getAllByText('Blackberry').length).toBe(1);
  });
});
