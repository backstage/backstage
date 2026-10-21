export const checkboxUsageSnippet = `import { Checkbox } from '@backstage/ui';

<Checkbox>Accept terms</Checkbox>`;

export const defaultSnippet = `<Checkbox>Accept terms and conditions</Checkbox>`;

export const allVariantsSnippet = `<Flex direction="column" gap="2">
  <Checkbox>Unchecked</Checkbox>
  <Checkbox isSelected>Checked</Checkbox>
  <Checkbox isIndeterminate>Indeterminate</Checkbox>
  <Checkbox isDisabled>Disabled</Checkbox>
  <Checkbox isSelected isDisabled>
    Checked & Disabled
  </Checkbox>
  <Checkbox isIndeterminate isDisabled>
    Indeterminate & Disabled
  </Checkbox>
  <Checkbox isInvalid>Invalid</Checkbox>
  <Checkbox isInvalid isSelected>
    Invalid & Checked
  </Checkbox>
  <Checkbox isInvalid isIndeterminate>
    Invalid & Indeterminate
  </Checkbox>
</Flex>`;

export const indeterminateSnippet = `import { useState } from 'react';
import { Checkbox, Flex } from '@backstage/ui';

const options = ['Read', 'Write', 'Delete'];
const [selected, setSelected] = useState<string[]>(['Read']);

const allSelected = selected.length === options.length;
const someSelected = selected.length > 0 && !allSelected;

<Flex direction="column" gap="2">
  <Checkbox
    isSelected={allSelected}
    isIndeterminate={someSelected}
    onChange={isSelected => setSelected(isSelected ? options : [])}
  >
    Select all
  </Checkbox>
  <Flex direction="column" gap="2" pl="6">
    {options.map(option => (
      <Checkbox
        key={option}
        isSelected={selected.includes(option)}
        onChange={isSelected =>
          setSelected(current =>
            isSelected
              ? [...current, option]
              : current.filter(o => o !== option),
          )
        }
      >
        {option}
      </Checkbox>
    ))}
  </Flex>
</Flex>`;
