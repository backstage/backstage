import React from 'react';
import { render, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { ColumnStack, useColumnStackControls } from './ColumnStack';

const Page1 = () => {
  const columnStack = useColumnStackControls();
  return (
    <div style={{ width: 100 }}>
      <button onClick={() => columnStack.push(<Page2 />)}>Push</button>
      <div>Page 1</div>
    </div>
  );
};

const Page2 = () => {
  const columnStack = useColumnStackControls();
  return (
    <div style={{ width: 200 }}>
      <button onClick={() => columnStack.pop()}>Pop</button>
      <div>Page 2</div>
    </div>
  );
};

describe('<ColumnStack />', () => {
  it('can add and remove columns', async () => {
    const rendered = render(<ColumnStack initialElement={<Page1 />} />);
    expect(rendered.queryByText('Page 1')).toBeInTheDocument();
    expect(rendered.queryByText('Page 2')).not.toBeInTheDocument();
    fireEvent.click(rendered.getByText('Push'));
    await rendered.findByText('Page 2');
    fireEvent.click(rendered.getByText('Pop'));
    await waitForElementToBeRemoved(() => rendered.queryByText('Page 2'));
  });
});
