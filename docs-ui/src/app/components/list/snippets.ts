export const usage = `import { List, ListRow } from '@backstage/ui';

<List aria-label="Programming languages" items={items}>
  {item => <ListRow id={item.id}>{item.label}</ListRow>}
</List>`;

export const preview = `<List aria-label="Programming languages" items={items}>
  {item => (
    <ListRow
      id={item.id}
      icon={item.icon}
      menuItems={menuItems}
      customActions={
        <TagGroup aria-label={\`Tags for \${item.label}\`}>
          {item.tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </TagGroup>
      }
    >
      {item.label}
    </ListRow>
  )}
</List>`;

export const withIcons = `<List aria-label="Programming languages" items={items}>
  {item => (
    <ListRow id={item.id} icon={item.icon}>
      {item.label}
    </ListRow>
  )}
</List>`;

export const withDescription = `<List aria-label="Programming languages" items={items}>
  {item => (
    <ListRow id={item.id} icon={item.icon} description={item.description}>
      {item.label}
    </ListRow>
  )}
</List>`;

export const selectionModeSingle = `const [selected, setSelected] = useState(new Set(['react']));

<List
  aria-label="Programming languages"
  items={items}
  selectionMode="single"
  selectedKeys={selected}
  onSelectionChange={setSelected}
>
  {item => <ListRow id={item.id}>{item.label}</ListRow>}
</List>`;

export const selectionModeMultiple = `const [selected, setSelected] = useState(new Set(['react', 'typescript']));

<List
  aria-label="Programming languages"
  items={items}
  selectionMode="multiple"
  selectedKeys={selected}
  onSelectionChange={setSelected}
>
  {item => <ListRow id={item.id}>{item.label}</ListRow>}
</List>`;

export const disabled = `<List
  aria-label="Programming languages"
  items={items}
  disabledKeys={['typescript', 'rust']}
>
  {item => <ListRow id={item.id}>{item.label}</ListRow>}
</List>`;
