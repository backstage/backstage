/*
 * Copyright 2024 The Backstage Authors
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

import DeleteIcon from '@material-ui/icons/Close';

import { KubernetesDialog } from '../../KubernetesDialog';
import { PodDelete } from './PodDelete';
import { ContainerScope } from './types';

/**
 * Props for PodDeleteDialog
 *
 * @public
 */
export interface PodDeleteDialogProps {
  containerScope: ContainerScope;
  previous?: boolean;
  buttonText?: string;
}

/**
 * Shows the logs for the given delete
 *
 * @public
 */
export const PodDeleteDialog = ({
  containerScope,
  previous,
  buttonText,
}: PodDeleteDialogProps) => {
  return (
    <KubernetesDialog
      buttonAriaLabel={buttonText ?? 'Delete Pod'}
      buttonIcon={<DeleteIcon />}
      buttonText={buttonText ?? 'Delete Pod'}
      disabled={false}
      title={`${containerScope.podName} - ${
        containerScope.containerName
      } logs on cluster ${
        containerScope.cluster.title || containerScope.cluster.name
      }`}
    >
      <PodDelete containerScope={containerScope} previous={previous} />
    </KubernetesDialog>
  );
};
