import type { EvalTask } from '../types';

const task: EvalTask = {
  id: 'data-table',
  tier: 'component',
  title: 'Data Table',
  prompt: `Build a React component called UserTable using @backstage/ui components.

The table should show a list of users with the columns: Name (using CellProfile with name and description), Email (using CellText), and Status (using CellText).

Use the useTable hook with mode "complete", a static getData function returning at least 3 sample rows, and paginationOptions set to pageSize 10.
Pass the returned tableProps spread onto the Table component along with a columnConfig prop built from ColumnConfig type.

All components and hooks must be imported from "@backstage/ui".

Return only a valid TSX code block, no explanation.`,
  relevantComponents: ['Table', 'useTable', 'CellText', 'CellProfile'],
};

export default task;
