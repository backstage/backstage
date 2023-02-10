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
import useAsync from 'react-use/lib/useAsync';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import { InfoCard } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { puppetDbApiRef } from '../../api';

type PuppetDbNodeCardProps = {
  certName: string;
};

export const PuppetDbNodeCard = (props: PuppetDbNodeCardProps) => {
  const { certName } = props;
  const puppetDbApi = useApi(puppetDbApiRef);

  const { value, loading, error } = useAsync(async () => {
    return puppetDbApi.getPuppetDbNode(certName);
  }, [puppetDbApi, certName]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <InfoCard
      title="PuppetDB Node"
      subheader={`Details about PuppetDB node ${certName}`}
    >
      <text>${JSON.stringify(value)}</text>
    </InfoCard>
  );
};
