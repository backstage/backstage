/*
 * Copyright 2021 Spotify AB
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
import { Field } from '@rjsf/core';
import { useApi, Progress } from '@backstage/core';
import { scaffolderApiRef } from '../../../api';
import { useAsync } from 'react-use';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import { Typography } from '@material-ui/core';
import { rest } from 'msw/lib/types';

export const RepoUrlPicker: Field = ({ onChange, uiSchema, ...rest }) => {
  const api = useApi(scaffolderApiRef);
  const allowedHosts = uiSchema['ui:options']?.allowedHosts as string[];

  const { value: integrations, loading } = useAsync(async () => {
    return await api.getIntegrationsList({ allowedHosts });
  });

  console.log(rest);

  const [host, setHost] = useState('');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');

  const updateHost = useCallback(
    (evt: React.ChangeEvent<{ name?: string; value: unknown }>) =>
      setHost(evt.target.value as string),
    [setHost],
  );

  const updateOwner = useCallback(
    (evt: React.ChangeEvent<{ name?: string; value: unknown }>) =>
      setOwner(evt.target.value as string),
    [setOwner],
  );

  const updateRepo = useCallback(
    (evt: React.ChangeEvent<{ name?: string; value: unknown }>) =>
      setRepo(evt.target.value as string),
    [setRepo],
  );

  useEffect(() => {
    if (host === '' && integrations?.length) {
      setHost(integrations[0].host);
    }
  }, [integrations, host]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('owner', owner);
    params.set('repo', repo);

    onChange(`${encodeURIComponent(host)}?${params.toString()}`);
  }, [host, owner, repo, onChange]);

  if (loading) {
    return <Progress />;
  }

  return (
    <>
      <Typography variant="body1">Repository Location</Typography>
      <FormControl margin="normal" required>
        <InputLabel htmlFor="hostInput">Host</InputLabel>
        <Select native id="hostInput" onChange={updateHost}>
          {integrations!
            .filter(i => allowedHosts?.includes(i.host))
            .map(({ host, title }) => (
              <option key={host} value={host}>
                {title}
              </option>
            ))}
        </Select>
      </FormControl>
      <FormControl margin="normal" required>
        <InputLabel htmlFor="ownerInput">Owner</InputLabel>
        <Input id="ownerInput" onBlur={updateOwner} />
      </FormControl>
      <FormControl margin="normal" required>
        <InputLabel htmlFor="repoInput">Repository</InputLabel>
        <Input id="repoInput" onBlur={updateRepo} />
      </FormControl>
    </>
  );
};
