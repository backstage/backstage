/*
 * Copyright 2025 The Backstage Authors
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
import React, { ReactNode } from 'react';
import {
  kubernetesClustersReadPermission,
  kubernetesResourcesReadPermission,
} from '@backstage/plugin-kubernetes-common';
import { usePermission } from '@backstage/plugin-permission-react';
import { Content, Page, WarningPanel } from '@backstage/core-components';

export type RequireKubernetesPermissionProps = {
  children: ReactNode;
};

export function RequireKubernetesPermissions(
  props: RequireKubernetesPermissionProps,
): JSX.Element | null {
  const kubernetesClustersPermissionResult = usePermission({
    permission: kubernetesClustersReadPermission,
  });
  const kubernetesResourcesPermissionResult = usePermission({
    permission: kubernetesResourcesReadPermission,
  });

  if (
    kubernetesClustersPermissionResult.loading ||
    kubernetesResourcesPermissionResult.loading
  ) {
    return null;
  }

  if (
    kubernetesClustersPermissionResult.allowed &&
    kubernetesResourcesPermissionResult.allowed
  ) {
    return <>{props.children}</>;
  }

  return (
    <Page themeId="tool">
      <Content>
        <WarningPanel
          title="Permission required"
          message={`To view Kubernetes objects, contact your administrator to give you the 
              '${kubernetesClustersReadPermission.name}' and '${kubernetesResourcesReadPermission.name}' permission.`}
        />
      </Content>
    </Page>
  );
}
