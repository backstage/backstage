export const usage = `import { ListBox, ListBoxItem } from '@backstage/ui';

<ListBox aria-label="Programming languages">
  <ListBoxItem id="react">React</ListBoxItem>
  <ListBoxItem id="typescript">TypeScript</ListBoxItem>
  <ListBoxItem id="javascript">JavaScript</ListBoxItem>
</ListBox>`;

export const preview = `<ListBox aria-label="Programming languages">
  <ListBoxItem id="react">React</ListBoxItem>
  <ListBoxItem id="typescript">TypeScript</ListBoxItem>
  <ListBoxItem id="javascript">JavaScript</ListBoxItem>
  <ListBoxItem id="rust">Rust</ListBoxItem>
  <ListBoxItem id="go">Go</ListBoxItem>
</ListBox>`;

export const withIcons = `<ListBox aria-label="Programming languages">
  <ListBoxItem id="react" icon={<RiReactjsLine />}>React</ListBoxItem>
  <ListBoxItem id="typescript" icon={<RiCodeLine />}>TypeScript</ListBoxItem>
  <ListBoxItem id="javascript" icon={<RiJavascriptLine />}>JavaScript</ListBoxItem>
</ListBox>`;

export const withDescription = `<ListBox aria-label="Programming languages">
  <ListBoxItem
    id="react"
    icon={<RiReactjsLine />}
    description="A JavaScript library for building user interfaces"
  >
    React
  </ListBoxItem>
  <ListBoxItem
    id="typescript"
    icon={<RiCodeLine />}
    description="Typed superset of JavaScript"
  >
    TypeScript
  </ListBoxItem>
</ListBox>`;

export const selectionModeSingle = `const [selected, setSelected] = useState(new Set(['react']));

<ListBox
  aria-label="Programming languages"
  selectionMode="single"
  selectedKeys={selected}
  onSelectionChange={setSelected}
>
  <ListBoxItem id="react">React</ListBoxItem>
  <ListBoxItem id="typescript">TypeScript</ListBoxItem>
  <ListBoxItem id="javascript">JavaScript</ListBoxItem>
</ListBox>`;

export const selectionModeMultiple = `const [selected, setSelected] = useState(new Set(['react', 'typescript']));

<ListBox
  aria-label="Programming languages"
  selectionMode="multiple"
  selectedKeys={selected}
  onSelectionChange={setSelected}
>
  <ListBoxItem id="react">React</ListBoxItem>
  <ListBoxItem id="typescript">TypeScript</ListBoxItem>
  <ListBoxItem id="javascript">JavaScript</ListBoxItem>
</ListBox>`;

export const disabled = `<ListBox
  aria-label="Programming languages"
  disabledKeys={['typescript', 'rust']}
>
  <ListBoxItem id="react">React</ListBoxItem>
  <ListBoxItem id="typescript">TypeScript</ListBoxItem>
  <ListBoxItem id="javascript">JavaScript</ListBoxItem>
  <ListBoxItem id="rust">Rust</ListBoxItem>
  <ListBoxItem id="go">Go</ListBoxItem>
</ListBox>`;
