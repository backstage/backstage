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

// Offset Pagination Story
export const TableOffsetPagination: Story = {
  render: () => {
    const columns: TableProps['columns'] = [
      { name: 'Name', id: 'name', isRowHeader: true },
      { name: 'URL', id: 'url' },
    ];

    const fetchData = async (offset: number, pageSize: number) => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${pageSize}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json: PokeAPIResponse = await response.json();
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

    return (
      <Table
        columns={columns}
        pagination={{
          mode: 'offset',
          fetchData,
          initialOffset: 0,
          initialPageSize: 20,
          showPageSizeOptions: true,
        }}
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

      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json: PokeAPIResponse = await response.json();

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

    return (
      <Table
        columns={columns}
        pagination={{
          mode: 'cursor',
          fetchData,
          initialCursor: undefined, // Start from beginning
          initialLimit: 20,
        }}
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
          const response = await fetch(
            'https://pokeapi.co/api/v2/pokemon?limit=1000',
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const json: PokeAPIResponse = await response.json();
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
        pagination={{
          mode: 'client',
          data: allData,
          initialPageSize: 20,
          showPageSizeOptions: true,
        }}
      />
    );
  },
};
