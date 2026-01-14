import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const tablePropDefs: Record<string, PropDef> = {
  selectionBehavior: {
    type: 'enum',
    values: ['toggle', 'replace'],
    default: 'toggle',
    description: 'How multiple selection should behave in the collection.',
  },
  disabledBehavior: {
    type: 'enum',
    values: ['selection', 'all'],
    default: 'selection',
    description:
      'Whether disabledKeys applies to all interactions, or only selection.',
  },
  disabledKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    description: 'A list of row keys to disable.',
  },
  selectionMode: {
    type: 'enum',
    values: ['single', 'multiple'],
    description: 'The type of selection that is allowed in the collection.',
  },
  selectedKeys: {
    type: 'enum',
    values: ['all', 'Iterable<Key>'],
    description: 'The currently selected keys in the collection (controlled).',
  },
  defaultSelectedKeys: {
    type: 'enum',
    values: ['all', 'Iterable<Key>'],
    description: 'The initial selected keys in the collection (uncontrolled).',
  },
  onRowAction: {
    type: 'enum',
    values: ['(key: Key) => void'],
    description:
      'Handler that is called when a user performs an action on the row.',
  },
  onSelectionChange: {
    type: 'enum',
    values: ['(keys: Selection) => void'],
    description: 'Handler that is called when the selection changes.',
  },
  onSortChange: {
    type: 'enum',
    values: ['(descriptor: SortDescriptor) => any'],
    description:
      'Handler that is called when the sorted column or direction changes.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const tableHeaderPropDefs: Record<string, PropDef> = {
  onHoverStart: {
    type: 'enum',
    values: ['(e: HoverEvent) => void'],
    description: 'Handler that is called when a hover interaction starts.',
  },
  onHoverEnd: {
    type: 'enum',
    values: ['(e: HoverEvent) => void'],
    description: 'Handler that is called when a hover interaction ends.',
  },
  onHoverChange: {
    type: 'enum',
    values: ['(isHovering: boolean) => void'],
    description: 'Handler that is called when the hover state changes.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const columnPropDefs: Record<string, PropDef> = {
  id: {
    type: 'enum',
    values: ['Key'],
    description: 'The unique id of the column.',
  },
  allowsSorting: {
    type: 'boolean',
    description: 'Whether the column allows sorting.',
  },
  isRowHeader: {
    type: 'boolean',
    description:
      'Whether a column is a row header and should be announced by assistive technology during row navigation.',
  },
  textValue: {
    type: 'string',
    description:
      "A string representation of the column's contents, used for accessibility announcements.",
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const tableBodyPropDefs: Record<string, PropDef> = {
  renderEmptyState: {
    type: 'enum',
    values: ['(props) => ReactNode'],
    description:
      'Provides content to display when there are no rows in the table.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const rowPropDefs: Record<string, PropDef> = {
  textValue: {
    type: 'string',
    description:
      "A string representation of the row's contents, used for accessibility announcements.",
  },
  isDisabled: {
    type: 'boolean',
    description: 'Whether the row is disabled.',
  },
  id: {
    type: 'enum',
    values: ['Key'],
    description: 'The unique id of the row.',
  },
  href: {
    type: 'string',
    description: 'The URL to navigate to when the row is clicked.',
  },
  hrefLang: {
    type: 'string',
    description:
      'The language of the URL to navigate to when the row is clicked.',
  },
  target: {
    type: 'string',
    description:
      'The target of the URL to navigate to when the row is clicked.',
  },
  rel: {
    type: 'string',
    description:
      'The relationship of the URL to navigate to when the row is clicked.',
  },
  onAction: {
    type: 'enum',
    values: ['() => void'],
    description:
      "Handler that is called when a user performs an action on the row. The exact user event depends on the collection's selectionBehavior prop and the interaction modality.",
  },
  onHoverStart: {
    type: 'enum',
    values: ['(e: HoverEvent) => void'],
    description: 'Handler that is called when a hover interaction starts.',
  },
  onHoverEnd: {
    type: 'enum',
    values: ['(e: HoverEvent) => void'],
    description: 'Handler that is called when a hover interaction ends.',
  },
  onHoverChange: {
    type: 'enum',
    values: ['(isHovering: boolean) => void'],
    description: 'Handler that is called when the hover state changes.',
  },
  onPress: {
    type: 'enum',
    values: ['(e: PressEvent) => void'],
    description:
      'Handler that is called when the press is released over the target.',
  },
  onPressStart: {
    type: 'enum',
    values: ['(e: PressEvent) => void'],
    description: 'Handler that is called when a press interaction starts.',
  },
  onPressEnd: {
    type: 'enum',
    values: ['(e: PressEvent) => void'],
    description:
      'Handler that is called when a press interaction ends, either over the target or when the pointer leaves the target.',
  },
  onPressChange: {
    type: 'enum',
    values: ['(isPressed: boolean) => void'],
    description: 'Handler that is called when the press state changes.',
  },
  onPressUp: {
    type: 'enum',
    values: ['(e: PressEvent) => void'],
    description:
      'Handler that is called when a press is released over the target, regardless of whether it started on the target or not.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const cellPropDefs: Record<string, PropDef> = {
  id: {
    type: 'enum',
    values: ['Key'],
    description: 'The unique id of the cell.',
  },
  textValue: {
    type: 'string',
    description:
      "A string representation of the cell's contents, used for features like typeahead.",
  },
  leadingIcon: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Optional icon to display before the cell content.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const tablePaginationPropDefs: Record<string, PropDef> = {
  offset: {
    type: 'number',
    description: 'The current offset (starting index) for pagination.',
  },
  pageSize: {
    type: 'number',
    description: 'The number of items per page.',
  },
  setOffset: {
    type: 'enum',
    values: ['(offset: number) => void'],
    description: 'Handler that is called when the offset changes.',
  },
  setPageSize: {
    type: 'enum',
    values: ['(pageSize: number) => void'],
    description: 'Handler that is called when the page size changes.',
  },
  rowCount: {
    type: 'number',
    description: 'The total number of rows in the table.',
  },
  onNextPage: {
    type: 'enum',
    values: ['() => void'],
    description: 'Handler that is called when the next page is requested.',
  },
  onPreviousPage: {
    type: 'enum',
    values: ['() => void'],
    description: 'Handler that is called when the previous page is requested.',
  },
  onPageSizeChange: {
    type: 'enum',
    values: ['(pageSize: number) => void'],
    description: 'Handler that is called when the page size changes.',
  },
  showPageSizeOptions: {
    type: 'boolean',
    description: 'Whether to show the page size options.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const tableUsageSnippet = `import { Cell, CellText, ..., TableHeader, TablePagination } from '@backstage/ui';

<Table>
  <TableHeader>
    <Column />
  </TableHeader>
  <TableBody>
    <Row>
      <CellText title="Example" />
      <CellProfile />
    </Row>
  </TableBody>
</Table>
<TablePagination />`;

export const tableBasicSnippet = `import { Table, TableHeader, Column, TableBody, Row, CellText, CellProfile, TablePagination, useTable } from '@backstage/ui';

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

// Uncontrolled pagination (easiest)
const { data: paginatedData, paginationProps } = useTable({
  data,
  pagination: {
    defaultPageSize: 5,
  },
});

<Table>
  <TableHeader>
    <Column isRowHeader>Band name</Column>
    <Column>Genre</Column>
    <Column>Year formed</Column>
    <Column>Albums</Column>
  </TableHeader>
  <TableBody>
    {paginatedData?.map(item => (
      <Row key={item.name}>
        <CellProfile
          name={item.name}
          src={item.image}
          href={item.website}
        />
        <CellText title={item.genre} />
        <CellText title={item.yearFormed.toString()} />
        <CellText title={item.albums.toString()} />
      </Row>
    ))}
  </TableBody>
</Table>
<TablePagination {...paginationProps} />`;

export const tableSelectionActionsSnippet = `import { Table, TableHeader, TableBody, Column, Row, CellText } from '@backstage/ui';

function MyTable() {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  return (
    <Table
      selectionMode="multiple"
      selectionBehavior="toggle"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      onRowAction={(key) => console.log('Opening', key)}
    >
      <TableHeader>
        <Column isRowHeader>Name</Column>
        <Column>Status</Column>
      </TableHeader>
      <TableBody>
        <Row id="1">
          <CellText title="Component A" />
          <CellText title="Active" />
        </Row>
        <Row id="2">
          <CellText title="Component B" />
          <CellText title="Inactive" />
        </Row>
      </TableBody>
    </Table>
  );
}`;

export const tableSelectionModeSnippet = `<Table
  selectionMode="multiple" // or "single"
  selectionBehavior="toggle"
  selectedKeys={selectedKeys}
  onSelectionChange={setSelectedKeys}
>
  {/* ... */}
</Table>`;

export const tableSelectionBehaviorSnippet = `<Table
  selectionMode="multiple"
  selectionBehavior="toggle" // or "replace"
  selectedKeys={selectedKeys}
  onSelectionChange={setSelectedKeys}
>
  {/* ... */}
</Table>`;
