'use client';

import dynamic from 'next/dynamic';

// Import Table components dynamically with ssr: false to avoid SSR issues
const TableComponents = dynamic(
  () =>
    import('../../../../../packages/ui/src/components/Table').then(mod => ({
      default: () => null, // Placeholder
      Table: mod.Table,
      TableHeader: mod.TableHeader,
      Column: mod.Column,
      TableBody: mod.TableBody,
      Row: mod.Row,
      Cell: mod.Cell,
    })),
  { ssr: false },
);

import {
  Table,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
} from '../../../../../packages/ui/src/components/Table';
import { useState } from 'react';
import type { Selection } from 'react-aria-components';

const rockBands = [
  { id: 1, name: 'The Beatles', genre: 'Rock', year: 1960 },
  { id: 2, name: 'Led Zeppelin', genre: 'Hard Rock', year: 1968 },
  { id: 3, name: 'Pink Floyd', genre: 'Progressive Rock', year: 1965 },
  { id: 4, name: 'The Rolling Stones', genre: 'Rock', year: 1962 },
  { id: 5, name: 'Queen', genre: 'Rock', year: 1970 },
];

// Simple wrapper to ensure client-side only rendering
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useState(() => {
    if (typeof window !== 'undefined') {
      setMounted(true);
    }
  });

  if (!mounted) return <div>Loading...</div>;
  return <>{children}</>;
};

export const TableRockBand = () => (
  <ClientOnly>
    <Table aria-label="Rock Bands">
      <TableHeader>
        <Column>Name</Column>
        <Column>Genre</Column>
        <Column>Year</Column>
      </TableHeader>
      <TableBody>
        {rockBands.map(band => (
          <Row key={band.id}>
            <Cell>{band.name}</Cell>
            <Cell>{band.genre}</Cell>
            <Cell>{band.year}</Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  </ClientOnly>
);

export const SelectionModePlayground = () => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  return (
    <ClientOnly>
      <Table
        aria-label="Rock Bands"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader>
          <Column>Name</Column>
          <Column>Genre</Column>
          <Column>Year</Column>
        </TableHeader>
        <TableBody>
          {rockBands.map(band => (
            <Row key={band.id}>
              <Cell>{band.name}</Cell>
              <Cell>{band.genre}</Cell>
              <Cell>{band.year}</Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </ClientOnly>
  );
};

export const SelectionBehaviorPlayground = () => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  return (
    <ClientOnly>
      <Table
        aria-label="Rock Bands"
        selectionMode="multiple"
        selectionBehavior="replace"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader>
          <Column>Name</Column>
          <Column>Genre</Column>
          <Column>Year</Column>
        </TableHeader>
        <TableBody>
          {rockBands.map(band => (
            <Row key={band.id}>
              <Cell>{band.name}</Cell>
              <Cell>{band.genre}</Cell>
              <Cell>{band.year}</Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </ClientOnly>
  );
};

export const SelectionToggleWithActions = () => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  return (
    <ClientOnly>
      <Table
        aria-label="Rock Bands"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader>
          <Column>Name</Column>
          <Column>Genre</Column>
          <Column>Year</Column>
        </TableHeader>
        <TableBody>
          {rockBands.map(band => (
            <Row key={band.id}>
              <Cell>{band.name}</Cell>
              <Cell>{band.genre}</Cell>
              <Cell>{band.year}</Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </ClientOnly>
  );
};
