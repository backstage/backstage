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
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import { memo } from 'react';

interface Props {
  selected: boolean;
  value: string;
  availableOptions?: Record<string, number>;
  showCounts: boolean;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function OptionCheckbox({ selected }: { selected: boolean }) {
  return <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />;
}

export const EntityAutocompletePickerOption = memo((props: Props) => {
  const { selected, value, availableOptions, showCounts } = props;
  const label = showCounts ? `${value} (${availableOptions?.[value]})` : value;

  return (
    <FormControlLabel
      control={<OptionCheckbox selected={selected} />}
      label={label}
      onClick={event => event.preventDefault()}
    />
  );
});
