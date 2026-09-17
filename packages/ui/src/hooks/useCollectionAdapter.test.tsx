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

import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { useState } from 'react';
import {
  Button,
  Collection,
  ComboBox,
  Input,
  ListBox,
  ListBoxItem,
  ListBoxItemProps,
  Popover,
  Select,
  SelectableCollectionContext,
  SelectValue,
} from 'react-aria-components';
import type { AsyncListSource } from '../types/selectableCollection';
import { useCollectionAdapter } from './useCollectionAdapter';

type Owner = {
  id: string;
  name: string;
  email?: string;
};

describe('React Aria collection contracts', () => {
  it('injects the dynamic item id and value into item wrappers', () => {
    const owner = { id: 'ada', name: 'Ada Lovelace' };
    let receivedProps: ListBoxItemProps<Owner> | undefined;

    function ProbeItem(props: ListBoxItemProps<Owner>) {
      receivedProps = props;
      return <ListBoxItem {...props} />;
    }

    render(
      <ListBox aria-label="Owners">
        <Collection items={[owner]}>
          {item => <ProbeItem textValue={item.name}>{item.name}</ProbeItem>}
        </Collection>
      </ListBox>,
    );

    expect(receivedProps?.id).toBe('ada');
    expect(receivedProps?.value).toBe(owner);
  });

  it('rejects dynamic items without an id at the collection boundary', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    expect(() =>
      render(
        <ListBox aria-label="Owners">
          <Collection items={[{ name: 'Ada Lovelace' }]}>
            {item => <ListBoxItem>{item.name}</ListBoxItem>}
          </Collection>
        </ListBox>,
      ),
    ).toThrow('Could not determine key for item');

    consoleError.mockRestore();
  });

  it('allows static items without an explicit id', () => {
    render(
      <ListBox aria-label="Owners">
        <ListBoxItem>Ada Lovelace</ListBoxItem>
      </ListBox>,
    );

    expect(screen.getByRole('option', { name: 'Ada Lovelace' })).toBeVisible();
  });

  it('renders the selected text instead of rich item contents in a Select', () => {
    render(
      <Select aria-label="Owner">
        <Button>
          <SelectValue>
            {({ selectedText, defaultChildren }) =>
              selectedText || defaultChildren
            }
          </SelectValue>
        </Button>
        <Popover>
          <ListBox>
            <ListBoxItem id="ada" textValue="Ada Lovelace">
              <span>Ada Lovelace</span>
              <span>ada@example.com</span>
            </ListBoxItem>
          </ListBox>
        </Popover>
      </Select>,
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('option'));

    expect(screen.getByRole('button')).toHaveTextContent('Ada Lovelace');
    expect(screen.getByRole('button')).not.toHaveTextContent('ada@example.com');
  });

  it('projects ComboBox rows with a full-item filter and the live input value', () => {
    const owners = [
      {
        id: 'ada',
        name: 'Ada Lovelace',
        email: 'ada@example.com',
      },
      {
        id: 'grace',
        name: 'Grace Hopper',
        email: 'grace@navy.mil',
      },
    ];
    const filter = jest.fn((owner: Owner, query: string) =>
      owner.email?.includes(query),
    );

    function TestComboBox() {
      const [inputValue, setInputValue] = useState('');

      return (
        <ComboBox
          aria-label="Owner"
          defaultFilter={() => true}
          items={owners}
          onInputChange={setInputValue}
        >
          <Input />
          <Button>Open</Button>
          <Popover>
            <SelectableCollectionContext.Provider
              value={{
                filter: (_textValue, node) =>
                  filter(node.value, inputValue) === true,
              }}
            >
              <ListBox<Owner>>
                {item => (
                  <ListBoxItem id={item.id} textValue={item.name}>
                    {item.name}
                  </ListBoxItem>
                )}
              </ListBox>
            </SelectableCollectionContext.Provider>
          </Popover>
        </ComboBox>
      );
    }

    render(<TestComboBox />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'navy' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Show suggestions' }));

    expect(screen.queryByRole('option', { name: 'Ada Lovelace' })).toBeNull();
    expect(screen.getByRole('option', { name: 'Grace Hopper' })).toBeVisible();
    expect(filter).toHaveBeenCalledWith(owners[1], 'navy');
  });
});

describe('useCollectionAdapter', () => {
  const ada = { id: 'ada', name: 'Ada Lovelace' };
  const grace = { id: 'grace', name: 'Grace Hopper' };

  it('retains selected rows outside a later server snapshot', () => {
    const { result, rerender } = renderHook(
      ({
        items,
        selectedKeys,
      }: {
        items: Owner[];
        selectedKeys: Set<string>;
      }) =>
        useCollectionAdapter({
          items,
          selectedKeys,
          search: {
            mode: 'server',
            inputValue: '',
            onInputChange() {},
          },
        }),
      {
        initialProps: {
          items: [ada, grace],
          selectedKeys: new Set(['ada']),
        },
      },
    );

    expect(result.current.canonicalItems).toEqual([ada, grace]);
    expect(result.current.visibleIds).toEqual(new Set(['ada', 'grace']));

    rerender({
      items: [grace],
      selectedKeys: new Set(['ada']),
    });

    expect(result.current.canonicalItems).toEqual([grace, ada]);
    expect(result.current.visibleIds).toEqual(new Set(['grace']));
  });

  it('can expose only the current server snapshot', () => {
    const { result, rerender } = renderHook(
      ({ items }: { items: Owner[] }) =>
        useCollectionAdapter({
          items,
          selectedKeys: new Set(['ada']),
          search: {
            mode: 'server',
            inputValue: '',
            onInputChange() {},
          },
          retainSelectedItems: false,
        }),
      { initialProps: { items: [ada, grace] } },
    );

    rerender({ items: [grace] });

    expect(result.current.canonicalItems).toEqual([grace]);
    expect(result.current.visibleIds).toBeUndefined();
  });

  it('prefers fresh server rows and retains their updated metadata', () => {
    const updatedAda = { id: 'ada', name: 'Ada Byron' };
    const { result, rerender } = renderHook(
      ({ items }: { items: Owner[] }) =>
        useCollectionAdapter({
          items,
          selectedKeys: new Set(['ada']),
          search: {
            mode: 'server',
            inputValue: '',
            onInputChange() {},
          },
        }),
      { initialProps: { items: [ada] } },
    );

    rerender({ items: [updatedAda, grace] });

    expect(result.current.canonicalItems).toEqual([updatedAda, grace]);

    rerender({ items: [grace] });

    expect(result.current.canonicalItems).toEqual([grace, updatedAda]);
  });

  it('drops retained rows when they are deselected', () => {
    const { result, rerender } = renderHook(
      ({
        items,
        selectedKeys,
      }: {
        items: Owner[];
        selectedKeys: Set<string>;
      }) =>
        useCollectionAdapter({
          items,
          selectedKeys,
          search: {
            mode: 'server',
            inputValue: '',
            onInputChange() {},
          },
        }),
      {
        initialProps: {
          items: [ada],
          selectedKeys: new Set(['ada']),
        },
      },
    );

    rerender({ items: [], selectedKeys: new Set(['ada']) });
    expect(result.current.canonicalItems).toEqual([ada]);

    rerender({ items: [], selectedKeys: new Set() });
    expect(result.current.canonicalItems).toEqual([]);
  });

  it('retains multiple selected rows', () => {
    const linus = { id: 'linus', name: 'Linus Torvalds' };
    const { result, rerender } = renderHook(
      ({ items }: { items: Owner[] }) =>
        useCollectionAdapter({
          items,
          selectedKeys: new Set(['ada', 'grace']),
          search: {
            mode: 'server',
            inputValue: '',
            onInputChange() {},
          },
        }),
      { initialProps: { items: [ada, grace] } },
    );

    rerender({ items: [linus] });

    expect(result.current.canonicalItems).toEqual([linus, ada, grace]);
    expect(result.current.visibleIds).toEqual(new Set(['linus']));
  });

  it('derives loading and server query plumbing from an async source', () => {
    const setFilterText = jest.fn();
    const loadMore = jest.fn();
    const source: AsyncListSource<Owner> = {
      items: [ada, grace],
      filterText: 'ada',
      setFilterText,
      loadingState: 'loadingMore',
      loadMore,
    };

    const { result } = renderHook(() =>
      useCollectionAdapter({
        items: source,
        selectedKeys: new Set(),
        search: { mode: 'server' },
      }),
    );

    expect(result.current).toMatchObject({
      canonicalItems: [ada, grace],
      visibleIds: new Set(['ada', 'grace']),
      loading: {
        state: 'loadingMore',
        onLoadMore: loadMore,
      },
      isStale: false,
      inputValue: 'ada',
      onInputChange: setFilterText,
    });
  });

  it('marks retained async rows as stale while filtering or sorting replacements', () => {
    const source: AsyncListSource<Owner> = {
      items: [ada, grace],
      filterText: 'ada',
      setFilterText() {},
      loadingState: 'filtering',
      loadMore() {},
    };

    const { result, rerender } = renderHook(
      ({
        items,
        loadingState,
      }: Pick<AsyncListSource<Owner>, 'items' | 'loadingState'>) =>
        useCollectionAdapter({
          items: { ...source, items, loadingState },
          selectedKeys: new Set(),
          search: { mode: 'server' },
        }),
      {
        initialProps: {
          items: source.items,
          loadingState: source.loadingState,
        },
      },
    );

    expect(result.current.isStale).toBe(true);

    rerender({ items: source.items, loadingState: 'sorting' });
    expect(result.current.isStale).toBe(true);

    rerender({ items: [], loadingState: 'filtering' });
    expect(result.current.isStale).toBe(false);

    rerender({ items: source.items, loadingState: 'loadingMore' });
    expect(result.current.isStale).toBe(false);
  });

  it('preserves explicit loading and server query plumbing for iterables', () => {
    const onInputChange = jest.fn();
    const onLoadMore = jest.fn();
    const { result } = renderHook(() =>
      useCollectionAdapter({
        items: [ada],
        selectedKeys: new Set(),
        loading: {
          state: 'filtering',
          onLoadMore,
        },
        search: {
          mode: 'server',
          inputValue: 'ada',
          onInputChange,
        },
      }),
    );

    expect(result.current).toMatchObject({
      canonicalItems: [ada],
      visibleIds: new Set(['ada']),
      loading: {
        state: 'filtering',
        onLoadMore,
      },
      inputValue: 'ada',
      onInputChange,
    });
  });

  it('leaves ordinary client filtering to React Aria', () => {
    const { result } = renderHook(() =>
      useCollectionAdapter({
        items: [ada, grace],
        selectedKeys: new Set(),
        search: true,
      }),
    );

    expect(result.current.canonicalItems).toEqual([ada, grace]);
    expect(result.current.visibleIds).toBeUndefined();
  });
});
