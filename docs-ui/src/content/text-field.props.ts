import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const inputPropDefs: Record<string, PropDef> = {
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

export const textFieldUsageSnippet = `import { TextField } from '@backstage/ui';

<TextField />`;

export const textFieldDefaultSnippet = `<TextField label="Label" placeholder="Enter a URL" />`;

export const textFieldSizesSnippet = `<Flex direction="row" gap="4">
  <TextField size="small" placeholder="Small" icon={<Icon name="sparkling" />} />
  <TextField size="medium" placeholder="Medium" icon={<Icon name="sparkling" />} />
</Flex>`;

export const textFieldDescriptionSnippet = `<TextField label="Label" description="Description" placeholder="Enter a URL" />`;
