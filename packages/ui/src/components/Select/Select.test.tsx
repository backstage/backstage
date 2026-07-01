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

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { useState } from 'react';
import type {
  AsyncListSource,
  IdentifiedOption,
} from '../../types/selectableCollection';
import { useAsyncList } from '../../hooks/useAsyncList';
import { Select, SelectItem, SelectItemProfile, SelectItemText } from '.';

function openSelect() {
  fireEvent.click(screen.getByRole('button'));
}

const options = [
  { id: 'draft', label: 'Draft', description: 'Work in progress' },
  { id: 'published', label: 'Published', description: 'Visible to everyone' },
];

const originalIntersectionObserver = globalThis.IntersectionObserver;

function mockIntersectionObserver() {
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    configurable: true,
    writable: true,
    value: class {
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
});

describe('Select', () => {
  it('does not open when disabled', () => {
    render(<Select aria-label="Status" options={options} isDisabled />);

    expect(screen.getByRole('button')).toBeDisabled();
    openSelect();
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('updates selection and ignores disabled options', () => {
    const onChange = jest.fn();

    render(
      <Select
        aria-label="Status"
        options={[
          { id: 'draft', label: 'Draft' },
          { id: 'published', label: 'Published', disabled: true },
        ]}
        onChange={onChange}
      />,
    );

    openSelect();
    fireEvent.click(screen.getByRole('option', { name: 'Published' }));
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('option', { name: 'Draft' }));
    expect(onChange).toHaveBeenCalledWith('draft');
    expect(screen.getByRole('button')).toHaveTextContent('Draft');
  });

  it('supports the deprecated onSelectionChange alias', () => {
    const onSelectionChange = jest.fn();

    render(
      <Select
        aria-label="Status"
        options={options}
        onSelectionChange={onSelectionChange}
      />,
    );

    openSelect();
    fireEvent.click(screen.getByRole('option', { name: 'Draft' }));

    expect(onSelectionChange).toHaveBeenCalledWith('draft');
  });

  it('supports multiple selection', () => {
    const onChange = jest.fn();

    render(
      <Select
        aria-label="Status"
        options={options}
        selectionMode="multiple"
        onChange={onChange}
      />,
    );

    openSelect();
    fireEvent.click(screen.getByRole('option', { name: 'Draft' }));
    fireEvent.click(screen.getByRole('option', { name: 'Published' }));

    expect(onChange).toHaveBeenLastCalledWith(['draft', 'published']);
    expect(screen.getByRole('option', { name: 'Draft' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('option', { name: 'Published' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('renders composed text and low-level items, including static items without ids', () => {
    render(
      <Select aria-label="Status">
        <SelectItemText
          id="draft"
          title="Draft"
          description="Work in progress"
          leadingIcon={<span>Icon</span>}
        />
        <SelectItem id="custom" textValue="Custom">
          <span>Custom</span>
          <span>Custom details</span>
        </SelectItem>
        <SelectItem textValue="Generated id">Generated id</SelectItem>
      </Select>,
    );

    openSelect();

    const draft = screen.getByRole('option', { name: 'Draft' });
    expect(within(draft).getByText('Work in progress')).toBeVisible();
    expect(within(draft).getByText('Icon')).toBeVisible();
    expect(
      screen.getByRole('option', { name: 'CustomCustom details' }),
    ).toBeVisible();
    expect(screen.getByRole('option', { name: 'Generated id' })).toBeVisible();
  });

  it('allows low-level items to replace the built-in selection indicator', () => {
    render(
      <Select aria-label="Status" defaultValue="custom">
        <SelectItem id="custom" textValue="Custom">
          {({ isSelected }) => (
            <span>{isSelected ? 'Custom selected' : 'Custom'}</span>
          )}
        </SelectItem>
      </Select>,
    );

    openSelect();

    const option = screen.getByRole('option', { name: 'Custom selected' });
    expect(option).toHaveAttribute('aria-selected', 'true');
    expect(option.querySelector('.bui-SelectItemIndicator')).toBeNull();
    expect(option.querySelector('.bui-SelectItemContent')).toBeNull();
    expect(option.firstElementChild).toHaveTextContent('Custom selected');
  });

  it('allows low-level items to opt into the built-in selection indicator', () => {
    render(
      <Select aria-label="Status" defaultValue="custom">
        <SelectItem id="custom" textValue="Custom" showSelectionIndicator>
          Custom
        </SelectItem>
      </Select>,
    );

    openSelect();

    const option = screen.getByRole('option', { name: 'Custom' });
    expect(option.querySelector('.bui-SelectItemIndicator')).toBeVisible();
    expect(option.querySelector('.bui-SelectItemContent')).toBeVisible();
  });

  it('renders normalized convenience options through the text preset', () => {
    render(
      <Select
        aria-label="Status"
        options={[
          {
            id: 'draft',
            label: 'Draft',
            description: 'Work in progress',
            leadingIcon: <span>Icon</span>,
          },
          { value: 'published', label: 'Published' },
        ]}
      />,
    );

    openSelect();

    const draft = screen.getByRole('option', { name: 'Draft' });
    expect(within(draft).getByText('Work in progress')).toBeVisible();
    expect(within(draft).getByText('Icon')).toBeVisible();
    expect(within(draft).getByText('Draft')).toHaveClass('bui-SelectItemLabel');
    expect(screen.getByRole('option', { name: 'Published' })).toBeVisible();
  });

  it('renders the Select popover using the BUI Popover class structure', () => {
    render(<Select aria-label="Status" options={options} />);

    openSelect();

    const popover = document.querySelector('.bui-SelectPopover');
    const listbox = screen.getByRole('listbox');
    const content = listbox.closest<HTMLElement>('.bui-SelectContent');
    const results = listbox.closest<HTMLElement>('.bui-SelectResults');

    expect(popover).toHaveClass('bui-Popover');
    expect(popover?.querySelector('.bui-PopoverContent')).toHaveClass(
      'bui-Box',
    );
    expect(content).toBeTruthy();
    expect(content).toContainElement(results);
    expect(results).toContainElement(listbox);
  });

  it('renders dynamic profile items without repeating their ids', () => {
    const owners = [
      { id: 'ada', name: 'Ada Lovelace', avatarUrl: 'ada.png' },
      { id: 'grace', name: 'Grace Hopper' },
    ];

    render(
      <Select aria-label="Owner" items={owners}>
        {owner => <SelectItemProfile name={owner.name} src={owner.avatarUrl} />}
      </Select>,
    );

    openSelect();

    const ada = screen.getByRole('option', { name: 'Ada Lovelace' });
    expect(ada.querySelector('[role="img"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(screen.getByRole('option', { name: 'Grace Hopper' })).toBeVisible();
  });

  it('invalidates cached dynamic item rendering through dependencies', () => {
    const owners = [{ id: 'ada', name: 'Ada Lovelace' }];

    function OwnerSelect({ suffix }: { suffix: string }) {
      return (
        <Select aria-label="Owner" items={owners} dependencies={[suffix]}>
          {owner => <SelectItemText title={`${owner.name} ${suffix}`} />}
        </Select>
      );
    }

    const { rerender } = render(<OwnerSelect suffix="A" />);
    openSelect();
    expect(
      screen.getByRole('option', { name: 'Ada Lovelace A' }),
    ).toBeVisible();

    rerender(<OwnerSelect suffix="B" />);

    expect(
      screen.getByRole('option', { name: 'Ada Lovelace B' }),
    ).toBeVisible();
  });

  it('renders profile initials when an avatar source is not provided', () => {
    render(
      <Select aria-label="Owner">
        <SelectItemProfile id="grace" name="Grace Hopper" />
      </Select>,
    );

    openSelect();

    const grace = screen.getByRole('option', { name: 'Grace Hopper' });
    expect(grace.querySelector('[role="img"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(within(grace).getByText('G')).toBeVisible();
  });

  it('renders selected text in the trigger instead of rich item contents', () => {
    render(
      <Select aria-label="Status" defaultValue="custom">
        <SelectItem id="custom" textValue="Custom">
          <span>Custom</span>
          <span>Custom details</span>
        </SelectItem>
      </Select>,
    );

    expect(screen.getByRole('button')).toHaveTextContent('Custom');
    expect(screen.getByRole('button')).not.toHaveTextContent('Custom details');
  });

  it('keeps the deprecated defaultSelectedKey alias working', () => {
    render(
      <Select aria-label="Status" defaultSelectedKey="draft">
        <SelectItemText id="draft" title="Draft" />
      </Select>,
    );

    expect(screen.getByRole('button')).toHaveTextContent('Draft');
  });

  it('enables client filtering with the search shorthand', () => {
    render(<Select aria-label="Status" options={options} search />);

    openSelect();
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'pub' },
    });

    expect(screen.queryByRole('option', { name: 'Draft' })).toBeNull();
    expect(screen.getByRole('option', { name: 'Published' })).toBeVisible();
  });

  it('renders the nested search placeholder', () => {
    render(
      <Select
        aria-label="Status"
        options={options}
        search={{ placeholder: 'Find status' }}
      />,
    );

    openSelect();

    expect(screen.getByPlaceholderText('Find status')).toBeVisible();
  });

  it('filters normalized plain options with a full-row client predicate', () => {
    const filter = jest.fn(
      (option: IdentifiedOption, query: string) =>
        option.description?.includes(query) === true,
    );

    render(
      <Select
        aria-label="Status"
        options={[
          { value: 'draft', label: 'Draft' },
          {
            id: 'published',
            label: 'Published',
            description: 'Visible to everyone',
          },
        ]}
        search={{ filter }}
      />,
    );

    openSelect();
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'everyone' },
    });

    expect(screen.queryByRole('option', { name: 'Draft' })).toBeNull();
    expect(screen.getByRole('option', { name: 'Published' })).toBeVisible();
    expect(filter).toHaveBeenCalledWith(
      {
        id: 'draft',
        label: 'Draft',
        disabled: undefined,
      },
      'everyone',
    );
  });

  it('resets uncontrolled nested search when the popup is reopened', () => {
    render(
      <Select
        aria-label="Status"
        options={options}
        search={{ defaultInputValue: 'draft' }}
      />,
    );

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'published' },
    });
    fireEvent.pointerDown(screen.getByTestId('underlay'));
    fireEvent.click(screen.getByTestId('underlay'));

    expect(screen.queryByRole('searchbox')).toBeNull();

    fireEvent.click(trigger);

    expect(screen.getByRole('searchbox')).toHaveValue('draft');
  });

  it('keeps controlled nested search caller-owned across popup closes', () => {
    const onInputChange = jest.fn();

    function ControlledSelect() {
      const [inputValue, setInputValue] = useState('draft');

      return (
        <Select
          aria-label="Status"
          options={options}
          search={{
            inputValue,
            onInputChange(value) {
              onInputChange(value);
              setInputValue(value);
            },
          }}
        />
      );
    }

    render(<ControlledSelect />);

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'published' },
    });
    fireEvent.pointerDown(screen.getByTestId('underlay'));
    fireEvent.click(screen.getByTestId('underlay'));

    expect(screen.queryByRole('searchbox')).toBeNull();
    expect(onInputChange).not.toHaveBeenCalledWith('');

    fireEvent.click(trigger);

    expect(screen.getByRole('searchbox')).toHaveValue('published');
  });

  it('keeps the deprecated searchable aliases working', () => {
    render(
      <Select
        aria-label="Status"
        options={options}
        searchable
        searchPlaceholder="Find status"
      />,
    );

    openSelect();
    fireEvent.change(screen.getByPlaceholderText('Find status'), {
      target: { value: 'pub' },
    });

    expect(screen.queryByRole('option', { name: 'Draft' })).toBeNull();
    expect(screen.getByRole('option', { name: 'Published' })).toBeVisible();
  });

  it('renders search outside the shared results scroller', () => {
    render(<Select aria-label="Status" options={options} search />);

    openSelect();

    const searchbox = screen.getByRole('searchbox');
    const listbox = screen.getByRole('listbox');
    const content = searchbox.closest<HTMLElement>('.bui-SelectContent');
    const results = listbox.closest<HTMLElement>('.bui-SelectResults');

    expect(searchbox.closest('.bui-SelectSearchWrapper')).toBeTruthy();
    expect(content).toBeTruthy();
    expect(content).toContainElement(results);
    expect(results).toContainElement(listbox);
    expect(results).not.toContainElement(searchbox);
    expect(content?.closest('.bui-SelectPopover')).toBeTruthy();
  });

  it('retains refreshed selected metadata outside manual server results', () => {
    const ada = { id: 'ada', name: 'Ada Lovelace' };
    const updatedAda = { id: 'ada', name: 'Ada Byron' };
    const grace = { id: 'grace', name: 'Grace Hopper' };

    function OwnerSelect({ items }: { items: Array<typeof ada> }) {
      return (
        <Select
          aria-label="Owner"
          items={items}
          value="ada"
          search={{ mode: 'server', inputValue: '', onInputChange() {} }}
        >
          {owner => <SelectItemProfile name={owner.name} />}
        </Select>
      );
    }

    const { rerender } = render(<OwnerSelect items={[ada, grace]} />);

    expect(screen.getByRole('button')).toHaveTextContent('Ada Lovelace');

    rerender(<OwnerSelect items={[updatedAda, grace]} />);
    expect(screen.getByRole('button')).toHaveTextContent('Ada Byron');

    rerender(<OwnerSelect items={[grace]} />);
    expect(screen.getByRole('button')).toHaveTextContent('Ada Byron');

    openSelect();

    expect(screen.queryByRole('option', { name: 'Ada Byron' })).toBeNull();
    expect(screen.getByRole('option', { name: 'Grace Hopper' })).toBeVisible();
  });

  it('derives server query state from a direct async options source', () => {
    mockIntersectionObserver();
    const setFilterText = jest.fn();
    const source: AsyncListSource<IdentifiedOption> = {
      items: options,
      filterText: 'draft',
      setFilterText,
      loadingState: 'idle',
      loadMore: jest.fn(),
    };

    render(
      <Select
        aria-label="Status"
        options={source}
        search={{ mode: 'server' }}
      />,
    );

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    expect(screen.getByRole('searchbox')).toHaveValue('draft');

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'published' },
    });
    fireEvent.click(trigger);

    expect(setFilterText).toHaveBeenCalledWith('published');
    expect(setFilterText).not.toHaveBeenCalledWith('');
  });

  it('keeps accumulated pages from a direct async options source visible', async () => {
    mockIntersectionObserver();

    function PaginatedSelect() {
      const list = useAsyncList<IdentifiedOption>({
        async load({ cursor }) {
          return cursor
            ? { items: [options[1]] }
            : { items: [options[0]], cursor: 'next' };
        },
      });

      return (
        <>
          <button onClick={() => list.loadMore()}>Load next page</button>
          <span data-testid="item-count">{list.items.length}</span>
          <Select aria-label="Status" options={list} />
        </>
      );
    }

    render(<PaginatedSelect />);

    await waitFor(() =>
      expect(screen.getByTestId('item-count')).toHaveTextContent('1'),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Load next page' }));

    await waitFor(() =>
      expect(screen.getByTestId('item-count')).toHaveTextContent('2'),
    );

    fireEvent.click(screen.getByRole('button', { name: /Select an option/ }));

    expect(screen.getByRole('option', { name: 'Draft' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'Published' })).toBeVisible();
  });

  it('retains metadata refreshed by direct async list updates', async () => {
    mockIntersectionObserver();

    const ada = { id: 'ada', label: 'Ada Lovelace' };
    const updatedAda = { id: 'ada', label: 'Ada Byron' };
    const grace = { id: 'grace', label: 'Grace Hopper' };

    function AsyncOwnerSelect() {
      const list = useAsyncList<IdentifiedOption>({
        async load({ filterText }) {
          return { items: filterText === 'grace' ? [grace] : [ada] };
        },
      });

      return (
        <>
          <button onClick={() => list.update('ada', updatedAda)}>
            Refresh Ada
          </button>
          <button onClick={() => list.setFilterText('grace')}>
            Search Grace
          </button>
          <Select
            aria-label="Owner"
            options={list}
            defaultValue="ada"
            search={{ mode: 'server' }}
          />
        </>
      );
    }

    render(<AsyncOwnerSelect />);

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /Ada Lovelace/ }),
      ).toBeVisible(),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Refresh Ada' }));
    expect(screen.getByRole('button', { name: /Ada Byron/ })).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'Search Grace' }));

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Ada Byron/ })).toBeVisible(),
    );

    fireEvent.click(screen.getByRole('button', { name: /Ada Byron/ }));

    expect(screen.queryByRole('option', { name: 'Ada Byron' })).toBeNull();
    expect(screen.getByRole('option', { name: 'Grace Hopper' })).toBeVisible();
  });

  it('keeps an empty completed collection open with the no-results treatment', () => {
    render(<Select aria-label="Status" options={[]} search />);

    openSelect();

    expect(screen.getByRole('listbox')).toBeVisible();
    expect(screen.getByText('No results found.')).toBeVisible();
  });

  it('delays the stale-results indication while server filtering', () => {
    jest.useFakeTimers();

    const { rerender } = render(
      <Select
        aria-label="Status"
        options={options}
        loading={{ state: 'filtering' }}
        search={{ mode: 'server', inputValue: '', onInputChange() {} }}
      />,
    );

    openSelect();

    const listbox = screen.getByRole('listbox');
    expect(listbox).not.toHaveAttribute('data-stale');

    act(() => jest.advanceTimersByTime(300));

    expect(listbox).toHaveAttribute('data-stale', 'true');

    rerender(
      <Select
        aria-label="Status"
        options={options}
        loading={{ state: 'idle' }}
        search={{ mode: 'server', inputValue: '', onInputChange() {} }}
      />,
    );

    expect(listbox).not.toHaveAttribute('data-stale');
  });

  it.each(['loading', 'filtering'] as const)(
    'immediately indicates loading for an empty %s collection',
    state => {
      const onLoadMore = jest.fn();
      mockIntersectionObserver();

      render(
        <Select
          aria-label="Status"
          options={[]}
          loading={{ state, onLoadMore }}
          search
        />,
      );

      openSelect();

      expect(screen.getByRole('listbox').parentElement).toHaveAttribute(
        'aria-busy',
        'true',
      );
      expect(document.querySelectorAll('.bui-SelectLoadingRow')).toHaveLength(
        3,
      );
      expect(screen.getByRole('listbox')).not.toHaveAttribute('data-stale');
      expect(screen.queryByText('Loading...')).toBeNull();
      expect(screen.queryByText('No results found.')).toBeNull();
      expect(screen.queryByTestId('loadMoreSentinel')).toBeNull();
      expect(onLoadMore).not.toHaveBeenCalled();
    },
  );

  it('renders a load-more sentinel without requesting another page while one is loading', () => {
    jest.useFakeTimers();

    const originalIntersectionObserver = window.IntersectionObserver;
    const onLoadMore = jest.fn();
    let handleIntersect: IntersectionObserverCallback | undefined;
    const observer = {
      disconnect: jest.fn(),
      observe: jest.fn(),
      root: null,
      rootMargin: '',
      takeRecords: jest.fn(),
      thresholds: [],
      unobserve: jest.fn(),
    };
    const intersectionObserver = jest.fn(callback => {
      handleIntersect = callback;
      return observer;
    });
    window.IntersectionObserver =
      intersectionObserver as unknown as typeof IntersectionObserver;

    try {
      const { rerender } = render(
        <Select
          aria-label="Status"
          options={options}
          loading={{ state: 'idle', onLoadMore }}
        />,
      );

      openSelect();

      const sentinel = screen.getByTestId('loadMoreSentinel');
      expect(observer.observe).toHaveBeenCalledWith(sentinel);
      expect(intersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ rootMargin: '0px 0% 0% 0%' }),
      );

      act(() => {
        handleIntersect?.(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          observer as unknown as IntersectionObserver,
        );
      });

      expect(onLoadMore).toHaveBeenCalledTimes(1);

      rerender(
        <Select
          aria-label="Status"
          options={options}
          loading={{ state: 'loadingMore', onLoadMore }}
        />,
      );

      expect(document.querySelectorAll('.bui-SelectLoadingRow')).toHaveLength(
        0,
      );

      act(() => jest.advanceTimersByTime(299));

      expect(document.querySelectorAll('.bui-SelectLoadingRow')).toHaveLength(
        0,
      );

      act(() => jest.advanceTimersByTime(1));

      expect(document.querySelectorAll('.bui-SelectLoadingRow')).toHaveLength(
        1,
      );
      expect(screen.queryByText('Loading...')).toBeNull();

      act(() => {
        handleIntersect?.(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          observer as unknown as IntersectionObserver,
        );
      });

      expect(onLoadMore).toHaveBeenCalledTimes(1);
    } finally {
      window.IntersectionObserver = originalIntersectionObserver;
    }
  });
});
