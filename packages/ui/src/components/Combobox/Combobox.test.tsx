/*
 * Copyright 2026 The Backstage Authors
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

import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { BUIProvider } from '../../provider';
import type { AsyncListSource } from '../../types/selectableCollection';
import { Combobox } from './Combobox';
import {
  ComboboxItem,
  ComboboxItemProfile,
  ComboboxItemText,
} from './ComboboxItem';
import { useAsyncList } from '../../hooks/useAsyncList';

type Owner = {
  id: string;
  textValue: string;
  name: string;
  email: string;
};

const owners: Owner[] = [
  {
    id: 'ada',
    textValue: 'Ada Lovelace',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
  },
  {
    id: 'grace',
    textValue: 'Grace Hopper',
    name: 'Grace Hopper',
    email: 'grace@navy.mil',
  },
];

const originalIntersectionObserver = globalThis.IntersectionObserver;
let intersectionObserverCallback: IntersectionObserverCallback | undefined;
let intersectionObserverOptions: IntersectionObserverInit | undefined;

function renderCombobox(node: React.ReactNode) {
  return render(<BUIProvider>{node}</BUIProvider>);
}

function openCombobox() {
  fireEvent.click(screen.getByRole('button', { name: 'Show suggestions' }));
}

function mockIntersectionObserver() {
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    configurable: true,
    writable: true,
    value: class {
      readonly root = null;
      readonly rootMargin = '';
      readonly thresholds = [];

      constructor(
        callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit,
      ) {
        intersectionObserverCallback = callback;
        intersectionObserverOptions = options;
      }

      disconnect() {}
      observe() {}
      takeRecords() {
        return [];
      }
      unobserve() {}
    },
  });
}

afterEach(() => {
  jest.useRealTimers();
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    configurable: true,
    writable: true,
    value: originalIntersectionObserver,
  });
  intersectionObserverCallback = undefined;
  intersectionObserverOptions = undefined;
});

describe('Combobox', () => {
  it('does not open when disabled', () => {
    renderCombobox(
      <Combobox
        aria-label="Status"
        options={owners.map(owner => ({ id: owner.id, label: owner.name }))}
        isDisabled
      />,
    );

    expect(screen.getByRole('combobox')).toBeDisabled();
    openCombobox();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('updates selection and ignores disabled options', () => {
    const onChange = jest.fn();

    renderCombobox(
      <Combobox
        aria-label="Status"
        options={[
          { id: 'draft', label: 'Draft' },
          { id: 'published', label: 'Published', disabled: true },
        ]}
        onChange={onChange}
      />,
    );

    openCombobox();
    fireEvent.click(screen.getByRole('option', { name: 'Published' }));
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('option', { name: 'Draft' }));
    expect(onChange).toHaveBeenCalledWith('draft');
    expect(screen.getByRole('combobox')).toHaveValue('Draft');
  });

  it('keeps a custom value when custom values are allowed', () => {
    renderCombobox(
      <Combobox aria-label="Status" options={[]} allowsCustomValue />,
    );

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Custom status' } });
    fireEvent.blur(input);

    expect(input).toHaveValue('Custom status');
  });

  it('renders id-based plain options through the text preset', () => {
    renderCombobox(
      <Combobox
        aria-label="Status"
        options={[
          {
            id: 'draft',
            label: 'Draft',
            description: 'Work in progress',
            leadingIcon: <span aria-label="Draft icon" />,
          },
        ]}
      />,
    );

    openCombobox();

    expect(screen.getByRole('option', { name: /Draft/ })).toHaveAttribute(
      'data-key',
      'draft',
    );
    expect(screen.getByText('Draft')).toHaveClass('bui-ComboboxItemLabel');
    expect(screen.getByText('Work in progress')).toBeInTheDocument();
    expect(screen.getByLabelText('Draft icon')).toBeInTheDocument();
  });

  it('keeps rendering deprecated value-based plain options', () => {
    renderCombobox(
      <Combobox
        aria-label="Status"
        options={[{ value: 'draft', label: 'Draft' }]}
      />,
    );

    openCombobox();

    expect(screen.getByRole('option', { name: 'Draft' })).toHaveAttribute(
      'data-key',
      'draft',
    );
  });

  it('supports static composed text items with and without explicit ids', () => {
    renderCombobox(
      <Combobox aria-label="Status">
        <ComboboxItemText
          id="draft"
          title="Draft"
          description="Work in progress"
        />
        <ComboboxItemText title="Published" />
      </Combobox>,
    );

    openCombobox();

    expect(screen.getByRole('option', { name: /Draft/ })).toHaveAttribute(
      'data-key',
      'draft',
    );
    expect(screen.getByRole('option', { name: 'Published' })).toBeVisible();
    expect(screen.getByText('Work in progress')).toBeVisible();
  });

  it('supports low-level composed items with caller-owned content', () => {
    renderCombobox(
      <Combobox aria-label="Status">
        <ComboboxItem id="custom" textValue="Custom">
          <strong>Custom content</strong>
        </ComboboxItem>
      </Combobox>,
    );

    openCombobox();

    expect(
      screen.getByRole('option', { name: 'Custom content' }),
    ).toHaveAttribute('data-key', 'custom');
    expect(screen.getByText('Custom content')).toBeVisible();
  });

  it('allows low-level items to replace the built-in selection indicator', () => {
    renderCombobox(
      <Combobox aria-label="Status" defaultValue="custom">
        <ComboboxItem id="custom" textValue="Custom">
          {({ isSelected }) => (
            <span>{isSelected ? 'Custom selected' : 'Custom'}</span>
          )}
        </ComboboxItem>
      </Combobox>,
    );

    openCombobox();

    const option = screen.getByRole('option', { name: 'Custom selected' });
    expect(option).toHaveAttribute('aria-selected', 'true');
    expect(option.querySelector('.bui-ComboboxItemIndicator')).toBeNull();
    expect(option.querySelector('.bui-ComboboxItemContent')).toBeNull();
    expect(option.firstElementChild).toHaveTextContent('Custom selected');
  });

  it('allows low-level items to opt into the built-in selection indicator', () => {
    renderCombobox(
      <Combobox aria-label="Status" defaultValue="custom">
        <ComboboxItem id="custom" textValue="Custom" showSelectionIndicator>
          Custom
        </ComboboxItem>
      </Combobox>,
    );

    openCombobox();

    const option = screen.getByRole('option', { name: 'Custom' });
    expect(option.querySelector('.bui-ComboboxItemIndicator')).toBeVisible();
    expect(option.querySelector('.bui-ComboboxItemContent')).toBeVisible();
  });

  it('renders dynamic profile items with injected identity and value', () => {
    const owners = [
      {
        id: 'ada',
        name: 'Ada Lovelace',
        avatarUrl: 'https://example.com/ada.png',
      },
    ];

    renderCombobox(
      <Combobox aria-label="Owner" items={owners}>
        {owner => (
          <ComboboxItemProfile name={owner.name} src={owner.avatarUrl} />
        )}
      </Combobox>,
    );

    openCombobox();

    expect(
      screen.getByRole('option', { name: 'Ada Lovelace' }),
    ).toHaveAttribute('data-key', 'ada');
    expect(document.querySelector('[role="img"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('invalidates cached dynamic item rendering through dependencies', () => {
    function OwnerCombobox({ suffix }: { suffix: string }) {
      return (
        <Combobox aria-label="Owner" items={owners} dependencies={[suffix]}>
          {owner => <ComboboxItemText title={`${owner.name} ${suffix}`} />}
        </Combobox>
      );
    }

    const { rerender } = renderCombobox(<OwnerCombobox suffix="A" />);
    openCombobox();
    expect(
      screen.getByRole('option', { name: 'Ada Lovelace A' }),
    ).toBeVisible();

    rerender(
      <BUIProvider>
        <OwnerCombobox suffix="B" />
      </BUIProvider>,
    );

    expect(
      screen.getByRole('option', { name: 'Ada Lovelace B' }),
    ).toBeVisible();
  });

  it('keeps default contains filtering for dynamic profile items', () => {
    renderCombobox(
      <Combobox aria-label="Owner" items={owners}>
        {owner => <ComboboxItemProfile name={owner.name} />}
      </Combobox>,
    );

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'grace' },
    });
    openCombobox();

    expect(
      screen.queryByRole('option', { name: 'Ada Lovelace' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Grace Hopper' })).toBeVisible();
  });

  it('renders profile initials when an avatar source is not provided', () => {
    renderCombobox(
      <Combobox aria-label="Owner">
        <ComboboxItemProfile id="ada" name="Ada Lovelace" />
      </Combobox>,
    );

    openCombobox();

    const ada = screen.getByRole('option', { name: 'Ada Lovelace' });
    expect(ada).toBeVisible();
    expect(ada.querySelector('[role="img"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(within(ada).getByText('A')).toBeVisible();
  });

  it('keeps native contains filtering when search is omitted', () => {
    renderCombobox(
      <Combobox
        aria-label="Status"
        options={[
          { id: 'draft', label: 'Draft' },
          { id: 'published', label: 'Published' },
        ]}
      />,
    );

    const input = screen.getByRole('combobox');
    openCombobox();
    fireEvent.change(input, {
      target: { value: 'aft' },
    });

    expect(screen.getByRole('option', { name: 'Draft' })).toBeVisible();
    expect(
      screen.queryByRole('option', { name: 'Published' }),
    ).not.toBeInTheDocument();
  });

  it('supports client search with plain options', () => {
    renderCombobox(
      <Combobox
        aria-label="Status"
        options={[
          { id: 'draft', label: 'Draft' },
          { id: 'published', label: 'Published' },
        ]}
        search
      />,
    );

    const input = screen.getByRole('combobox');
    openCombobox();
    fireEvent.change(input, {
      target: { value: 'aft' },
    });

    expect(screen.getByRole('option', { name: 'Draft' })).toBeVisible();
    expect(
      screen.queryByRole('option', { name: 'Published' }),
    ).not.toBeInTheDocument();
  });

  it('applies a nested custom client filter to full domain rows', () => {
    const filter = jest.fn((owner: Owner, query: string) =>
      owner.email.includes(query),
    );

    renderCombobox(
      <Combobox aria-label="Owner" items={owners} search={{ filter }}>
        {owner => <ComboboxItemProfile name={owner.name} />}
      </Combobox>,
    );

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'navy' },
    });
    openCombobox();

    expect(
      screen.queryByRole('option', { name: 'Ada Lovelace' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Grace Hopper' })).toBeVisible();
    expect(filter).toHaveBeenCalledWith(owners[1], 'navy');
  });

  it('supports controlled nested client search state', () => {
    const onInputChange = jest.fn();

    renderCombobox(
      <Combobox
        aria-label="Status"
        options={[{ id: 'draft', label: 'Draft' }]}
        search={{ inputValue: 'draft', onInputChange }}
      />,
    );

    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('draft');

    fireEvent.change(input, { target: { value: 'published' } });
    expect(onInputChange).toHaveBeenCalledWith('published');
  });

  it('supports uncontrolled nested client search state', () => {
    renderCombobox(
      <Combobox
        aria-label="Status"
        options={[{ id: 'draft', label: 'Draft' }]}
        search={{ defaultInputValue: 'draft' }}
      />,
    );

    expect(screen.getByRole('combobox')).toHaveValue('draft');
  });

  it('leaves manual server input synchronization to the caller', () => {
    function ManualServerCombobox() {
      const [items, setItems] = useState(owners);
      const [inputValue, setInputValue] = useState('');

      return (
        <Combobox
          aria-label="Owner"
          items={items}
          search={{
            mode: 'server',
            inputValue,
            onInputChange(value) {
              setInputValue(value);
              if (value === 'missing') {
                setItems([]);
              }
            },
          }}
        >
          {owner => <ComboboxItemProfile name={owner.name} />}
        </Combobox>
      );
    }

    renderCombobox(<ManualServerCombobox />);

    openCombobox();
    fireEvent.click(screen.getByRole('option', { name: 'Ada Lovelace' }));
    expect(screen.getByRole('combobox')).toHaveValue('Ada Lovelace');

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'missing' } });

    expect(screen.getByText('No results found.')).toBeVisible();

    fireEvent.keyDown(input, { key: 'Escape' });

    expect(input).toHaveValue('');
  });

  it('accepts direct async server input before an item is selected', async () => {
    mockIntersectionObserver();

    function AsyncOwnerCombobox() {
      const list = useAsyncList<Owner>({
        async load({ filterText }) {
          const query = filterText?.toLocaleLowerCase() ?? '';
          return {
            items: owners.filter(owner =>
              owner.name.toLocaleLowerCase().includes(query),
            ),
          };
        },
      });

      return (
        <Combobox aria-label="Owner" items={list} search={{ mode: 'server' }}>
          {owner => <ComboboxItemProfile name={owner.name} />}
        </Combobox>
      );
    }

    renderCombobox(<AsyncOwnerCombobox />);

    const input = screen.getByRole('combobox');
    openCombobox();
    await screen.findByRole('option', { name: 'Ada Lovelace' });

    fireEvent.change(input, { target: { value: 'grace' } });

    expect(input).toHaveValue('grace');
    await screen.findByRole('option', { name: 'Grace Hopper' });
    expect(input).toHaveValue('grace');

    await act(async () => {
      fireEvent.keyDown(input, { key: 'Escape' });
    });

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('keeps a direct async selection while typing and restores its text on blur', () => {
    const onChange = jest.fn();
    const onQueryChange = jest.fn();
    mockIntersectionObserver();

    function AsyncOwnerCombobox() {
      const [items, setItems] = useState(owners);
      const [filterText, setFilterText] = useState('');
      const source: AsyncListSource<Owner> = {
        items,
        filterText,
        setFilterText(value) {
          onQueryChange(value);
          setFilterText(value);
          if (value === 'missing') {
            setItems([]);
          }
        },
        loadingState: 'idle',
        loadMore() {},
      };

      return (
        <Combobox
          aria-label="Owner"
          items={source}
          search={{ mode: 'server' }}
          onChange={onChange}
        >
          {owner => <ComboboxItemProfile name={owner.name} />}
        </Combobox>
      );
    }

    renderCombobox(<AsyncOwnerCombobox />);

    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('');

    openCombobox();
    fireEvent.click(screen.getByRole('option', { name: 'Ada Lovelace' }));

    expect(input).toHaveValue('Ada Lovelace');
    expect(onQueryChange).toHaveBeenLastCalledWith('Ada Lovelace');
    expect(onChange).toHaveBeenLastCalledWith(owners[0]);
    onChange.mockClear();

    fireEvent.focus(input);
    openCombobox();
    fireEvent.change(input, { target: { value: 'missing' } });

    expect(input).toHaveValue('missing');
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText('No results found.')).toBeVisible();

    fireEvent.blur(input);

    expect(input).toHaveValue('Ada Lovelace');
    expect(onQueryChange).toHaveBeenLastCalledWith('Ada Lovelace');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('reverts a direct async edit to the selected item on Escape', () => {
    const onChange = jest.fn();
    const onQueryChange = jest.fn();
    mockIntersectionObserver();

    function AsyncOwnerCombobox() {
      const [items, setItems] = useState(owners);
      const [filterText, setFilterText] = useState('');
      const source: AsyncListSource<Owner> = {
        items,
        filterText,
        setFilterText(value) {
          onQueryChange(value);
          setFilterText(value);
          if (value === 'missing') {
            setItems([]);
          }
        },
        loadingState: 'idle',
        loadMore() {},
      };

      return (
        <Combobox
          aria-label="Owner"
          items={source}
          search={{ mode: 'server' }}
          defaultValue={owners[0]}
          onChange={onChange}
        >
          {owner => <ComboboxItemProfile name={owner.name} />}
        </Combobox>
      );
    }

    renderCombobox(<AsyncOwnerCombobox />);

    const input = screen.getByRole('combobox');
    act(() => input.focus());
    fireEvent.change(input, { target: { value: 'missing' } });
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(input).toHaveValue('Ada Lovelace');
    expect(onQueryChange).toHaveBeenLastCalledWith('Ada Lovelace');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('emits full direct async items and synchronizes the selected text', () => {
    const onChange = jest.fn();
    const setFilterText = jest.fn();
    mockIntersectionObserver();
    const source: AsyncListSource<Owner> = {
      items: owners,
      filterText: '',
      setFilterText,
      loadingState: 'idle',
      loadMore() {},
    };

    renderCombobox(
      <Combobox
        aria-label="Owner"
        items={source}
        search={{ mode: 'server' }}
        onChange={onChange}
      >
        {owner => <ComboboxItemProfile name={owner.name} />}
      </Combobox>,
    );

    openCombobox();
    const grace = screen.getByRole('option', { name: 'Grace Hopper' });
    expect(grace).toHaveAttribute('data-key', 'grace');
    fireEvent.click(grace);

    expect(onChange).toHaveBeenCalledWith(owners[1]);
    expect(screen.getByRole('combobox')).toHaveValue('Grace Hopper');
    expect(setFilterText).toHaveBeenLastCalledWith('Grace Hopper');
  });

  it('commits direct async custom text instead of restoring the selected item', () => {
    const onChange = jest.fn();
    const onQueryChange = jest.fn();

    function AsyncOwnerCombobox() {
      const [filterText, setFilterText] = useState('');
      const source: AsyncListSource<Owner> = {
        items: owners,
        filterText,
        setFilterText(value) {
          onQueryChange(value);
          setFilterText(value);
        },
        loadingState: 'idle',
        loadMore() {},
      };

      return (
        <Combobox
          aria-label="Owner"
          items={source}
          search={{ mode: 'server' }}
          defaultValue={owners[0]}
          onChange={onChange}
          allowsCustomValue
        >
          {owner => <ComboboxItemProfile name={owner.name} />}
        </Combobox>
      );
    }

    renderCombobox(<AsyncOwnerCombobox />);

    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('Ada Lovelace');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Custom owner' } });
    fireEvent.blur(input);

    expect(input).toHaveValue('Custom owner');
    expect(onQueryChange).toHaveBeenLastCalledWith('Custom owner');
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it('uses canonical direct async textValue for React Aria item behavior', () => {
    const owner = {
      ...owners[0],
      textValue: 'Ada, owner',
    };
    const onChange = jest.fn();
    const source: AsyncListSource<Owner> = {
      items: [owner],
      filterText: '',
      setFilterText() {},
      loadingState: 'idle',
      loadMore() {},
    };

    renderCombobox(
      <Combobox
        aria-label="Owner"
        items={source}
        search={{ mode: 'server' }}
        defaultValue={owner}
        onChange={onChange}
        allowsCustomValue
      >
        {item => <ComboboxItemProfile name={item.name} />}
      </Combobox>,
    );

    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('Ada, owner');

    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(input).toHaveValue('Ada, owner');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('keeps a direct async selection with custom values when it is absent from the current page', () => {
    const onChange = jest.fn();
    const source: AsyncListSource<Owner> = {
      items: [],
      filterText: '',
      setFilterText() {},
      loadingState: 'idle',
      loadMore() {},
    };

    renderCombobox(
      <Combobox
        aria-label="Owner"
        items={source}
        search={{ mode: 'server' }}
        defaultValue={owners[0]}
        onChange={onChange}
        allowsCustomValue
      >
        {owner => <ComboboxItemProfile name={owner.name} />}
      </Combobox>,
    );

    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('Ada Lovelace');

    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(input).toHaveValue('Ada Lovelace');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('refreshes an unfocused uncontrolled selection from the direct async source', () => {
    const updatedAda = {
      ...owners[0],
      textValue: 'Ada Byron',
      name: 'Ada Byron',
    };
    const onQueryChange = jest.fn();

    function AsyncOwnerCombobox() {
      const [items, setItems] = useState(owners);
      const [filterText, setFilterText] = useState('');
      const source: AsyncListSource<Owner> = {
        items,
        filterText,
        setFilterText(value) {
          onQueryChange(value);
          setFilterText(value);
        },
        loadingState: 'idle',
        loadMore() {},
      };

      return (
        <>
          <button onClick={() => setItems([updatedAda, owners[1]])}>
            Update Ada
          </button>
          <Combobox
            aria-label="Owner"
            items={source}
            search={{ mode: 'server' }}
            defaultValue={owners[0]}
          >
            {owner => <ComboboxItemProfile name={owner.name} />}
          </Combobox>
        </>
      );
    }

    renderCombobox(<AsyncOwnerCombobox />);
    fireEvent.click(screen.getByText('Update Ada'));

    expect(screen.getByRole('combobox')).toHaveValue('Ada Byron');
    expect(onQueryChange).toHaveBeenLastCalledWith('Ada Byron');
  });

  it('restores fresh selected text after source updates while editing', () => {
    mockIntersectionObserver();
    const updatedAda = {
      ...owners[0],
      textValue: 'Ada Byron',
      name: 'Ada Byron',
    };
    let updateItems: (() => void) | undefined;

    function AsyncOwnerCombobox() {
      const [items, setItems] = useState(owners);
      const [filterText, setFilterText] = useState('');
      updateItems = () => setItems([updatedAda, owners[1]]);
      const source: AsyncListSource<Owner> = {
        items,
        filterText,
        setFilterText,
        loadingState: 'idle',
        loadMore() {},
      };

      return (
        <Combobox
          aria-label="Owner"
          items={source}
          search={{ mode: 'server' }}
          defaultValue={owners[0]}
        >
          {owner => <ComboboxItemProfile name={owner.name} />}
        </Combobox>
      );
    }

    renderCombobox(<AsyncOwnerCombobox />);

    const input = screen.getByRole('combobox');
    act(() => input.focus());
    fireEvent.change(input, { target: { value: 'grace' } });
    act(() => updateItems?.());

    expect(input).toHaveValue('grace');

    fireEvent.blur(input);

    expect(input).toHaveValue('Ada Byron');
  });

  it('synchronizes direct async input when controlled selection changes externally', () => {
    const onQueryChange = jest.fn();

    function ControlledAsyncOwnerCombobox() {
      const [value, setValue] = useState<Owner | null>(owners[0]);
      const [filterText, setFilterText] = useState('');
      const source: AsyncListSource<Owner> = {
        items: owners,
        filterText,
        setFilterText(nextFilterText) {
          onQueryChange(nextFilterText);
          setFilterText(nextFilterText);
        },
        loadingState: 'idle',
        loadMore() {},
      };

      return (
        <>
          <button onClick={() => setValue(owners[1])}>Select Grace</button>
          <button onClick={() => setValue(null)}>Clear owner</button>
          <Combobox
            aria-label="Owner"
            items={source}
            search={{ mode: 'server' }}
            value={value}
            onChange={setValue}
          >
            {owner => <ComboboxItemProfile name={owner.name} />}
          </Combobox>
        </>
      );
    }

    renderCombobox(<ControlledAsyncOwnerCombobox />);
    const input = screen.getByRole('combobox');

    fireEvent.click(screen.getByText('Select Grace'));
    expect(input).toHaveValue('Grace Hopper');
    expect(onQueryChange).toHaveBeenLastCalledWith('Grace Hopper');

    fireEvent.click(screen.getByText('Clear owner'));
    expect(input).toHaveValue('');
    expect(onQueryChange).toHaveBeenLastCalledWith('');
  });

  it('uses full options for direct async option selection', () => {
    const options = [
      { id: 'draft', label: 'Draft' },
      { id: 'published', label: 'Published' },
    ];
    const onChange = jest.fn();
    const source: AsyncListSource<(typeof options)[number]> = {
      items: options,
      filterText: '',
      setFilterText() {},
      loadingState: 'idle',
      loadMore() {},
    };
    mockIntersectionObserver();

    renderCombobox(
      <Combobox
        aria-label="Status"
        options={source}
        search={{ mode: 'server' }}
        defaultValue={options[0]}
        onChange={onChange}
      />,
    );

    expect(screen.getByRole('combobox')).toHaveValue('Draft');

    openCombobox();
    fireEvent.click(screen.getByRole('option', { name: 'Published' }));

    expect(onChange).toHaveBeenCalledWith(options[1]);
    expect(screen.getByRole('combobox')).toHaveValue('Published');
  });

  it('serializes the id of a full direct async selection', () => {
    const source: AsyncListSource<Owner> = {
      items: owners,
      filterText: '',
      setFilterText() {},
      loadingState: 'idle',
      loadMore() {},
    };

    renderCombobox(
      <form aria-label="Owner form">
        <Combobox
          aria-label="Owner"
          name="owner"
          items={source}
          search={{ mode: 'server' }}
          defaultValue={owners[0]}
        >
          {owner => <ComboboxItemProfile name={owner.name} />}
        </Combobox>
      </form>,
    );

    const form = screen.getByRole('form', { name: 'Owner form' });
    expect(form.querySelector('input[name="owner"]')).toHaveValue('ada');
  });

  it('shows server results without applying another client-side filter', () => {
    renderCombobox(
      <Combobox
        aria-label="Owner"
        items={[owners[0]]}
        search={{
          mode: 'server',
          inputValue: 'unrelated query',
          onInputChange() {},
        }}
      >
        {owner => <ComboboxItemProfile name={owner.name} />}
      </Combobox>,
    );

    openCombobox();

    expect(screen.getByRole('option', { name: 'Ada Lovelace' })).toBeVisible();
  });

  it('derives direct async server state without requesting another page while one is loading', () => {
    jest.useFakeTimers();

    const setFilterText = jest.fn();
    const loadMore = jest.fn();
    const source: AsyncListSource<Owner> = {
      items: [owners[0]],
      filterText: 'ada',
      setFilterText,
      loadingState: 'loadingMore',
      loadMore,
    };
    mockIntersectionObserver();

    renderCombobox(
      <Combobox aria-label="Owner" items={source} search={{ mode: 'server' }}>
        {owner => <ComboboxItemProfile name={owner.name} />}
      </Combobox>,
    );

    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('ada');

    fireEvent.change(input, { target: { value: 'grace' } });
    expect(setFilterText).toHaveBeenCalledWith('grace');

    openCombobox();
    expect(screen.getByRole('option', { name: 'Ada Lovelace' })).toBeVisible();
    expect(screen.getByTestId('loadMoreSentinel')).toBeInTheDocument();
    expect(intersectionObserverOptions?.rootMargin).toBe('0px 0% 0% 0%');
    expect(document.querySelectorAll('.bui-ComboboxLoadingRow')).toHaveLength(
      0,
    );

    act(() => jest.advanceTimersByTime(299));

    expect(document.querySelectorAll('.bui-ComboboxLoadingRow')).toHaveLength(
      0,
    );

    act(() => jest.advanceTimersByTime(1));

    expect(document.querySelectorAll('.bui-ComboboxLoadingRow')).toHaveLength(
      1,
    );
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();

    intersectionObserverCallback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
    expect(loadMore).not.toHaveBeenCalled();
  });

  it('supports explicit async opt-out with caller-owned server input state', () => {
    const setFilterText = jest.fn();
    const onInputChange = jest.fn();
    const source: AsyncListSource<Owner> = {
      items: [owners[0]],
      filterText: 'source-owned',
      setFilterText,
      loadingState: 'idle',
      loadMore: jest.fn(),
    };

    renderCombobox(
      <Combobox
        aria-label="Owner"
        items={source.items}
        loading={{ state: source.loadingState, onLoadMore: source.loadMore }}
        search={{
          mode: 'server',
          inputValue: 'caller-owned',
          onInputChange,
        }}
      >
        {owner => <ComboboxItemProfile name={owner.name} />}
      </Combobox>,
    );

    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('caller-owned');

    fireEvent.change(input, { target: { value: 'next-query' } });
    expect(onInputChange).toHaveBeenCalledWith('next-query');
    expect(setFilterText).not.toHaveBeenCalled();
  });

  it('delays the stale-results indication while server filtering', () => {
    jest.useFakeTimers();
    mockIntersectionObserver();

    function AsyncOwnerCombobox() {
      const [filterText, setFilterText] = useState('');
      const [loadingState, setLoadingState] = useState<'idle' | 'filtering'>(
        'idle',
      );
      const source: AsyncListSource<Owner> = {
        items: owners,
        filterText,
        setFilterText(value) {
          setFilterText(value);
          setLoadingState('filtering');
        },
        loadingState,
        loadMore() {},
      };

      return (
        <>
          <button onClick={() => setLoadingState('idle')}>
            Finish filtering
          </button>
          <Combobox
            aria-label="Owner"
            items={source}
            search={{ mode: 'server' }}
          >
            {owner => <ComboboxItemProfile name={owner.name} />}
          </Combobox>
        </>
      );
    }

    renderCombobox(<AsyncOwnerCombobox />);
    openCombobox();

    const input = screen.getByRole('combobox');
    const listbox = screen.getByRole('listbox');
    fireEvent.change(input, { target: { value: 'grace' } });

    expect(listbox.parentElement).toHaveAttribute('aria-busy', 'true');
    expect(listbox).not.toHaveAttribute('data-stale');
    expect(screen.getByRole('option', { name: 'Ada Lovelace' })).toBeVisible();

    act(() => jest.advanceTimersByTime(299));

    expect(listbox).not.toHaveAttribute('data-stale');

    act(() => jest.advanceTimersByTime(1));

    expect(listbox).toHaveAttribute('data-stale', 'true');
    expect(screen.getByRole('option', { name: 'Ada Lovelace' })).toBeVisible();

    fireEvent.click(screen.getByText('Finish filtering'));

    expect(listbox.parentElement).not.toHaveAttribute('aria-busy');
    expect(listbox).not.toHaveAttribute('data-stale');
  });

  it.each(['loading', 'filtering'] as const)(
    'immediately indicates loading for an empty %s collection',
    state => {
      const onLoadMore = jest.fn();
      mockIntersectionObserver();

      renderCombobox(
        <Combobox
          aria-label="Owner"
          options={[]}
          loading={{ state, onLoadMore }}
        />,
      );

      openCombobox();

      expect(screen.getByRole('listbox').parentElement).toHaveAttribute(
        'aria-busy',
        'true',
      );
      expect(document.querySelectorAll('.bui-ComboboxLoadingRow')).toHaveLength(
        3,
      );
      expect(screen.getByRole('listbox')).not.toHaveAttribute('data-stale');
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.queryByText('No results found.')).not.toBeInTheDocument();
      expect(screen.queryByTestId('loadMoreSentinel')).not.toBeInTheDocument();
      expect(onLoadMore).not.toHaveBeenCalled();
    },
  );

  it('keeps completed empty collections open with the no-results treatment', () => {
    renderCombobox(
      <Combobox aria-label="Owner" options={[]} loading={{ state: 'idle' }} />,
    );

    openCombobox();

    expect(screen.getByText('No results found.')).toBeVisible();
  });

  it('keeps deprecated top-level search state props working', () => {
    const onInputChange = jest.fn();

    renderCombobox(
      <Combobox
        aria-label="Status"
        options={[
          { id: 'draft', label: 'Draft' },
          { id: 'published', label: 'Published' },
        ]}
        defaultInputValue="legacy"
        onInputChange={onInputChange}
        defaultFilter={() => true}
      />,
    );

    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('legacy');

    openCombobox();
    expect(screen.getByRole('option', { name: 'Draft' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'Published' })).toBeVisible();

    fireEvent.change(input, { target: { value: 'next-query' } });
    expect(onInputChange).toHaveBeenCalledWith('next-query');
  });
});
