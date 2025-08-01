import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '../../utils/propDefs';

export const tablePropDefs: Record<string, PropDef> = {
  table: {
    type: 'complex',
    complexType: {
      name: 'Table<TData>',
      properties: {
        'TanStack Table instance': {
          type: 'object',
          required: true,
          description:
            'The TanStack Table instance created with useReactTable()',
        },
      },
    },
    required: true,
  },
  onRowClick: {
    type: 'complex',
    complexType: {
      name: '(row: TData, event: React.MouseEvent<HTMLTableRowElement>) => void',
      properties: {
        row: {
          type: 'TData',
          required: true,
          description: 'The row data object',
        },
        event: {
          type: 'React.MouseEvent<HTMLTableRowElement>',
          required: true,
          description: 'The mouse event object',
        },
      },
    },
    required: false,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const tablePaginationPropDefs: Record<string, PropDef> = {
  table: {
    type: 'complex',
    complexType: {
      name: 'Table<TData>',
      properties: {
        'TanStack Table instance': {
          type: 'object',
          required: true,
          description:
            'The TanStack Table instance (same instance passed to Table component)',
        },
      },
    },
    required: true,
  },
};

export const tableUsageSnippet = `import {
  Cell,
  CellProfile,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
  TablePagination,
} from '@backstage/ui';

<Table>
  <TableHeader>
    <Column />
  </TableHeader>
  <TableBody>
    <Row>
      <Cell />
      <CellProfile />
    </Row>
  </TableBody>
</Table>
<TablePagination />`;

export const tableBasicSnippet = `import { Table, TablePagination } from '@backstage/ui';

const [pageIndex, setPageIndex] = useState(0);
const [pageSize, setPageSize] = useState(5);

const data = [
  {
    name: 'The Beatles',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/42/Beatles_-...jpg',
    genre: 'Rock, Pop, Psychedelic Rock',
    yearFormed: 1960,
    albums: 13
  },
  // ... more data
];

const newData = data4.slice(
  pageIndex * pageSize,
  (pageIndex + 1) * pageSize,
);

<Table>
  <TableHeader>
    <Column isRowHeader>Band name</Column>
    <Column>Genre</Column>
    <Column>Year formed</Column>
    <Column>Albums</Column>
  </TableHeader>
  <TableBody>
    {newData.map(item => (
      <Row key={item.name}>
        <CellProfileBUI
          name={item.name}
          src={item.image}
          href={item.website}
        />
        <Cell title={item.genre} />
        <Cell title={item.yearFormed.toString()} />
        <Cell title={item.albums.toString()} />
      </Row>
    ))}
  </TableBody>
</Table>
<TablePagination
  pageIndex={pageIndex}
  pageSize={pageSize}
  rowCount={data4.length}
  setPageIndex={setPageIndex}
  setPageSize={setPageSize}
/>`;
