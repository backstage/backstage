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

/*
 * Select component test suite — validated against the shadcn/ui migration.
 * The underlying SelectComponent now uses Radix Select for single-select
 * and Radix Popover with shadcn Badge for multi-select, replacing MUI
 * Select, Chip, CancelIcon, and makeStyles. Test selectors are updated to
 * match the new Radix DOM structure (role="combobox" trigger, portal-rendered
 * options). The data-testid attributes ("select", "chip", "cancel-icon") are
 * preserved by the migrated component for selector stability.
 */

import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectComponent as Select } from './Select';

const SELECT_ITEMS = [
  {
    label: 'test 1',
    value: 'test_1',
  },
  {
    label: 'test 2',
    value: 'test_2',
  },
];

const minProps = {
  onChange: jest.fn(),
  label: 'Default',
  placeholder: 'All results',
  items: SELECT_ITEMS,
};

describe('<Select />', () => {
  it('renders without exploding', async () => {
    const user = userEvent.setup();
    render(<Select {...minProps} />);

    // Label text is rendered
    expect(screen.getByText('Default')).toBeInTheDocument();

    // Root container is accessible via default data-testid
    const container = screen.getByTestId('select');
    expect(container).toBeInTheDocument();

    // Radix Select trigger (combobox role) displays placeholder text
    const trigger = within(container).getByRole('combobox');
    expect(trigger).toHaveTextContent('All results');

    // Open the select dropdown by clicking the combobox trigger
    await user.click(trigger);

    // Options appear (Radix renders SelectContent in a portal)
    await waitFor(() => {
      expect(screen.getByText('test 1')).toBeInTheDocument();
    });

    // Select an option
    await user.click(screen.getByText('test 1'));

    // Selected value is now displayed in the trigger
    await waitFor(() => {
      expect(trigger).toHaveTextContent('test 1');
    });
  });

  it('display nothing when placeholder is empty string and items updated to none', () => {
    const initialValue = 'initial';
    const initialItems = [{ label: initialValue, value: initialValue }];
    const { rerender } = render(
      <Select
        {...minProps}
        items={initialItems}
        selected={initialValue}
        placeholder=""
      />,
    );

    // Initially shows the selected value in the combobox trigger
    const container = screen.getByTestId('select');
    const trigger = within(container).getByRole('combobox');
    expect(trigger).toHaveTextContent(initialValue);

    // Rerender with no items, empty selected, and empty placeholder
    rerender(<Select {...minProps} items={[]} selected="" placeholder="" />);

    // Trigger text content should be empty (no placeholder, no selected value)
    expect(trigger.textContent?.trim()).toBe('');
  });

  it('display the placeholder value when selected props updated to undefined', async () => {
    const { rerender } = render(<Select {...minProps} selected="test_1" />);

    // Initially shows the label for the selected item
    const container = screen.getByTestId('select');
    const trigger = within(container).getByRole('combobox');
    expect(trigger).toHaveTextContent('test 1');

    // Rerender with undefined selected to reset to placeholder
    rerender(<Select {...minProps} selected={undefined} />);

    // Placeholder value should be displayed again
    expect(trigger).toHaveTextContent('All results');
  });

  it('should function correctly when a custom data-testid is provided', async () => {
    render(<Select {...minProps} data-testid="custom-select" />);

    // Custom data-testid applied to root container
    const container = screen.getByTestId('custom-select');
    const trigger = within(container).getByRole('combobox');
    expect(trigger).toHaveTextContent('All results');
  });

  it('should not open dropdown when deleting Badge from multi-Select', async () => {
    const user = userEvent.setup();
    const items = [
      { value: 'test_1', label: 'test 1' },
      { value: 'test_2', label: 'test 2' },
    ];

    const handleChange = jest.fn();

    render(
      <Select
        label="Default"
        items={items}
        multiple
        selected={['test_1']} // Creates Badge component initially
        onChange={handleChange}
        placeholder="All results"
      />,
    );

    // Verify Badge component exists (shadcn Badge replaces MUI Chip)
    const chip = screen.getByTestId('chip');
    expect(chip).toBeInTheDocument();
    expect(chip.textContent).toContain('test 1');

    // Find cancel icon (lucide-react X icon replaces MUI CancelIcon)
    const cancelIcon = screen.getByTestId('cancel-icon');
    expect(cancelIcon).toBeInTheDocument();

    // Verify dropdown is initially closed
    expect(screen.queryByText('test 2')).not.toBeInTheDocument();

    // Fire mouseDown on cancel icon — tests onMouseDown stopPropagation
    // preventing the Popover trigger from opening
    fireEvent.mouseDown(cancelIcon);

    // Verify dropdown is closed after mouseDown on cancel icon
    expect(screen.queryByText('test 2')).not.toBeInTheDocument();

    // Delete the Badge by clicking the cancel icon
    fireEvent.click(cancelIcon);

    // Verify dropdown is still closed after the removal of Badge
    expect(screen.queryByText('test 2')).not.toBeInTheDocument();

    // Verify Badge is removed from the DOM
    expect(chip).not.toBeInTheDocument();
    expect(screen.queryByText('test 1')).not.toBeInTheDocument();

    // Verify placeholder is visible after badge removal
    const container = screen.getByTestId('select');
    expect(within(container).getByText('All results')).toBeInTheDocument();

    // Open multi-select Popover by clicking the trigger button
    const triggerButton = within(container).getByRole('button');
    await user.click(triggerButton);

    // Now dropdown should be open with remaining options
    await waitFor(() => {
      expect(screen.queryByText('test 2')).toBeInTheDocument();
    });
  });
});
