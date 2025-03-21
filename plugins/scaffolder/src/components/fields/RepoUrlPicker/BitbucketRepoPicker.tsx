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
import { Select, SelectItem } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useCallback, useEffect, useState } from 'react';
import useDebounce from 'react-use/esm/useDebounce';
import { scaffolderTranslationRef } from '../../../translation';
import { BaseRepoUrlPickerProps } from './types';

/**
 * The underlying component that is rendered in the form for the `BitbucketRepoPicker`
 * field extension.
 *
 * @public
 * @param allowedOwners - Allowed workspaces for the Bitbucket cloud repository
 * @param allowedProjects - Allowed projects for the Bitbucket cloud repository
 *
 */
export const BitbucketRepoPicker = (
  props: BaseRepoUrlPickerProps<{
    allowedOwners?: string[];
    allowedProjects?: string[];
    accessToken?: string;
  }>,
) => {
  const {
    allowedOwners = [],
    allowedProjects = [],
    onChange,
    rawErrors,
    state,
    accessToken,
    isDisabled,
  } = props;
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const { host, workspace, project } = state;
  const ownerItems: SelectItem[] = allowedOwners
    ? allowedOwners?.map(i => ({ label: i, value: i }))
    : [];
  const projectItems: SelectItem[] = allowedProjects
    ? allowedProjects?.map(i => ({ label: i, value: i }))
    : [];

  useEffect(() => {
    if (host === 'bitbucket.org' && allowedOwners.length) {
      onChange({ workspace: allowedOwners[0] });
    }
  }, [allowedOwners, host, onChange]);

  const scaffolderApi = useApi(scaffolderApiRef);

  const [availableWorkspaces, setAvailableWorkspaces] = useState<string[]>([]);
  const [availableProjects, setAvailableProjects] = useState<string[]>([]);

  // Update available workspaces when client is available
  const updateAvailableWorkspaces = useCallback(() => {
    if (
      !scaffolderApi.autocomplete ||
      !accessToken ||
      host !== 'bitbucket.org'
    ) {
      setAvailableWorkspaces([]);
      return;
    }

    scaffolderApi
      .autocomplete({
        token: accessToken,
        resource: 'workspaces',
        provider: 'bitbucket-cloud',
      })
      .then(({ results }) => {
        setAvailableWorkspaces(results.map(r => r.id));
      })
      .catch(() => {
        setAvailableWorkspaces([]);
      });
  }, [scaffolderApi, accessToken, host]);

  useDebounce(updateAvailableWorkspaces, 500, [updateAvailableWorkspaces]);

  // Update available projects when client is available and workspace changes
  const updateAvailableProjects = useCallback(() => {
    if (
      !scaffolderApi.autocomplete ||
      !accessToken ||
      host !== 'bitbucket.org' ||
      !workspace
    ) {
      setAvailableProjects([]);
      return;
    }

    scaffolderApi
      .autocomplete({
        token: accessToken,
        resource: 'projects',
        context: { workspace },
        provider: 'bitbucket-cloud',
      })
      .then(({ results }) => {
        setAvailableProjects(results.map(r => r.id));
      })
      .catch(() => {
        setAvailableProjects([]);
      });
  }, [scaffolderApi, accessToken, host, workspace]);

  useDebounce(updateAvailableProjects, 500, [updateAvailableProjects]);

  // Update available repositories when client is available and workspace or project changes
  const updateAvailableRepositories = useCallback(() => {
    if (
      !scaffolderApi.autocomplete ||
      !accessToken ||
      host !== 'bitbucket.org' ||
      !workspace ||
      !project
    ) {
      onChange({ availableRepos: [] });
      return;
    }

    scaffolderApi
      .autocomplete({
        token: accessToken,
        resource: 'repositories',
        context: { workspace, project },
        provider: 'bitbucket-cloud',
      })
      .then(({ results }) => {
        onChange({
          availableRepos: results.map(r => {
            return { name: r.id };
          }),
        });
      })
      .catch(() => {
        onChange({ availableRepos: [] });
      });
  }, [scaffolderApi, accessToken, host, workspace, project, onChange]);

  useDebounce(updateAvailableRepositories, 500, [updateAvailableRepositories]);

  return (
    <>
      {host === 'bitbucket.org' && (
        <FormControl
          margin="normal"
          required
          error={rawErrors?.length > 0 && !workspace}
        >
          {allowedOwners?.length ? (
            <Select
              native
              label={t('fields.bitbucketRepoPicker.workspaces.title')}
              onChange={s =>
                onChange({ workspace: String(Array.isArray(s) ? s[0] : s) })
              }
              disabled={isDisabled || allowedOwners.length === 1}
              selected={workspace}
              items={ownerItems}
            />
          ) : (
            <Autocomplete
              value={workspace}
              onChange={(_, newValue) => {
                onChange({ workspace: newValue || '' });
              }}
              options={availableWorkspaces}
              renderInput={params => (
                <TextField
                  {...params}
                  label={t('fields.bitbucketRepoPicker.workspaces.inputTitle')}
                  disabled={isDisabled}
                  required
                />
              )}
              disabled={isDisabled}
              freeSolo
              autoSelect
            />
          )}
          <FormHelperText>
            {t('fields.bitbucketRepoPicker.workspaces.description')}
          </FormHelperText>
        </FormControl>
      )}
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !project}
      >
        {allowedProjects?.length ? (
          <Select
            native
            label={t('fields.bitbucketRepoPicker.project.title')}
            onChange={s =>
              onChange({ project: String(Array.isArray(s) ? s[0] : s) })
            }
            disabled={isDisabled || allowedProjects.length === 1}
            selected={project}
            items={projectItems}
          />
        ) : (
          <Autocomplete
            value={project}
            onChange={(_, newValue) => {
              onChange({ project: newValue || '' });
            }}
            options={availableProjects}
            disabled={isDisabled}
            renderInput={params => (
              <TextField
                {...params}
                label={t('fields.bitbucketRepoPicker.project.inputTitle')}
                disabled={isDisabled}
                required
              />
            )}
            freeSolo
            autoSelect
          />
        )}
        <FormHelperText>
          {t('fields.bitbucketRepoPicker.project.description')}
        </FormHelperText>
      </FormControl>
    </>
  );
};
