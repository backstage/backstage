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
import {
  Select,
  SelectItem,
  Input,
  Label,
  ShadcnButton as Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  cn,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import { ChevronsUpDown, Check } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
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
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);

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
        context: {},
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

  // Determine which workspace field variant to render based on available data.
  // Branch 1: allowedOwners provided → Backstage Select dropdown
  // Branch 2: availableWorkspaces populated via API → Popover + Command combobox
  // Branch 3: fallback → plain text Input
  let workspaceField: JSX.Element;
  if (allowedOwners?.length) {
    workspaceField = (
      <>
        <Select
          native
          label={t('fields.bitbucketRepoPicker.workspaces.title')}
          onChange={s =>
            onChange({
              workspace: String(Array.isArray(s) ? s[0] : s),
            })
          }
          disabled={isDisabled || allowedOwners.length === 1}
          selected={workspace}
          items={ownerItems}
        />
        {/* eslint-disable-next-line react/forbid-elements -- migrating from MUI Typography to native elements with Tailwind */}
        <p className="mt-1 text-sm text-muted-foreground">
          {t('fields.bitbucketRepoPicker.workspaces.description')}
        </p>
      </>
    );
  } else if (availableWorkspaces?.length) {
    workspaceField = (
      <div className="space-y-2">
        <Label>{t('fields.bitbucketRepoPicker.workspaces.inputTitle')}</Label>
        <Popover open={workspaceOpen} onOpenChange={setWorkspaceOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={workspaceOpen}
              disabled={isDisabled}
              className="w-full justify-between font-normal"
            >
              {workspace ||
                t('fields.bitbucketRepoPicker.workspaces.inputTitle')}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput
                placeholder={t(
                  'fields.bitbucketRepoPicker.workspaces.inputTitle',
                )}
                onValueChange={val => {
                  onChange({ workspace: val });
                }}
              />
              <CommandList>
                <CommandEmpty>No workspace found.</CommandEmpty>
                <CommandGroup>
                  {availableWorkspaces.map(ws => (
                    <CommandItem
                      key={ws}
                      value={ws}
                      onSelect={currentValue => {
                        onChange({ workspace: currentValue });
                        setWorkspaceOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          workspace === ws ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {ws}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {/* eslint-disable-next-line react/forbid-elements -- migrating from MUI Typography to native elements with Tailwind */}
        <p className="text-sm text-muted-foreground">
          {t('fields.bitbucketRepoPicker.workspaces.description')}
        </p>
      </div>
    );
  } else {
    workspaceField = (
      <div className="space-y-2">
        <Label htmlFor="workspaceInput">
          {t('fields.bitbucketRepoPicker.workspaces.inputTitle')}
        </Label>
        <Input
          id="workspaceInput"
          onChange={e => onChange({ workspace: e.target.value })}
          disabled={isDisabled}
          value={workspace}
        />
        {/* eslint-disable-next-line react/forbid-elements -- migrating from MUI Typography to native elements with Tailwind */}
        <p className="text-sm text-muted-foreground">
          {t('fields.bitbucketRepoPicker.workspaces.description')}
        </p>
      </div>
    );
  }

  // Determine which project field variant to render based on available data.
  // Branch 1: allowedProjects provided → Backstage Select dropdown
  // Branch 2: availableProjects populated via API → Popover + Command combobox
  // Branch 3: fallback → plain text Input
  let projectField: JSX.Element;
  if (allowedProjects?.length) {
    projectField = (
      <>
        <Select
          native
          label={t('fields.bitbucketRepoPicker.project.title')}
          onChange={s =>
            onChange({
              project: String(Array.isArray(s) ? s[0] : s),
            })
          }
          disabled={isDisabled || allowedProjects.length === 1}
          selected={project}
          items={projectItems}
        />
        {/* eslint-disable-next-line react/forbid-elements -- migrating from MUI Typography to native elements with Tailwind */}
        <p className="mt-1 text-sm text-muted-foreground">
          {t('fields.bitbucketRepoPicker.project.description')}
        </p>
      </>
    );
  } else if (availableProjects?.length) {
    projectField = (
      <div className="space-y-2">
        <Label>{t('fields.bitbucketRepoPicker.project.inputTitle')}</Label>
        <Popover open={projectOpen} onOpenChange={setProjectOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={projectOpen}
              disabled={isDisabled}
              className="w-full justify-between font-normal"
            >
              {project || t('fields.bitbucketRepoPicker.project.inputTitle')}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput
                placeholder={t('fields.bitbucketRepoPicker.project.inputTitle')}
                onValueChange={val => {
                  onChange({ project: val });
                }}
              />
              <CommandList>
                <CommandEmpty>No project found.</CommandEmpty>
                <CommandGroup>
                  {availableProjects.map(p => (
                    <CommandItem
                      key={p}
                      value={p}
                      onSelect={currentValue => {
                        onChange({ project: currentValue });
                        setProjectOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          project === p ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {p}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {/* eslint-disable-next-line react/forbid-elements -- migrating from MUI Typography to native elements with Tailwind */}
        <p className="text-sm text-muted-foreground">
          {t('fields.bitbucketRepoPicker.project.description')}
        </p>
      </div>
    );
  } else {
    projectField = (
      <div className="space-y-2">
        <Label htmlFor="projectInput">
          {t('fields.bitbucketRepoPicker.project.inputTitle')}
        </Label>
        <Input
          id="projectInput"
          onChange={e => onChange({ project: e.target.value })}
          disabled={isDisabled}
          value={project}
        />
        {/* eslint-disable-next-line react/forbid-elements -- migrating from MUI Typography to native elements with Tailwind */}
        <p className="text-sm text-muted-foreground">
          {t('fields.bitbucketRepoPicker.project.description')}
        </p>
      </div>
    );
  }

  return (
    <>
      {host === 'bitbucket.org' && (
        <div
          className={cn(
            'mt-4 mb-2',
            rawErrors?.length > 0 && !workspace && 'text-destructive',
          )}
        >
          {workspaceField}
        </div>
      )}
      <div
        className={cn(
          'mt-4 mb-2',
          rawErrors?.length > 0 && !project && 'text-destructive',
        )}
      >
        {projectField}
      </div>
    </>
  );
};
