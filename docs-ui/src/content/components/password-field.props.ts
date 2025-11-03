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

export const passwordFieldUsageSnippet = `import { PasswordField } from '@backstage/ui';

<PasswordField />`;

export const passwordFieldDefaultSnippet = `<PasswordField label="Label" placeholder="Enter a secret" />`;

export const passwordFieldSizesSnippet = `<Flex direction="row" gap="4">
  <PasswordField size="small" placeholder="Small" icon={<Icon name="sparkling" />} />
  <PasswordField size="medium" placeholder="Medium" icon={<Icon name="sparkling" />} />
</Flex>`;

export const passwordFieldDescriptionSnippet = `<PasswordField label="Label" description="Description" placeholder="Enter a secret" />`;
