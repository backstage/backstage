import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const radioGroupPropDefs: Record<string, PropDef> = {
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

export const radioGroupUsageSnippet = `import { RadioGroup } from '@backstage/ui';

<RadioGroup />`;

export const radioGroupDefaultSnippet = `<RadioGroup label="Label" />`;

export const radioGroupDescriptionSnippet = `<TextField label="Label" description="Description" placeholder="Enter a URL" />`;

export const radioGroupHorizontalSnippet = `<RadioGroup label="Label" orientation="horizontal" />`;

export const radioGroupDisabledSnippet = `<RadioGroup label="Label" isDisabled>
  <Radio value="bulbasaur">Bulbasaur</Radio>
  <Radio value="charmander">Charmander</Radio>
  <Radio value="squirtle">Squirtle</Radio>
</RadioGroup>`;

export const radioGroupDisabledSingleSnippet = `<RadioGroup label="Label">
  <Radio value="bulbasaur">Bulbasaur</Radio>
  <Radio value="charmander" isDisabled>Charmander</Radio>
  <Radio value="squirtle">Squirtle</Radio>
</RadioGroup>`;

export const radioGroupValidationSnippet = `<RadioGroup validate: value => (value === \'charmander\' ? \'Nice try!\' : null)>
  <Radio value="bulbasaur">Bulbasaur</Radio>
  <Radio value="charmander">Charmander</Radio>
  <Radio value="squirtle">Squirtle</Radio>
</RadioGroup>`;

export const radioGroupReadOnlySnippet = `<RadioGroup label="Label" isReadOnly>
  <Radio value="bulbasaur">Bulbasaur</Radio>
  <Radio value="charmander">Charmander</Radio>
  <Radio value="squirtle">Squirtle</Radio>
</RadioGroup>`;
