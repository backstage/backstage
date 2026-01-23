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
