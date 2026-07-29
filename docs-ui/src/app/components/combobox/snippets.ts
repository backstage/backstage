export const comboboxUsageSnippet = `import { Combobox } from '@backstage/ui';

<Combobox
  name="font"
  label="Font Family"
  options={[
    { id: 'sans', label: 'Sans-serif' },
    { id: 'serif', label: 'Serif' },
    { id: 'mono', label: 'Monospace' },
    { id: 'cursive', label: 'Cursive' },
  ]}
/>`;

export const comboboxDefaultSnippet = `<Combobox
  name="font"
  label="Font Family"
  placeholder="Pick a font"
  options={[
    { id: 'sans', label: 'Sans-serif' },
    { id: 'serif', label: 'Serif' },
    { id: 'mono', label: 'Monospace' },
    { id: 'cursive', label: 'Cursive' },
  ]}
/>`;

export const comboboxDescriptionSnippet = `<Combobox
  name="font"
  label="Font Family"
  description="Choose a font family for your document"
  options={[ ... ]}
/>`;

export const comboboxCustomSearchSnippet = `<Combobox
  label="Owner"
  options={ownerOptions}
  search={{
    filter: (option, query) =>
      option.label.toLocaleLowerCase().startsWith(query.toLocaleLowerCase()),
  }}
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
    { id: 'sans', label: 'Sans-serif' },
    { id: 'serif', label: 'Serif' },
    { id: 'mono', label: 'Monospace' },
    { id: 'cursive', label: 'Cursive' },
  ]}
/>`;

export const comboboxCustomValueSnippet = `<Combobox
  name="country"
  label="Country"
  allowsCustomValue
  placeholder="Type any country"
  options={[
    { id: 'us', label: 'United States' },
    { id: 'ca', label: 'Canada' },
    { id: 'uk', label: 'United Kingdom' },
    { id: 'fr', label: 'France' },
    { id: 'de', label: 'Germany' },
    // ... more options
  ]}
/>`;

export const comboboxSectionsSnippet = `<Combobox
  name="font"
  label="Font Family"
  options={[
    {
      title: 'Serif Fonts',
      options: [
        { id: 'times', label: 'Times New Roman' },
        { id: 'georgia', label: 'Georgia' },
        { id: 'garamond', label: 'Garamond' },
      ],
    },
    {
      title: 'Sans-Serif Fonts',
      options: [
        { id: 'arial', label: 'Arial' },
        { id: 'helvetica', label: 'Helvetica' },
        { id: 'verdana', label: 'Verdana' },
      ],
    },
  ]}
/>`;

export const comboboxCustomItemsSnippet = `import { Combobox, ComboboxItemProfile } from '@backstage/ui';

<Combobox label="Owner" items={owners}>
  {owner => (
    <ComboboxItemProfile
      name={owner.name}
      src={owner.avatarUrl}
    />
  )}
</Combobox>`;

export const comboboxAsyncSnippet = `import { useState } from 'react';
import { Combobox, ComboboxItemProfile, useAsyncList } from '@backstage/ui';

type Owner = {
  id: string;
  textValue: string;
  name: string;
  avatarUrl?: string;
};

const owners = useAsyncList<Owner>({
  async load({ signal, filterText, cursor }) {
    return fetchOwners({ signal, query: filterText, cursor });
  },
});
const [owner, setOwner] = useState<Owner | null>(null);

<Combobox
  label="Owner"
  items={owners}
  placeholder="Search or select an owner"
  search={{ mode: 'server' }}
  value={owner}
  onChange={setOwner}
>
  {owner => <ComboboxItemProfile name={owner.name} src={owner.avatarUrl} />}
</Combobox>`;

export const comboboxManualLoadingSnippet = `<Combobox
  label="Owner"
  options={results}
  search={{
    mode: 'server',
    inputValue: query,
    onInputChange: setQuery,
  }}
  loading={{ state: isLoading ? 'filtering' : 'idle', onLoadMore }}
/>`;
