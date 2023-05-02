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

import { Select, SelectItem } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import React, { useEffect, useState } from 'react';
import { RepoUrlPickerState } from '../types';
import { proxyAzurePluginApiRef } from './plugin';

export const LOADING = 'Loading ...';

export const AzureRepoPickerDynamic = (props: {
  rawErrors: string[];
  state: RepoUrlPickerState;
  onChange: (state: RepoUrlPickerState) => void;
}) => {
  const { rawErrors, state, onChange } = props;

  const { organization, owner } = state;

  const azureApi = useApi(proxyAzurePluginApiRef);

  const [fetchedOrganizations, setFetchedOrganizations] = useState<string[]>([
    LOADING,
  ]);
  const [fetchedOwners, setFetchedOwners] = useState<string[]>([LOADING]);

  useEffect(() => {
    if (fetchedOrganizations[0] === LOADING) {
      azureApi.allowedOrganizations().then(orgs => {
        if (orgs && orgs.length > 0) {
          setFetchedOrganizations([...orgs.map(o => o.name)]);
          if (!organization) onChange({ organization: orgs[0].name });
        }
      });
    }
  }, [
    azureApi,
    fetchedOrganizations,
    setFetchedOrganizations,
    organization,
    onChange,
  ]);

  useEffect(() => {
    if (organization && fetchedOwners[0] === LOADING) {
      azureApi.allowedProjects(organization).then(projs => {
        if (projs && projs.length > 0) {
          setFetchedOwners([...projs.map(o => o.projectName)]);
          if (!owner) onChange({ owner: projs[0].projectName });
        }
      });
    }
  }, [
    azureApi,
    fetchedOwners,
    setFetchedOwners,
    owner,
    organization,
    onChange,
  ]);

  const organizationItems: SelectItem[] = fetchedOrganizations.map(i => ({
    label: i,
    value: i,
  }));
  const ownerItems: SelectItem[] = fetchedOwners.map(i => ({
    label: i,
    value: i,
  }));

  return (
    <>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !organization}
      >
        <Select
          native
          label="Organization"
          onChange={s =>
            onChange({ organization: String(Array.isArray(s) ? s[0] : s) })
          }
          disabled={organizationItems.length === 1}
          selected={organization}
          items={organizationItems}
        />
        <FormHelperText key="orgHelper">
          The Organization that this repo will belong to
        </FormHelperText>
      </FormControl>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !owner}
      >
        <Select
          native
          label="Owner"
          onChange={s =>
            onChange({ owner: String(Array.isArray(s) ? s[0] : s) })
          }
          disabled={ownerItems.length === 1}
          selected={owner}
          items={ownerItems}
        />
        <FormHelperText>
          The Project that this repo will belong to
        </FormHelperText>
      </FormControl>
    </>
  );
};
