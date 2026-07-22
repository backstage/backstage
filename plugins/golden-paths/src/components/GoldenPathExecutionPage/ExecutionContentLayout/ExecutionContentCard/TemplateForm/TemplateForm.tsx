/*
 * Copyright 2026 The Backstage Authors
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
import { Workflow } from '@backstage/plugin-scaffolder-react/alpha';
import { Progress } from '@backstage/core-components';
import { AnalyticsContext, useApi } from '@backstage/core-plugin-api';

import { useTemplateForm } from './TemplateForm.utils';
import { AlertInfo, Positioner, Wrapper } from './TemplateForm.styles';
import { GoldenPathContextMenu } from '@backstage/plugin-golden-paths-react';
import { MissingTemplateDialog } from '../../MissingTemplateDialog';
import { useGoldenPathTaskContext } from '../../../useGoldenPathTaskContext';
import { useExecutionNavigation } from '../../../../../hooks/useExecutionNavigation';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import useAsync from 'react-use/esm/useAsync';
import { usePermission } from '@backstage/plugin-permission-react';
import { templateExecutePermission } from '@backstage/plugin-golden-paths-common';

export const TemplateForm = () => {
  const {
    updateCurrentTemplateStatus,
    isCurrentStepMarkedAsDone,
    isCurrentStepSkipped,
    isCurrentStepEnabled,
    currentStepStatus,
  } = useExecutionNavigation();
  const catalogApi = useApi(catalogApiRef);
  const {
    value: { stepIndex, goldenPathTask, mappedStatuses },
  } = useGoldenPathTaskContext();
  const {
    isCreating,
    namespace,
    onCreate,
    onError,
    loading,
    templateName,
    fieldExtensions,
    initialState,
    templateRef,
    error,
    templateId,
    taskId,
  } = useTemplateForm();
  const { value } = useAsync(
    () => catalogApi.getEntityByRef(templateRef),
    [catalogApi, templateRef],
  );

  const { allowed: canExecuteTemplate } = usePermission({
    permission: templateExecutePermission,
    resourceRef: taskId,
  });

  const renderInfo = (status: string) => {
    let displayStatus = status;
    if (status === 'marked_as_done') displayStatus = 'done';
    return (
      <AlertInfo>
        {`This template has been marked as ${displayStatus}. 
        ${
          canExecuteTemplate
            ? ''
            : "You don't have required permissions to execute this golden path."
        } `}
      </AlertInfo>
    );
  };

  const renderPermissionsInfo = () => {
    return (
      <AlertInfo>
        This template hasn't been started yet. You don't have required
        permissions to execute this golden path.
      </AlertInfo>
    );
  };

  if (loading) return <Progress />;

  const templateUrl =
    value?.metadata?.annotations?.['backstage.io/managed-by-location'];

  return (
    <AnalyticsContext attributes={{ entityRef: templateRef }}>
      {isCurrentStepEnabled && !canExecuteTemplate
        ? renderPermissionsInfo()
        : null}
      {isCurrentStepSkipped || isCurrentStepMarkedAsDone
        ? renderInfo(currentStepStatus || '')
        : null}
      {canExecuteTemplate && (
        <Wrapper
          style={
            goldenPathTask.status === 'completed' &&
            mappedStatuses[stepIndex]?.status !== 'completed'
              ? { pointerEvents: 'none', opacity: 0.5, zIndex: 1 }
              : {}
          }
        >
          {isCreating && <Progress />}
          {value && Object.keys(value).length && (
            <Positioner>
              <GoldenPathContextMenu taskConfigUrl={templateUrl} />
            </Positioner>
          )}
          {error ? (
            <MissingTemplateDialog
              isLast={stepIndex + 1 === goldenPathTask.spec.steps.length}
              isOpen={error}
              continueCurrent={() =>
                updateCurrentTemplateStatus(taskId, templateId, 'missing')
              }
            />
          ) : (
            <Workflow
              namespace={namespace}
              templateName={templateName}
              onCreate={onCreate}
              onError={onError}
              extensions={fieldExtensions}
              initialState={initialState}
            />
          )}
        </Wrapper>
      )}
    </AnalyticsContext>
  );
};
