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

export const tableUsageSnippet = `import { useReactTable, getCoreRowModel, ColumnDef } from '@tanstack/react-table';
import { Table, TablePagination } from '@backstage/ui/components/Table';

interface Person {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
}

const data: Person[] = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
  },
  // ... more data
];

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    accessorKey: 'visits',
    header: 'Visits',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
];

function MyTable() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Table table={table} />
      <TablePagination table={table} />
    </>
  );
}`;

export const tableBasicSnippet = `const table = useReactTable({
  data: myData,
  columns: myColumns,
  getCoreRowModel: getCoreRowModel(),
});

return <Table table={table} />;`;

export const tableRowClickSnippet = `const table = useReactTable({
  data: myData,
  columns: myColumns,
  getCoreRowModel: getCoreRowModel(),
});

const handleRowClick = (rowData: MyDataType) => {
  console.log('Row clicked:', rowData);
  navigate(\`/details/\${rowData.id}\`);
};

return <Table table={table} onRowClick={handleRowClick} />;`;

export const tableHybridSnippet = `const columns: ColumnDef<MyDataType>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link 
        to={\`/items/\${row.original.id}\`}
        onClick={(e) => e.stopPropagation()} // Prevent row click
      >
        <TableCellText title={row.getValue('name')} />
      </Link>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <TableCellText title={row.getValue('status')} />,
  },
];

const table = useReactTable({
  data: myData,
  columns,
  getCoreRowModel: getCoreRowModel(),
});

const handleRowClick = (rowData: MyDataType) => {
  // Called when clicking empty row areas (not the name link)
  showQuickPreview(rowData);
};

return <Table table={table} onRowClick={handleRowClick} />;`;

export const tableCellInteractionsSnippet = `const columns: ColumnDef<MyDataType>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link to={\`/items/\${row.original.id}\`}>
        <TableCellText title={row.getValue('name')} />
      </Link>
    ),
  },
  {
    accessorKey: 'owner',
    header: 'Owner',  
    cell: ({ row }) => (
      <div
        onClick={(e) => {
          e.stopPropagation();
          openContactModal(row.original.owner);
        }}
        style={{ cursor: 'pointer' }}
      >
        <TableCellText title={row.original.owner.name} />
      </div>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleEdit(row.original);
        }}
      >
        Edit
      </button>
    ),
  },
];`;

export const tablePaginationSnippet = `import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel 
} from '@tanstack/react-table';
import { Table, TablePagination } from '@backstage/ui/components/Table';

const table = useReactTable({
  data: myData,
  columns: myColumns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(), // Enable pagination
});

return (
  <>
    <Table table={table} />
    <TablePagination table={table} />
  </>
);`;

export const tableSelectionSnippet = `import { useState } from 'react';
import { 
  useReactTable, 
  getCoreRowModel,
  RowSelectionState
} from '@tanstack/react-table';

const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

const table = useReactTable({
  data: myData,
  columns: myColumns,
  getCoreRowModel: getCoreRowModel(),
  enableRowSelection: true,
  state: {
    rowSelection,
  },
  onRowSelectionChange: setRowSelection,
});

// Access selected rows
const selectedRows = table.getFilteredSelectedRowModel().rows;

return <Table table={table} />;`;

export const tableSortingSnippet = `import { 
  useReactTable, 
  getCoreRowModel, 
  getSortedRowModel 
} from '@tanstack/react-table';

const table = useReactTable({
  data: myData,
  columns: myColumns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(), // Enable sorting
});

return <Table table={table} />;`;
