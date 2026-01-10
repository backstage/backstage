import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const toggleButtonPropDefs: Record<string, PropDef> = {
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
  children: {
    type: 'enum',
    values: ['ReactNode', '(values: ToggleButtonRenderProps) => ReactNode'],
    description:
      'The children of the component. A function may be provided to alter the children based on component state (such as `isSelected`, `isDisabled`, `isHovered`, etc.).',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const toggleButtonUsageSnippet = `import { ToggleButton } from '@backstage/ui';

<ToggleButton>Toggle</ToggleButton>`;

export const toggleButtonSurfacesSnippet = `<Flex direction="column" gap="4">
  <Flex direction="column" gap="4">
    <Text>Default</Text>
    <Flex align="center" p="4">
      <ToggleButton>Toggle</ToggleButton>
    </Flex>
  </Flex>
  <Flex direction="column" gap="4">
    <Text>On Surface 0</Text>
    <Flex align="center" surface="0" p="4">
      <ToggleButton>Toggle</ToggleButton>
    </Flex>
  </Flex>
  <Flex direction="column" gap="4">
    <Text>On Surface 1</Text>
    <Flex align="center" surface="1" p="4">
      <ToggleButton>Toggle</ToggleButton>
    </Flex>
  </Flex>
  <Flex direction="column" gap="4">
    <Text>On Surface 2</Text>
    <Flex align="center" surface="2" p="4">
      <ToggleButton>Toggle</ToggleButton>
    </Flex>
  </Flex>
  <Flex direction="column" gap="4">
    <Text>On Surface 3</Text>
    <Flex align="center" surface="3" p="4">
      <ToggleButton>Toggle</ToggleButton>
    </Flex>
  </Flex>
</Flex>`;

export const toggleButtonSizesSnippet = `<Flex align="center">
  <ToggleButton size="small">Small</ToggleButton>
  <ToggleButton size="medium">Medium</ToggleButton>
</Flex>`;

export const toggleButtonIconsSnippet = `import { RiStarLine, RiStarFill, RiCheckLine } from '@remixicon/react';

<Flex align="center">
  <ToggleButton iconStart={<RiStarLine />}>Favorite</ToggleButton>
  <ToggleButton iconStart={<RiStarFill />} defaultSelected>Starred</ToggleButton>
  <ToggleButton iconEnd={<RiCheckLine />}>Confirm</ToggleButton>
</Flex>`;

export const toggleButtonDisabledSnippet = `<Flex align="center">
  <ToggleButton isDisabled>Disabled</ToggleButton>
  <ToggleButton defaultSelected isDisabled>Selected</ToggleButton>
</Flex>`;

export const toggleButtonControlledSnippet = `import { useState } from 'react';
import { RiStarFill, RiStarLine } from '@remixicon/react';

const [selected, setSelected] = useState(false);

<ToggleButton
  isSelected={selected}
  onChange={setSelected}
  iconStart={selected ? <RiStarFill /> : <RiStarLine />}
>
  {selected ? 'Starred' : 'Not starred'}
</ToggleButton>`;

export const toggleButtonFunctionChildrenSnippet = `import { RiStarFill, RiStarLine } from '@remixicon/react';
<Flex direction="column" gap="4">
  <Flex direction="column" gap="2">
    <Text weight="bold">Example 1: Selection State</Text>
    <Flex align="center" gap="2">
      <ToggleButton defaultSelected>
        {({ isSelected }) => (isSelected ? '✓ Selected' : 'Not Selected')}
      </ToggleButton>
      <ToggleButton>
        {({ isSelected }) => (isSelected ? '✓ Selected' : 'Not Selected')}
      </ToggleButton>
    </Flex>
  </Flex>

  <Flex direction="column" gap="2">
    <Text weight="bold">Example 2: Multiple States</Text>
    <Flex align="center" gap="2">
      <ToggleButton defaultSelected>
        {({ isSelected, isHovered }) => {
          const states = [];
          if (isSelected) states.push('on');
          else states.push('off');
          if (isHovered) states.push('hovered');
          return \`Email (\${states.join(', ')})\`;
        }}
      </ToggleButton>
      <ToggleButton>
        {({ isSelected, isHovered }) => {
          const states = [];
          if (isSelected) states.push('on');
          else states.push('off');
          if (isHovered) states.push('hovered');
          return \`Push (\${states.join(', ')})\`;
        }}
      </ToggleButton>
    </Flex>
  </Flex>

  <Flex direction="column" gap="2">
    <Text weight="bold">Example 3: Conditional Icons</Text>
    <Flex align="center" gap="2">
      <ToggleButton>
        {({ isSelected }) => (
          <>
            {isSelected ? <RiStarFill /> : <RiStarLine />}
            <span>{isSelected ? 'Starred' : 'Star'}</span>
          </>
        )}
      </ToggleButton>
    </Flex>
  </Flex>

  <Flex direction="column" gap="2">
    <Text weight="bold">Example 4: Status Indicators</Text>
    <Flex align="center" gap="2">
      <ToggleButton defaultSelected>
        {({ isSelected }) => (
          <Flex align="center" gap="2">
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: isSelected
                  ? 'var(--bui-fg-success)'
                  : 'var(--bui-fg-secondary)',
              }}
            />
            <span>Active</span>
          </Flex>
        )}
      </ToggleButton>
      <ToggleButton>
        {({ isSelected }) => (
          <Flex align="center" gap="2">
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: isSelected
                  ? 'var(--bui-fg-danger)'
                  : 'var(--bui-fg-secondary)',
              }}
            />
            <span>Inactive</span>
          </Flex>
        )}
      </ToggleButton>
    </Flex>
  </Flex>
</Flex>`;
