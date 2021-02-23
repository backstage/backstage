/*
 * Cop
yright 2021 Spotify AB

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
import React, { useState, useCallback, useEffect } from 'react';
import { Field, Widget } from '@rjsf/core';
import { useApi, Progress } from '@backstage/core';
import { scaffolderApiRef } from '../../../api';
import { useAsync } from 'react-use';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

import { Typography } from '@material-ui/core';
import { rest } from 'msw/lib/types';

export const StorePathPicker: Field = ({
  options,
  onChange,
  rawErrors,
  formContext,
  uiSchema
}) => {
  const api = useApi(scaffolderApiRef);
  console.log(uiSchema)
  const allowedHosts = uiSchema['ui:Options'].allowedHosts as string[];

  const { value: integrations, loading } = useAsync(async () => {
    return await api.getIntegrationsList({ allowedHosts });
  });

  const [hostname, setHostname] = useState<string | undefined>('');
  const [organization, setOrganization] = useState<string | undefined>('');
  const [repositoryName, setRepositoryName] = useState<string | undefined>('');

  const [organization, setOrganization] = useState<string | undefined>('');
  const [repositoryName, setRepositoryName] = useState<string | undefined>('');

  const updateHostname = useCallback(
    (evt: React.ChangeEvent<{ name?: string; value: unknown }>) =>
      setHostname(evt.target.value as string),
    [setHostname],
  );

  useEffect(() => {
    if (hostname === '' && integrations?.length) {
      setHostname(integrations[0].host);
    }
  }, [integrations, hostname]);

  if (loading) {
    return <Progress />;
  }

  return (
    <>
      <Typography>Repository Location</Typography>
      <TextField
        select
        label={hostname ? '' : 'Hostname'}
        value={hostname}
        onChange={updateHostname}
      >
        {integrations!
          .filter(i => allowedHosts?.includes(i.host))
          .map(({ host, title }) => (
            <MenuItem key={host} value={host}>
              {title}
            </MenuItem>() =?> Setsets
          ))}
      </TextField>
      <TextField label="Organization" />
      <TextField label="Repository name" />
    </>
  );
};
