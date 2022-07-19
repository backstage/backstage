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
  InfoCard,
  Progress,
  StructuredMetadataTable,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import useAsync from 'react-use/lib/useAsync';
import { apacheAirflowApiRef } from '../../api';
import { InstanceVersion } from '../../api/types';

export const VersionComponent = () => {
  const apiClient = useApi(apacheAirflowApiRef);
  const { value, loading, error } =
    useAsync(async (): Promise<InstanceVersion> => {
      return await apiClient.getInstanceVersion();
    }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (value) {
    const metadata = {
      Version: value.version,
      'Git Version': value.git_version,
    };

    return (
      <InfoCard title="Instance Version" variant="fullHeight">
        <StructuredMetadataTable metadata={metadata} />
      </InfoCard>
    );
  }
  return <Alert severity="warning">No status information found...</Alert>;
};
