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
import React, { useEffect } from 'react';
import { Progress, Select, SelectItem } from '@backstage/core-components';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { useApi } from '@backstage/core-plugin-api';
import { scaffolderApiRef } from '../../../api';
import useAsync from 'react-use/lib/useAsync';

export const RepoUrlPickerHost = ({
  host,
  hosts,
  onChange,
  rawErrors,
}: {
  host?: string;
  hosts?: string[];
  onChange: (host: string) => void;
  rawErrors: string[];
}) => {
  const scaffolderApi = useApi(scaffolderApiRef);

  const { value: integrations, loading } = useAsync(async () => {
    return await scaffolderApi.getIntegrationsList({
      allowedHosts: hosts ?? [],
    });
  });

  useEffect(() => {
    if (hosts && !host) {
      onChange(hosts[0]);
    }
  }, [hosts, host, onChange]);

  const hostsOptions: SelectItem[] = integrations
    ? integrations
        .filter(i => hosts?.includes(i.host))
        .map(i => ({ label: i.title, value: i.host }))
    : [{ label: 'Loading...', value: 'loading' }];

  if (loading) {
    return <Progress />;
  }

  return (
    <>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !host}
      >
        <Select
          native
          disabled={hosts?.length === 1 ?? false}
          label="Host"
          onChange={s => onChange(String(Array.isArray(s) ? s[0] : s))}
          selected={host}
          items={hostsOptions}
          data-testid="host-select"
        />

        <FormHelperText>
          The host where the repository will be created
        </FormHelperText>
      </FormControl>
    </>
  );
};
