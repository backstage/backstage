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

import { render, fireEvent, screen } from '@testing-library/react';
import { Filters, Filter, SelectedFilters } from './Filters';

jest.mock('../Select', () => ({
  Select: ({ selected, onChange, label, triggerReset }: any) => (
    <div>
      <span>{label}</span>
      <button onClick={() => onChange('test-value')}>Change</button>
      <span data-testid={`selected-${label}`}>{selected}</span>
      <span data-testid={`reset-${label}`}>{String(triggerReset)}</span>
    </div>
  ),
}));

jest.mock('../../translation', () => ({
  coreComponentsTranslationRef: {},
}));
jest.mock('@backstage/core-plugin-api/alpha', () => ({
  useTranslationRef: () => ({
    t: (key: string) => {
      if (key === 'table.filter.title') return 'Filters';
      if (key === 'table.filter.clearAll') return 'Clear All';
      return key;
    },
  }),
}));

describe('<Filters />', () => {
  const filters: Filter[] = [
    {
      type: 'select',
      element: {
        label: 'Status',
        items: [
          { label: 'Open', value: 'open' },
          { label: 'Closed', value: 'closed' },
        ],
      },
    },
    {
      type: 'multiple-select',
      element: {
        label: 'Type',
        items: [
          { label: 'Bug', value: 'bug' },
          { label: 'Feature', value: 'feature' },
        ],
      },
    },
  ];

  it('renders filter title and clear button', () => {
    render(<Filters filters={filters} onChangeFilters={jest.fn()} />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('renders all filters', () => {
    render(<Filters filters={filters} onChangeFilters={jest.fn()} />);
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
  });

  it('calls onChangeFilters when a filter changes', () => {
    const onChangeFilters = jest.fn();
    render(<Filters filters={filters} onChangeFilters={onChangeFilters} />);
    fireEvent.click(screen.getAllByText('Change')[0]);
    expect(onChangeFilters).toHaveBeenCalledWith({ Status: 'test-value' });
  });

  it('clears all filters when Clear All is clicked', () => {
    const onChangeFilters = jest.fn();
    const selectedFilters: SelectedFilters = { Status: 'open', Type: ['bug'] };
    render(
      <Filters
        filters={filters}
        selectedFilters={selectedFilters}
        onChangeFilters={onChangeFilters}
      />,
    );
    fireEvent.click(screen.getByText('Clear All'));
    expect(onChangeFilters).toHaveBeenCalledWith({});
  });

  it('passes triggerReset to Select when Clear All is clicked', () => {
    render(<Filters filters={filters} onChangeFilters={jest.fn()} />);
    expect(screen.getByTestId('reset-Status').textContent).toBe('false');
    fireEvent.click(screen.getByText('Clear All'));
    expect(screen.getByTestId('reset-Status').textContent).toBe('true');
  });
});
