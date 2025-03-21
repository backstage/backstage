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

import React from 'react';
import Typography from '@material-ui/core/Typography';
import { ClusterObjects } from '@backstage/plugin-kubernetes-common';
import { WarningPanel } from '@backstage/core-components';

const clustersWithErrorsToErrorMessage = (
  clustersWithErrors: ClusterObjects[],
): React.ReactNode => {
  return clustersWithErrors.map((c, i) => {
    return (
      <div key={i}>
        <Typography variant="body2">{`Cluster: ${
          c.cluster.title || c.cluster.name
        }`}</Typography>
        {c.errors.map((e, j) => {
          return (
            <Typography variant="body2" key={j}>
              {e.errorType === 'FETCH_ERROR'
                ? `Error communicating with Kubernetes: ${e.errorType}, message: ${e.message}`
                : `Error fetching Kubernetes resource: '${e.resourcePath}', error: ${e.errorType}, status code: ${e.statusCode}`}
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
  children?: React.ReactNode;
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
}: ErrorPanelProps) => (
  <WarningPanel
    title="There was a problem retrieving Kubernetes objects"
    message={`There was a problem retrieving some Kubernetes resources for the entity: ${entityName}. This could mean that the Error Reporting card is not completely accurate.`}
  >
    {clustersWithErrors && (
      <div>Errors: {clustersWithErrorsToErrorMessage(clustersWithErrors)}</div>
    )}
    {errorMessage && (
      <Typography variant="body2">Errors: {errorMessage}</Typography>
    )}
  </WarningPanel>
);
