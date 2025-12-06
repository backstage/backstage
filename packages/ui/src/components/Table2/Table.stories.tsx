/*
 * Copyright 2025 The Backstage Authors
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

import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { Table } from './Table';
import { MemoryRouter } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TableProps } from './types';
import { useTableAsyncData } from './hooks/useTableAsyncData';
import { useTableData } from './hooks/useTableData';
import {
  OffsetPaginationConfig,
  CursorPaginationConfig,
  ClientSidePaginationConfig,
} from './types';
import {
  TableRoot,
  TableHeader,
  TableBody,
  Column,
  Row,
  Cell,
  CellText,
  CellProfile,
} from './components';
import { TablePagination } from '../TablePagination2';

const meta = {
  title: 'Backstage UI/Table 2',
  decorators: [
    (Story: StoryFn) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// TypeScript types for Pokemon data
interface PokemonListItem {
  name: string;
  url: string;
}

interface PokeAPIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

interface PokemonDetail {
  id: number;
  name: string;
  sprite: string;
  type: string;
  height: number;
  weight: number;
  url: string;
}

// Helper function to fetch Pokemon list from PokeAPI
async function fetchPokemonList(
  offset: number,
  limit: number,
): Promise<PokeAPIResponse> {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`,
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Helper function to fetch Pokemon with detailed information
async function fetchPokemonWithDetails(
  offset: number,
  limit: number,
): Promise<{ data: PokemonDetail[]; totalCount: number }> {
  const json = await fetchPokemonList(offset, limit);

  // Fetch additional details for each Pokemon
  const pokemonDetails = await Promise.all(
    json.results.map(async pokemon => {
      const detailResponse = await fetch(pokemon.url);
      if (!detailResponse.ok) {
        return null;
      }
      const detailJson = await detailResponse.json();
      return {
        id: detailJson.id,
        name:
          detailJson.name.charAt(0).toLocaleUpperCase('en-US') +
          detailJson.name.slice(1),
        sprite: detailJson.sprites.front_default,
        type: detailJson.types
          .map((t: { type: { name: string } }) => t.type.name)
          .join(', '),
        height: detailJson.height,
        weight: detailJson.weight,
        url: pokemon.url,
      };
    }),
  );

  const transformedData = pokemonDetails.filter(Boolean).map(pokemon => ({
    id: pokemon!.id,
    name: pokemon!.name,
    sprite: pokemon!.sprite,
    type: pokemon!.type,
    height: pokemon!.height,
    weight: pokemon!.weight,
    url: pokemon!.url,
  }));

  return {
    data: transformedData,
    totalCount: json.count,
  };
}

// Offset Pagination Story
export const TableOffsetPagination: Story = {
  render: () => {
    const columns: TableProps['columns'] = [
      { name: 'Name', id: 'name', isRowHeader: true },
      { name: 'URL', id: 'url' },
    ];

    const fetchData = async (offset: number, pageSize: number) => {
      const json = await fetchPokemonList(offset, pageSize);
      // Transform Pokemon data to match column structure
      const transformedData = json.results.map((pokemon, index) => ({
        id: offset + index + 1,
        name:
          pokemon.name.charAt(0).toLocaleUpperCase('en-US') +
          pokemon.name.slice(1),
        url: pokemon.url,
      }));

      return {
        data: transformedData,
        totalCount: json.count,
      };
    };

    const paginationConfig: OffsetPaginationConfig = {
      mode: 'offset',
      fetchData,
      initialOffset: 0,
      initialPageSize: 20,
      showPageSizeOptions: true,
    };

    const paginationState = useTableAsyncData(paginationConfig);

    return (
      <Table
        columns={columns}
        data={paginationState.data}
        pagination={paginationState}
        loading={paginationState.loading}
        error={paginationState.error}
      />
    );
  },
};

// Cursor Pagination Story
export const TableCursorPagination: Story = {
  render: () => {
    const columns: TableProps['columns'] = [
      { name: 'Name', id: 'name', isRowHeader: true },
      { name: 'URL', id: 'url' },
    ];

    // Simulate cursor pagination using offset as cursor
    // The cursor is simply the offset value as a string (e.g., "0", "20", "40")
    const fetchData = async (
      cursor: string | undefined,
      limit: number,
    ): Promise<{
      data: Array<{ id: number; name: string; url: string }>;
      nextCursor?: string;
      prevCursor?: string;
      totalCount?: number;
    }> => {
      // Parse cursor as offset (default to 0 if no cursor)
      const offset = cursor ? parseInt(cursor, 10) : 0;

      const json = await fetchPokemonList(offset, limit);

      // Transform Pokemon data to match column structure
      const transformedData = json.results.map((pokemon, index) => ({
        id: offset + index + 1,
        name:
          pokemon.name.charAt(0).toLocaleUpperCase('en-US') +
          pokemon.name.slice(1),
        url: pokemon.url,
      }));

      // Calculate next and previous cursors based on offset
      const nextOffset = offset + limit;
      const prevOffset = offset - limit;
      const nextCursor = json.next ? String(nextOffset) : undefined;
      const prevCursor =
        offset > 0 ? String(Math.max(0, prevOffset)) : undefined;

      return {
        data: transformedData,
        nextCursor,
        prevCursor,
        totalCount: json.count,
      };
    };

    const paginationConfig: CursorPaginationConfig = {
      mode: 'cursor',
      fetchData,
      initialCursor: undefined, // Start from beginning
      initialLimit: 20,
    };

    const paginationState = useTableAsyncData(paginationConfig);

    return (
      <Table
        columns={columns}
        data={paginationState.data}
        pagination={paginationState}
        loading={paginationState.loading}
        error={paginationState.error}
      />
    );
  },
};

// Client-Side Pagination Story
export const TableClientSidePagination: Story = {
  render: () => {
    const columns: TableProps['columns'] = [
      { name: 'Name', id: 'name', isRowHeader: true },
      { name: 'URL', id: 'url' },
    ];

    const [allData, setAllData] = useState<
      Array<{ id: number; name: string; url: string }>
    >([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Fetch all data once
    useEffect(() => {
      const fetchAllData = async () => {
        setLoading(true);
        setError(null);
        try {
          const json = await fetchPokemonList(0, 1000);
          // Transform Pokemon data to match column structure
          const transformedData = json.results.map((pokemon, index) => ({
            id: index + 1,
            name:
              pokemon.name.charAt(0).toLocaleUpperCase('en-US') +
              pokemon.name.slice(1),
            url: pokemon.url,
          }));
          setAllData(transformedData);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
          setLoading(false);
        }
      };
      fetchAllData();
    }, []);

    const paginationConfig: ClientSidePaginationConfig = {
      mode: 'client',
      data: allData,
      initialPageSize: 20,
      showPageSizeOptions: true,
    };

    const paginationState = useTableData(paginationConfig);

    if (loading) {
      return <div style={{ padding: '20px' }}>Loading...</div>;
    }

    if (error) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          Error: {error.message}
        </div>
      );
    }

    return (
      <Table
        columns={columns}
        data={paginationState.data}
        pagination={paginationState}
        loading={paginationState.loading}
        error={paginationState.error}
      />
    );
  },
};

// Custom Components Story with Offset Pagination
// This story demonstrates how to use custom cell components (CellProfile and CellText)
// instead of the default Cell component, while using offset pagination
export const TableWithCustomComponents: Story = {
  render: () => {
    const columns: TableProps['columns'] = [
      { name: 'Pokemon', id: 'name', isRowHeader: true },
      { name: 'Type', id: 'type' },
      { name: 'Details', id: 'details' },
    ];

    const fetchData = async (offset: number, pageSize: number) => {
      return fetchPokemonWithDetails(offset, pageSize);
    };

    const paginationConfig: OffsetPaginationConfig = {
      mode: 'offset',
      fetchData,
      initialOffset: 0,
      initialPageSize: 10,
      showPageSizeOptions: true,
    };

    const paginationState = useTableAsyncData(paginationConfig);

    return (
      <>
        {paginationState.error && (
          <div style={{ color: 'red', padding: '10px' }}>
            Error: {paginationState.error.message}
          </div>
        )}
        {paginationState.loading && (
          <div style={{ padding: '10px' }}>Loading...</div>
        )}
        <TableRoot>
          <TableHeader columns={columns}>
            {column => (
              <Column isRowHeader={column.isRowHeader}>{column.name}</Column>
            )}
          </TableHeader>
          <TableBody items={paginationState.data} dependencies={[columns]}>
            {item => (
              <Row columns={columns}>
                {column => {
                  if (column.id === 'name') {
                    return (
                      <CellProfile
                        key={column.id}
                        src={item.sprite}
                        name={item.name}
                        description={`#${item.id}`}
                        href={`https://www.pokemon.com/us/pokedex/${item.name.toLocaleLowerCase(
                          'en-US',
                        )}`}
                      />
                    );
                  }
                  if (column.id === 'type') {
                    return (
                      <CellText
                        key={column.id}
                        title={item.type}
                        description={`Height: ${item.height / 10}m, Weight: ${
                          item.weight / 10
                        }kg`}
                      />
                    );
                  }
                  if (column.id === 'details') {
                    return (
                      <CellText
                        key={column.id}
                        title="View Details"
                        href={item.url}
                        description="External API link"
                      />
                    );
                  }
                  return <Cell key={column.id}>{item[column.id]}</Cell>;
                }}
              </Row>
            )}
          </TableBody>
        </TableRoot>
        {paginationState && (
          <TablePagination
            fromCount={paginationState.fromCount}
            toCount={paginationState.toCount}
            totalCount={paginationState.totalCount}
            pageSize={paginationState.pageSize}
            onNextPage={paginationState.onNextPage}
            onPreviousPage={paginationState.onPreviousPage}
            onPageSizeChange={paginationState.onPageSizeChange}
            isNextDisabled={paginationState.isNextDisabled}
            isPrevDisabled={paginationState.isPrevDisabled}
            isLoading={paginationState.loading}
            showPageSizeOptions={paginationState.showPageSizeOptions}
          />
        )}
      </>
    );
  },
};
