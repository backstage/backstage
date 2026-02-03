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
import SubjectIcon from '@material-ui/icons/Subject';

import { KubernetesDialog } from '../../KubernetesDialog';
import { PodLogs } from './PodLogs';
import { ContainerScope } from './types';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { kubernetesReactTranslationRef } from '../../../translation';

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
  const { t } = useTranslationRef(kubernetesReactTranslationRef);
  return (
    <KubernetesDialog
      buttonAriaLabel={t('podLogs.buttonAriaLabel')}
      buttonIcon={<SubjectIcon />}
      buttonText={t('podLogs.buttonText')}
      disabled={false}
      title={t('podLogs.titleTemplate', {
        podName: containerScope.podName,
        containerName: containerScope.containerName,
        clusterName:
          containerScope.cluster.title || containerScope.cluster.name,
      })}
    >
      <PodLogs containerScope={containerScope} />
    </KubernetesDialog>
  );
};
