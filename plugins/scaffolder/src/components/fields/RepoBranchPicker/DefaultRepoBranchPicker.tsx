/*
 * Copyright 2024 The Backstage Authors
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

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MuiTextField from '@material-ui/core/TextField';

import { BaseRepoBranchPickerProps } from './types';
import { useScaffolderTheme } from '@backstage/plugin-scaffolder-react/alpha';
import { TextField as BuiTextField } from '@backstage/ui';

/**
 * The underlying component that is rendered in the form for the `DefaultRepoBranchPicker`
 * field extension.
 *
 * @public
 *
 */
export const DefaultRepoBranchPicker = ({
  onChange,
  state,
  rawErrors,
  isDisabled,
  required,
}: BaseRepoBranchPickerProps) => {
  const theme = useScaffolderTheme();
  const { branch } = state;

  if (theme === 'bui') {
    return (
      <BuiTextField
        label="Branch"
        description="The branch of the repository"
        isDisabled={isDisabled}
        onChange={value => onChange({ branch: value })}
        value={branch ?? ''}
        isInvalid={rawErrors?.length > 0 && !branch}
        isRequired={required}
      />
    );
  }

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !branch}
    >
      <MuiTextField
        id="branchInput"
        label="Branch"
        disabled={isDisabled}
        onChange={e => onChange({ branch: e.target.value })}
        value={branch}
      />
      <FormHelperText>The branch of the repository</FormHelperText>
    </FormControl>
  );
};
