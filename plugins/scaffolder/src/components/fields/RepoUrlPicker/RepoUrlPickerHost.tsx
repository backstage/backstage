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
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import useAsync from 'react-use/esm/useAsync';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';

export const RepoUrlPickerHost = (props: {
  host?: string;
  hosts?: string[];
  onChange: (host: string) => void;
  rawErrors: string[];
  isDisabled?: boolean;
}) => {
  const { host, hosts, onChange, rawErrors, isDisabled } = props;
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const scaffolderApi = useApi(scaffolderApiRef);

  const { value: { integrations } = { integrations: [] }, loading } = useAsync(
    async () => {
      return await scaffolderApi.getIntegrationsList({
        allowedHosts: hosts ?? [],
      });
    },
  );

  useEffect(() => {
    // If there is no host chosen currently
    if (!host) {
      // Set the first of the allowedHosts option if that available
      if (hosts?.length) {
        onChange(hosts[0]);
        // if there's no hosts provided, fallback to using the first integration
      } else if (integrations?.length) {
        onChange(integrations[0].host);
      }
    }
  }, [hosts, host, onChange, integrations]);

  // If there are no allowedHosts provided, then show all integrations. Otherwise, only show integrations
  // that are provided in the dropdown for the user to choose from.
  const hostsOptions: SelectItem[] = integrations
    ? integrations
        .filter(i => (hosts?.length ? hosts?.includes(i.host) : true))
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
          disabled={isDisabled || hosts?.length === 1}
          label={t('fields.repoUrlPicker.host.title')}
          onChange={s => onChange(String(Array.isArray(s) ? s[0] : s))}
          selected={host}
          items={hostsOptions}
          data-testid="host-select"
        />

        <FormHelperText>
          {t('fields.repoUrlPicker.host.description')}
        </FormHelperText>
      </FormControl>
    </>
  );
};
