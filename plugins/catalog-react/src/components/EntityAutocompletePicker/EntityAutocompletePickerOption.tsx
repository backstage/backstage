/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Checkbox, cn } from '@backstage/core-components';
import { memo } from 'react';

interface Props {
  selected: boolean;
  value: string;
  availableOptions?: Record<string, number>;
  showCounts: boolean;
}

function OptionCheckbox({ selected }: { selected: boolean }) {
  return <Checkbox checked={selected} className="h-4 w-4" />;
}

export const EntityAutocompletePickerOption = memo((props: Props) => {
  const { selected, value, availableOptions, showCounts } = props;
  const labelText = showCounts
    ? `${value} (${availableOptions?.[value]})`
    : value;

  return (
    // Keyboard interaction is handled by the parent Autocomplete listbox;
    // the onClick here only calls preventDefault() to avoid redundant toggling.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <label
      className={cn('flex items-center gap-2 cursor-pointer text-sm')}
      onClick={event => event.preventDefault()}
    >
      <OptionCheckbox selected={selected} />
      {/* eslint-disable-next-line react/forbid-elements -- migrated from MUI Typography to Tailwind text */}
      <span>{labelText}</span>
    </label>
  );
});
