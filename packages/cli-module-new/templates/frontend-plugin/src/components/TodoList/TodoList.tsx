import { Table, useTable, CellText, type ColumnConfig } from '@backstage/ui';

export type TodoItem = {
  title: string;
  id: string;
  createdBy: string;
  createdAt: string;
};

const columns: ColumnConfig<TodoItem>[] = [
  {
    id: 'title',
    label: 'Title',
    cell: item => <CellText title={item.title} />,
  },
  {
    id: 'createdBy',
    label: 'Created by',
    cell: item => <CellText title={item.createdBy} />,
  },
  {
    id: 'createdAt',
    label: 'Created at',
    cell: item => <CellText title={new Date(item.createdAt).toLocaleString()} />,
  },
];

export const TodoList = ({ todos }: { todos: TodoItem[] }) => {
  const { tableProps } = useTable({
    mode: 'complete',
    data: todos,
    paginationOptions: { pageSize: todos.length || 1 },
  });

  return (
    <Table
      columnConfig={columns}
      {...tableProps}
      pagination={{ type: 'none' }}
    />
  );
};
