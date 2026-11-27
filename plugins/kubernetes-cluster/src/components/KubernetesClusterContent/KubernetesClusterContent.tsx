/*
 * Copyright 2023 The Backstage Authors
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
import { ApiResources } from '../ApiResources/ApiResources';
import { Grid, Text } from '@backstage/ui';
import { Nodes } from '../Nodes/Nodes';
import { ClusterOverview } from '../ClusterOverview';
import {
  KubernetesClusterErrorProvider,
  useKubernetesClusterError,
} from '../KubernetesClusterErrorContext/KubernetesClusterErrorContext';
import { WarningPanel } from '@backstage/core-components';
import { kubernetesClustersReadPermission } from '@backstage/plugin-kubernetes-common';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { kubernetesClusterTranslationRef } from '../../translation';

const ContentGrid = () => {
  const { error } = useKubernetesClusterError();
  return (
    <>
      <Grid.Root columns="12" gap="4">
        {error && (
          <Grid.Item colSpan="12">
            <WarningPanel title="Error loading Kubernetes Cluster Plugin">
              <Text as="p" variant="body-large">
                {error}
              </Text>
            </WarningPanel>
          </Grid.Item>
        )}
        <Grid.Item colSpan="6">
          <ClusterOverview />
        </Grid.Item>
        <Grid.Item colSpan="6">
          <ApiResources />
        </Grid.Item>
        <Grid.Item colSpan="12">
          <Nodes />
        </Grid.Item>
      </Grid.Root>
    </>
  );
};

/**
 *
 *
 * @public
 */
export const KubernetesClusterContent = () => {
  const { t } = useTranslationRef(kubernetesClusterTranslationRef);

  return (
    <RequirePermission
      permission={kubernetesClustersReadPermission}
      errorPage={
        <WarningPanel
          title={t('kubernetesClusterContentPage.permissionAlert.title')}
          message={t('kubernetesClusterContentPage.permissionAlert.message')}
        />
      }
    >
      <KubernetesClusterErrorProvider>
        <ContentGrid />
      </KubernetesClusterErrorProvider>
    </RequirePermission>
  );
};
