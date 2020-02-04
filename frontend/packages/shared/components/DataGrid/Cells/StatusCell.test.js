import React from 'react';
import { render } from '@testing-library/react';
import StatusCell from 'shared/components/DataGrid/Cells/StatusCell';
import { wrapInTheme } from 'testUtils';

describe('<StatusCell/>', () => {
  it('renders status', () => {
    render(wrapInTheme(<StatusCell />)).getByText('N/A');
    render(wrapInTheme(<StatusCell value={{ icon: 'ok' }} />)).getByLabelText('Status OK');
    render(wrapInTheme(<StatusCell value={{ icon: 'pending' }} />)).getByLabelText('Status pending');
    render(wrapInTheme(<StatusCell value={{ icon: 'running' }} />)).getByLabelText('Status running');
    render(wrapInTheme(<StatusCell value={{ icon: 'error' }} />)).getByLabelText('Status error');
    render(wrapInTheme(<StatusCell value={{ icon: 'warning' }} />)).getByLabelText('Status warning');
  });

  it('renders with custom message', () => {
    const renderWithMessage = render(wrapInTheme(<StatusCell value={{ icon: 'ok', message: 'hello there' }} />));
    renderWithMessage.getByLabelText('Status OK');
    renderWithMessage.getByTitle('hello there');

    const renderWithout = render(wrapInTheme(<StatusCell value={{ icon: 'error' }} />));
    renderWithout.getByLabelText('Status error');
    renderWithout.getByTitle('ERROR');
  });

  it('sorts by status', () => {
    expect(StatusCell.sort(null, null)).toBe(0);
    expect(StatusCell.sort(null, { icon: 'ok' })).toBe(1);
    expect(StatusCell.sort({ icon: 'ok' }, null)).toBe(-1);
    expect(StatusCell.sort({}, {})).toBe(0);
    expect(StatusCell.sort({}, { icon: 'ok' })).toBe(1);
    expect(StatusCell.sort({ icon: 'ok' }, {})).toBe(-1);
    expect(StatusCell.sort({ icon: 'ok' }, { icon: 'error' })).toBe(1);
    expect(StatusCell.sort({ icon: 'ok' }, { icon: 'ok' })).toBe(0);
    expect(StatusCell.sort({ icon: 'warning' }, { icon: 'error' })).toBe(1);
    expect(StatusCell.sort({ icon: 'pending' }, { icon: 'running' })).toBe(-1);
  });
});
