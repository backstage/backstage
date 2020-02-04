import React from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react';
import { getFromStore, saveToStore } from 'shared/apis/storage/persistentStore';
import { DataGrid } from './DataGrid';

jest.mock('shared/apis/storage/persistentStore'); // Swap all calls to persistentStore to mock ones

describe('<DataGrid />', () => {
  beforeEach(() => {
    saveToStore.mockClear();
    getFromStore.mockClear();
  });

  it('renders with default props', () => {
    expect(render(<DataGrid />)).toBeTruthy();
  });

  it('renders the supplied columns', () => {
    const { getByText } = render(<DataGrid columns={[{ name: 'id' }]} />);
    expect(getByText('id')).toBeInTheDocument();
  });

  it('renders the supplied data according to the supplied columns', () => {
    const { queryByText } = render(<DataGrid columns={[{ name: 'id' }]} data={[{ id: 'abc', other: 'value' }]} />);
    expect(queryByText('id')).toBeInTheDocument();
    expect(queryByText('abc')).toBeInTheDocument();
    expect(queryByText('other')).not.toBeInTheDocument();
    expect(queryByText('value')).not.toBeInTheDocument();
  });

  it('uses defaultHiddenColumns if no hiddenColumns are present in persistentStore for localStoreId', () => {
    const { getByText, queryByText } = render(
      <DataGrid localStorageId="abc" defaultHiddenColumns={['title']} columns={[{ name: 'id' }, { name: 'title' }]} />,
    );
    expect(getByText('id')).toBeInTheDocument();
    expect(queryByText('title')).not.toBeInTheDocument();
  });

  it('uses hiddenColumns from localStorageId in persistentStore if available', () => {
    getFromStore.mockImplementationOnce(() => ['title']);
    const { getByText, queryByText } = render(
      <DataGrid localStorageId="abc" columns={[{ name: 'id' }, { name: 'title' }]} />,
    );
    expect(getByText('id')).toBeInTheDocument();
    expect(queryByText('title')).not.toBeInTheDocument();
  });

  it('updates hiddenColumns in persistentStore if localStorageId is provided', async () => {
    const { getByTestId } = render(<DataGrid localStorageId="abc" columns={[{ name: 'id' }, { name: 'title' }]} />);
    const toolbarButton = getByTestId('datagrid-column-toggle');
    fireEvent.click(toolbarButton);
    const titleColumnToggle = await waitForElement(() => getByTestId('title-toggle'));
    fireEvent.click(titleColumnToggle);
    expect(getFromStore).toHaveBeenCalledWith('abc', 'hiddenColumns', []);
    expect(saveToStore).toHaveBeenCalledWith('abc', 'hiddenColumns', ['title']);
  });

  it('does not update hiddenColumns in persistentStore if localStorageId is not provided', async () => {
    const { getByTestId } = render(<DataGrid columns={[{ name: 'id' }, { name: 'title' }]} />);
    const toolbarButton = getByTestId('datagrid-column-toggle');
    fireEvent.click(toolbarButton);
    const titleColumnToggle = await waitForElement(() => getByTestId('title-toggle'));
    fireEvent.click(titleColumnToggle);
    expect(getFromStore).not.toHaveBeenCalled();
    expect(saveToStore).not.toHaveBeenCalled();
  });

  it('calls onRowClick when user clicks on a default rowComponent', () => {
    const onRowClick = jest.fn();
    const { getByText } = render(
      <DataGrid columns={[{ name: 'id' }]} data={[{ id: 'abc' }]} onRowClick={onRowClick} />,
    );
    fireEvent.click(getByText('abc'));
    expect(onRowClick).toHaveBeenCalled();
  });

  it('uses supplied rowComponent to render rows', () => {
    const rowComponent = jest.fn(() => <tr />);
    render(<DataGrid columns={[{ name: 'id' }]} data={[{ id: 'abc' }]} rowComponent={rowComponent} />);
    expect(rowComponent).toHaveBeenCalled();
  });

  it('renders expandable cell for columns with expandRow set', () => {
    const { getByText } = render(<DataGrid columns={[{ name: 'id', expandRow: true }]} data={[{ id: 'abc' }]} />);
    expect(getByText('id')).toBeInTheDocument();
    expect(getByText('View')).toBeInTheDocument();
    fireEvent.click(getByText('View'));
    expect(getByText('Close')).toBeInTheDocument();
  });

  it('should not render table header according to table header prop', () => {
    const { queryByText } = render(
      <DataGrid columns={[{ name: 'dogs' }]} data={[{ dogs: 'staffy', other: 'puppy' }]} tableHeader={false} />,
    );
    expect(queryByText('dogs')).not.toBeInTheDocument();
    expect(queryByText('staffy')).toBeInTheDocument();
  });

  it('should render table header according to tableHeader prop', () => {
    const { queryByText } = render(
      <DataGrid columns={[{ name: 'dogs' }]} data={[{ dogs: 'corgi', other: 'puppy' }]} tableHeader={true} />,
    );
    expect(queryByText('dogs')).toBeInTheDocument();
    expect(queryByText('corgi')).toBeInTheDocument();
  });
});
