import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const toggleButtonPropDefs: Record<string, PropDef> = {
  variant: {
    type: 'enum',
    values: ['primary', 'secondary'],
    default: 'primary',
    responsive: true,
  },
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'small',
    responsive: true,
  },
  onSurface: {
    type: 'enum',
    values: ['0', '1', '2', '3', 'danger', 'warning', 'success', 'auto'],
    description: 'Surface level this toggle is placed on',
    responsive: true,
  },
  iconStart: { type: 'enum', values: ['ReactNode'] },
  iconEnd: { type: 'enum', values: ['ReactNode'] },
  isSelected: { type: 'boolean' },
  defaultSelected: { type: 'boolean' },
  onChange: { type: 'enum', values: ['(isSelected: boolean) => void'] },
  isDisabled: { type: 'boolean', default: 'false' },
  children: { type: 'enum', values: ['ReactNode'] },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const toggleButtonUsageSnippet = `import { ToggleButton } from '@backstage/ui';

<ToggleButton>Toggle</ToggleButton>`;

export const toggleButtonVariantsSnippet = `<Flex direction="column" gap="4">
  <Flex direction="column" gap="4">
    <Text>Default</Text>
    <Flex align="center" p="4">
      <ToggleButton variant="primary">Primary</ToggleButton>
      <ToggleButton variant="secondary">Secondary</ToggleButton>
    </Flex>
  </Flex>
  <Flex direction="column" gap="4">
    <Text>On Surface 0</Text>
    <Flex align="center" surface="0" p="4">
      <ToggleButton variant="primary">Primary</ToggleButton>
      <ToggleButton variant="secondary">Secondary</ToggleButton>
    </Flex>
  </Flex>
  <Flex direction="column" gap="4">
    <Text>On Surface 1</Text>
    <Flex align="center" surface="1" p="4">
      <ToggleButton variant="primary">Primary</ToggleButton>
      <ToggleButton variant="secondary">Secondary</ToggleButton>
    </Flex>
  </Flex>
  <Flex direction="column" gap="4">
    <Text>On Surface 2</Text>
    <Flex align="center" surface="2" p="4">
      <ToggleButton variant="primary">Primary</ToggleButton>
      <ToggleButton variant="secondary">Secondary</ToggleButton>
    </Flex>
  </Flex>
  <Flex direction="column" gap="4">
    <Text>On Surface 3</Text>
    <Flex align="center" surface="3" p="4">
      <ToggleButton variant="primary">Primary</ToggleButton>
      <ToggleButton variant="secondary">Secondary</ToggleButton>
    </Flex>
  </Flex>
</Flex>`;

export const toggleButtonSizesSnippet = `<Flex align="center">
  <ToggleButton size="small">Small</ToggleButton>
  <ToggleButton size="medium">Medium</ToggleButton>
</Flex>`;

export const toggleButtonIconsSnippet = `<Flex align="center">
  <ToggleButton iconStart="star">Favorite</ToggleButton>
  <ToggleButton iconEnd="check">Confirm</ToggleButton>
</Flex>`;

export const toggleButtonDisabledSnippet = `<Flex align="center">
  <ToggleButton isDisabled>Disabled</ToggleButton>
  <ToggleButton defaultSelected isDisabled>Selected</ToggleButton>
</Flex>`;

export const toggleButtonControlledSnippet = `const [selected, setSelected] = useState(false);

<ToggleButton isSelected={selected} onChange={setSelected}>
  {selected ? 'On' : 'Off'}
</ToggleButton>`;
