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
import React from 'react';

import SubjectIcon from '@material-ui/icons/Subject';

import { KubernetesDialog } from '../../KubernetesDialog';
import { PodLogs } from './PodLogs';
import { ContainerScope } from './types';

/**
 * Props for PodLogsDialog
 *
 * @public
 */
export interface PodLogsDialogProps {
  containerScope: ContainerScope;
}

/**
 * Shows the logs for the given pod in a Dialog
 *
 * @public
 */
export const PodLogsDialog = ({ containerScope }: PodLogsDialogProps) => {
  return (
    <KubernetesDialog
      buttonAriaLabel="get logs"
      buttonIcon={<SubjectIcon />}
      buttonText="Logs"
      disabled={false}
      title={`${containerScope.podName} - ${containerScope.containerName} logs on cluster ${containerScope.clusterName}`}
    >
      <PodLogs containerScope={containerScope} />
    </KubernetesDialog>
  );
};
