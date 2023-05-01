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
import { RepoUrlPickerState } from '../types';
import { AzureRepoPickerDynamic } from './AzureRepoPickerDynamic';
import { AzureRepoPickerStatic } from './AzureRepoPickerStatic';

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

  if (allowedOrganizations.length || allowedOwners.length) {
    return (
      <AzureRepoPickerStatic
        allowedOrganizations={allowedOrganizations}
        allowedOwners={allowedOwners}
        rawErrors={rawErrors}
        state={state}
        onChange={onChange}
      />
    );
  }

  return (
    <AzureRepoPickerDynamic
      rawErrors={rawErrors}
      state={state}
      onChange={onChange}
    />
  );
};
