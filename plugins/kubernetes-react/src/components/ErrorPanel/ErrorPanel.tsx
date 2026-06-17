/*
 * Copyright 2020 The Backstage Authors
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

import { ReactNode } from 'react';
import Typography from '@material-ui/core/Typography';
import { ClusterObjects } from '@backstage/plugin-kubernetes-common';
import { WarningPanel } from '@backstage/core-components';
import {
  useTranslationRef,
  TranslationFunction,
} from '@backstage/core-plugin-api/alpha';
import { kubernetesReactTranslationRef } from '../../translation';

const clustersWithErrorsToErrorMessage = (
  clustersWithErrors: ClusterObjects[],
  t: TranslationFunction<typeof kubernetesReactTranslationRef.T>,
): ReactNode => {
  return clustersWithErrors.map((c, i) => {
    return (
      <div key={i}>
        <Typography variant="body2">
          {t('errorPanel.clusterLabelValue', {
            cluster: c.cluster.title || c.cluster.name,
          })}
        </Typography>
        {c.errors.map((e, j) => {
          return (
            <Typography variant="body2" key={j}>
              {e.errorType === 'FETCH_ERROR'
                ? t('errorPanel.fetchError', {
                    errorType: e.errorType,
                    message: e.message,
                  })
                : t('errorPanel.resourceError', {
                    resourcePath: e.resourcePath ?? '',
                    errorType: e.errorType,
                    statusCode: String(e.statusCode ?? ''),
                  })}
            </Typography>
          );
        })}
        <br />
      </div>
    );
  });
};

/**
 *
 *
 * @public
 */
export type ErrorPanelProps = {
  entityName: string;
  errorMessage?: string;
  clustersWithErrors?: ClusterObjects[];
  children?: ReactNode;
};

/**
 *
 *
 * @public
 */
export const ErrorPanel = ({
  entityName,
  errorMessage,
  clustersWithErrors,
}: ErrorPanelProps) => {
  const { t } = useTranslationRef(kubernetesReactTranslationRef);
  return (
    <WarningPanel
      title={t('errorPanel.title')}
      message={t('errorPanel.message', { entityName })}
    >
      {clustersWithErrors && (
        <div>
          {t('errorPanel.errorsLabel')}:{' '}
          {clustersWithErrorsToErrorMessage(clustersWithErrors, t)}
        </div>
      )}
      {errorMessage && (
        <Typography variant="body2">
          {t('errorPanel.errorsLabel')}: {errorMessage}
        </Typography>
      )}
    </WarningPanel>
  );
};
