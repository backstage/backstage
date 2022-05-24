/*
 * Copyright 2021 The Backstage Authors
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
import useDebounce from 'react-use/lib/useDebounce';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { Select, SelectItem } from '@backstage/core-components';
import { RepoUrlPickerState } from './types';
import { useApi } from "@backstage/core-plugin-api";
import { scaffolderApiRef } from "../../../api";
import useAsync from "react-use/lib/useAsync";
import {
  scmIntegrationsApiRef,
  scmAuthApiRef,
} from '@backstage/integration-react';

import { Octokit } from '@octokit/rest';

const useUserGithubReposList = (state: object, pullReposFromBackend: boolean) => {
  const scmAuthApi = useApi(scmAuthApiRef);
  const scaffolderApi = useApi(scaffolderApiRef);

  const {value, loading} = useAsync(
    async () => {
      if (pullReposFromBackend) {
        const { results } = await scaffolderApi.getGithubRepositories(state.owner) || [];

        return results;
      } else {
        const { token } = await scmAuthApi.getCredentials({
          url: `https://${state.host}`,
          additionalScope: {
            repoWrite: true,
          },
        });

        const octokit = new Octokit({auth: token});
        const octoRes = await octokit.rest.repos.listForAuthenticatedUser();
        // const octoResOrgs = await octokit.rest.orgs.listForAuthenticatedUser();
        // console.log('useUserOrgList/useAsync/octoRes', octoRes.data);
        // const octoResOrgs = await octokit.rest.orgs.list();
        // console.log('useUserOrgList/useAsync/octoResOrgs', octoResOrgs);
        octoRes.map((repoItem) => {
          return {
            label: repoItem.full_name,
            value: repoItem.name,
          }
        })

        return octoRes?.data || []
      }
    },
    [state, pullReposFromBackend]
  )

  return {value, loading}
}

export const GithubRepoPicker = (props: {
  allowedOwners?: string[];
  repoSelectOptions?: object[];
  rawErrors: string[];
  state: RepoUrlPickerState;
  onChange: (state: RepoUrlPickerState) => void;
}) => {
  const { allowedOwners = [], rawErrors, state, onChange, repoSelectOptions } = props;
  const {showGithubRepoDropdown, pullReposFromBackend} =  repoSelectOptions;

  const ownerItems: SelectItem[] = allowedOwners
    ? allowedOwners.map(i => ({ label: i, value: i }))
    : [{ label: 'Loading...', value: 'loading' }];

  const {value, loading} = showGithubRepoDropdown ? useUserGithubReposList(state, pullReposFromBackend) : {};
  const reposItems: SelectItem[] = value || [{ label: 'Loading...', value: 'loading' }];

  const { owner, repoName } = state;

  return (
    <>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !owner}
      >
        {allowedOwners?.length ? (
          <Select
            native
            label="Owner Available"
            onChange={s =>
              onChange({ owner: String(Array.isArray(s) ? s[0] : s) })
            }
            disabled={allowedOwners.length === 1}
            selected={owner}
            items={ownerItems}
          />
        ) : (
          <>
            <InputLabel htmlFor="ownerInput">Owner</InputLabel>
            <Input
              id="ownerInput"
              onChange={e => onChange({ owner: e.target.value })}
              value={owner}
            />
          </>
        )}
        <FormHelperText>
          The organization, user or project that this repo will belong to
        </FormHelperText>
      </FormControl>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !repoName}
      >
        <InputLabel htmlFor="repoNameInput">Repository</InputLabel>
        {showGithubRepoDropdown ?
          <>
            <Select
              native
              label="Repos Available"
              onChange={s =>
                onChange({ repoName: String(Array.isArray(s) ? s[0] : s) })
              }
              disabled={reposItems.length === 1}
              selected={repoName}
              items={reposItems}
            />
          </>
          :
          <Input
            id="repoNameInput"
            onChange={e => onChange({ repoName: e.target.value })}
            value={repoName}
          />
        }

        <FormHelperText>The name of the repository</FormHelperText>
      </FormControl>
    </>
  );
};
