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

import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { RepoUrlPickerState } from './types';
import { SelectItem } from '@backstage/core-components';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

export const AzureRepoPicker = (props: {
  allowedOrganizations?: string[];
  allowedOwners?: string[];
  rawErrors: string[];
  state: RepoUrlPickerState;
  onChange: (state: RepoUrlPickerState) => void;
}) => {
  const {
    allowedOrganizations = [],
    allowedOwners = [],
    rawErrors,
    state,
    onChange,
  } = props;

  const organizationItems: SelectItem[] = allowedOrganizations
    ? allowedOrganizations.map(i => ({ label: i, value: i }))
    : [{ label: 'Loading...', value: 'loading' }];

  const ownerItems: SelectItem[] = allowedOwners
    ? allowedOwners.map(i => ({ label: i, value: i }))
    : [{ label: 'Loading...', value: 'loading' }];

  const { organization, owner } = state;

  return (
    <>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !organization}
      >
        {allowedOrganizations?.length ? (
          <Autocomplete
            aria-label="Choose an Organization"
            options={organizationItems}
            defaultValue={organizationItems[0]}
            getOptionLabel={organizations =>
              organizations.label || 'error getting label'
            }
            disabled={allowedOrganizations.length === 1}
            data-testid="select"
            getOptionSelected={(option, value) => option.label === value.value}
            onChange={(_event, newValue) =>
              onChange({
                organization: newValue?.label,
              })
            }
            renderInput={params => (
              <TextField
                {...params}
                placeholder="Choose an Organization"
                margin="dense"
                FormHelperTextProps={{
                  margin: 'dense',
                  style: { marginLeft: 0 },
                }}
                variant="outlined"
                InputProps={params.InputProps}
              />
            )}
          />
        ) : (
          <>
            <InputLabel htmlFor="orgInput">Organization</InputLabel>
            <Input
              id="orgInput"
              onChange={e => onChange({ organization: e.target.value })}
              value={organization}
            />
          </>
        )}
        <FormHelperText>
          The Organization that this repo will belong to
        </FormHelperText>
      </FormControl>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !owner}
      >
        {allowedOwners?.length ? (
          <Autocomplete
            aria-label="Choose an Owner"
            options={ownerItems}
            defaultValue={ownerItems[0]}
            getOptionLabel={owners => owners.label || 'error getting label'}
            disabled={allowedOwners.length === 1}
            data-testid="select"
            getOptionSelected={(option, value) => option.label === value.value}
            onChange={(_event, newValue) =>
              onChange({
                owner: newValue?.label,
              })
            }
            renderInput={params => (
              <TextField
                {...params}
                placeholder="Choose an Owner"
                margin="dense"
                FormHelperTextProps={{
                  margin: 'dense',
                  style: { marginLeft: 0 },
                }}
                variant="outlined"
                InputProps={params.InputProps}
              />
            )}
          />
        ) : (
          <>
            <InputLabel htmlFor="ownerInput">Project</InputLabel>
            <Input
              id="ownerInput"
              onChange={e => onChange({ owner: e.target.value })}
              value={owner}
            />
          </>
        )}
        <FormHelperText>
          The Project that this repo will belong to
        </FormHelperText>
      </FormControl>
    </>
  );
};
