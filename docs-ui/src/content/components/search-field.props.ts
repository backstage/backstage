import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const searchFieldPropDefs: Record<string, PropDef> = {
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'small',
    responsive: true,
  },
  label: {
    type: 'string',
  },
  icon: {
    type: 'enum',
    values: ['ReactNode'],
  },
  description: {
    type: 'string',
  },
  name: {
    type: 'string',
    required: true,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const searchFieldUsageSnippet = `import { SearchField } from '@backstage/ui';

<SearchField />`;

export const searchFieldDefaultSnippet = `<SearchField label="Label" placeholder="Enter a URL" />`;

export const searchFieldSizesSnippet = `<Flex direction="row" gap="4">
  <SearchField size="small" placeholder="Small" icon={<Icon name="sparkling" />} />
  <SearchField size="medium" placeholder="Medium" icon={<Icon name="sparkling" />} />
</Flex>`;

export const searchFieldDescriptionSnippet = `<SearchField label="Label" description="Description" placeholder="Enter a URL" />`;
