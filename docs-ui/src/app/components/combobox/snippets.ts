export const comboboxUsageSnippet = `import { Combobox } from '@backstage/ui';

<Combobox
    name="font"
    label="Font Family"
    options={[
      { value: 'sans', label: 'Sans-serif' },
      { value: 'serif', label: 'Serif' },
      { value: 'mono', label: 'Monospace' },
      { value: 'cursive', label: 'Cursive' },
    ]}
/>`;

export const comboboxDefaultSnippet = `<Combobox
  name="font"
  label="Font Family"
  placeholder="Pick a font"
  options={[
    { value: 'sans', label: 'Sans-serif' },
    { value: 'serif', label: 'Serif' },
    { value: 'mono', label: 'Monospace' },
    { value: 'cursive', label: 'Cursive' },
  ]}
/>`;

export const comboboxDescriptionSnippet = `<Combobox
  name="font"
  label="Font Family"
  description="Choose a font family for your document"
  options={[ ... ]}
/>`;

export const comboboxIconSnippet = `<Combobox
  name="font"
  label="Font Family"
  icon={<RiCloudLine />}
  options={[ ... ]}
/>`;

export const comboboxSizesSnippet = `<Flex>
  <Combobox
    size="small"
    label="Font family"
    options={[ ... ]}
  />
  <Combobox
    size="medium"
    label="Font family"
    options={[ ... ]}
  />
</Flex>`;

export const comboboxDisabledSnippet = `<Combobox
  isDisabled
  label="Font family"
  options={[ ... ]}
/>`;

export const comboboxResponsiveSnippet = `<Combobox
  size={{ initial: 'small', lg: 'medium' }}
  label="Font family"
  options={[ ... ]}
/>`;

export const comboboxDisabledOptionsSnippet = `<Combobox
  name="font"
  label="Font Family"
  placeholder="Pick a font"
  disabledKeys={['cursive', 'serif']}
  options={[
    { value: 'sans', label: 'Sans-serif' },
    { value: 'serif', label: 'Serif' },
    { value: 'mono', label: 'Monospace' },
    { value: 'cursive', label: 'Cursive' },
  ]}
/>`;

export const comboboxCustomValueSnippet = `<Combobox
  name="country"
  label="Country"
  allowsCustomValue
  placeholder="Type any country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'fr', label: 'France' },
    { value: 'de', label: 'Germany' },
    // ... more options
  ]}
/>`;

export const comboboxServerSideSnippet = `import { Combobox } from '@backstage/ui';
import { useAsyncList } from 'react-aria-components';

function ServerSideCombobox() {
  const list = useAsyncList({
    async load({ filterText, signal }) {
      const res = await fetch(\`/api/items?q=\${filterText}\`, { signal });
      const items = await res.json();
      return { items };
    },
  });

  return (
    <Combobox
      label="Country"
      name="country"
      placeholder="Search countries..."
      inputValue={list.filterText}
      onInputChange={list.setFilterText}
      options={list.items}
      isLoading={list.isLoading}
    />
  );
}`;

export const comboboxSectionsSnippet = `<Combobox
  name="font"
  label="Font Family"
  options={[
    {
      title: 'Serif Fonts',
      options: [
        { value: 'times', label: 'Times New Roman' },
        { value: 'georgia', label: 'Georgia' },
        { value: 'garamond', label: 'Garamond' },
      ],
    },
    {
      title: 'Sans-Serif Fonts',
      options: [
        { value: 'arial', label: 'Arial' },
        { value: 'helvetica', label: 'Helvetica' },
        { value: 'verdana', label: 'Verdana' },
      ],
    },
  ]}
/>`;
