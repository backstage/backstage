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
import {
  ComponentType,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ShadcnButton as Button,
  Content,
  ErrorPanel,
  Header,
  Page,
} from '@backstage/core-components';
import { useNavigate, useParams } from 'react-router-dom';

import {
  scaffolderApiRef,
  ScaffolderTaskOutput,
  useTaskEventStream,
} from '@backstage/plugin-scaffolder-react';
import { selectedTemplateRouteRef } from '../../routes';
import {
  AnalyticsContext,
  useAnalytics,
  useApi,
  useRouteRef,
} from '@backstage/core-plugin-api';
import qs from 'qs';
import { ContextMenu } from './ContextMenu';
import {
  DefaultTemplateOutputs,
  TaskLogStream,
  TaskSteps,
} from '@backstage/plugin-scaffolder-react/alpha';
import { useAsync } from '@react-hookz/web';
import { usePermission } from '@backstage/plugin-permission-react';
import {
  taskCancelPermission,
  taskCreatePermission,
  taskReadPermission,
} from '@backstage/plugin-scaffolder-common/alpha';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../translation';
import { entityPresentationApiRef } from '@backstage/plugin-catalog-react';
import { default as reactUseAsync } from 'react-use/esm/useAsync';
import { stringifyEntityRef } from '@backstage/catalog-model';

/**
 * @public
 */
export const OngoingTask = (props: {
  TemplateOutputsComponent?: ComponentType<{
    output?: ScaffolderTaskOutput;
  }>;
}) => {
  // todo(blam): check that task Id actually exists, and that it's valid. otherwise redirect to something more useful.
  const { taskId } = useParams();
  const taskStream = useTaskEventStream(taskId!);
  const { namespace, name } =
    taskStream.task?.spec.templateInfo?.entity?.metadata ?? {};

  return (
    <AnalyticsContext
      attributes={{
        entityRef:
          name &&
          stringifyEntityRef({
            kind: 'template',
            namespace,
            name,
          }),
        taskId,
      }}
    >
      <Page themeId="website">
        <OngoingTaskContent {...props} />
      </Page>
    </AnalyticsContext>
  );
};

function OngoingTaskContent(props: {
  TemplateOutputsComponent?: ComponentType<{
    output?: ScaffolderTaskOutput;
  }>;
}) {
  const { taskId } = useParams();
  const templateRouteRef = useRouteRef(selectedTemplateRouteRef);
  const navigate = useNavigate();
  const analytics = useAnalytics();
  const scaffolderApi = useApi(scaffolderApiRef);
  const entityPresentationApi = useApi(entityPresentationApiRef);
  const taskStream = useTaskEventStream(taskId!);
  const steps = useMemo(
    () =>
      taskStream.task?.spec.steps.map(step => ({
        ...step,
        ...taskStream?.steps?.[step.id],
      })) ?? [],
    [taskStream],
  );
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const [logsVisible, setLogVisibleState] = useState(false);
  const [buttonBarVisible, setButtonBarVisibleState] = useState(true);

  const { allowed: canCancelTask } = usePermission({
    permission: taskCancelPermission,
    resourceRef: taskId,
  });

  const { allowed: canReadTask } = usePermission({
    permission: taskReadPermission,
    resourceRef: taskId,
  });

  const { allowed: canCreateTask } = usePermission({
    permission: taskCreatePermission,
  });

  // Start Over endpoint requires user to have both read (to grab parameters) and create (to create new task) permissions
  const canStartOver = canReadTask && canCreateTask;

  useEffect(() => {
    if (taskStream.error) {
      setLogVisibleState(true);
    }
  }, [taskStream.error]);

  useEffect(() => {
    if (taskStream.completed && !taskStream.error) {
      setLogVisibleState(true);
      setButtonBarVisibleState(false);
    }
  }, [taskStream.error, taskStream.completed]);

  const { value: presentation } = reactUseAsync(async () => {
    const templateEntityRef = taskStream.task?.spec.templateInfo?.entityRef;
    if (!templateEntityRef) {
      return undefined;
    }
    return entityPresentationApi.forEntity(templateEntityRef).promise;
  }, [entityPresentationApi, taskStream.task?.spec.templateInfo?.entityRef]);

  const activeStep = useMemo(() => {
    for (let i = steps.length - 1; i >= 0; i--) {
      if (steps[i].status !== 'open') {
        return i;
      }
    }

    return 0;
  }, [steps]);

  const isRetryableTask =
    taskStream.task?.spec.EXPERIMENTAL_recovery?.EXPERIMENTAL_strategy ===
    'startOver';

  const canRetry = canReadTask && canCreateTask && isRetryableTask;

  const startOver = useCallback(() => {
    const { namespace, name } =
      taskStream.task?.spec.templateInfo?.entity?.metadata ?? {};

    const formData = taskStream.task?.spec.parameters ?? {};

    if (!namespace || !name) {
      return;
    }

    analytics.captureEvent('click', `Task has been started over`);

    navigate({
      pathname: templateRouteRef({
        namespace,
        templateName: name,
      }),
      search: `?${qs.stringify({ formData: JSON.stringify(formData) })}`,
    });
  }, [
    analytics,
    navigate,
    taskStream.task?.spec.parameters,
    taskStream.task?.spec.templateInfo?.entity?.metadata,
    templateRouteRef,
  ]);

  const [, { execute: triggerRetry }] = useAsync(async () => {
    if (taskId) {
      analytics.captureEvent('retried', 'Template has been retried');
      await scaffolderApi.retry?.(taskId);
    }
  });

  const [{ status: cancelStatus }, { execute: triggerCancel }] = useAsync(
    async () => {
      if (taskId) {
        analytics.captureEvent('cancelled', 'Template has been cancelled');
        await scaffolderApi.cancelTask(taskId);
      }
    },
  );

  const Outputs = props.TemplateOutputsComponent ?? DefaultTemplateOutputs;

  const cancelEnabled = !(taskStream.cancelled || taskStream.completed);
  const isCancelButtonDisabled =
    !cancelEnabled || cancelStatus !== 'not-executed' || !canCancelTask;

  return (
    <>
      <Header
        pageTitleOverride={
          presentation
            ? t('ongoingTask.pageTitle.hasTemplateName', {
                templateName: presentation.primaryTitle,
              })
            : t('ongoingTask.pageTitle.noTemplateName')
        }
        title={
          <div>
            {t('ongoingTask.title')}{' '}
            <code>{presentation ? presentation.primaryTitle : ''}</code>
          </div>
        }
        subtitle={t('ongoingTask.subtitle', { taskId: taskId as string })}
      >
        <ContextMenu
          cancelEnabled={cancelEnabled}
          canRetry={canRetry}
          isRetryableTask={isRetryableTask}
          logsVisible={logsVisible}
          buttonBarVisible={buttonBarVisible}
          onStartOver={startOver}
          onRetry={triggerRetry}
          onToggleLogs={setLogVisibleState}
          onToggleButtonBar={setButtonBarVisibleState}
          taskId={taskId}
          onCancel={triggerCancel}
          isCancelButtonDisabled={isCancelButtonDisabled}
        />
      </Header>
      <Content className="flex flex-col">
        {taskStream.error ? (
          <div className="pb-4">
            <ErrorPanel
              error={taskStream.error}
              titleFormat="markdown"
              title={taskStream.error.message}
            />
          </div>
        ) : null}

        <div className="pb-4">
          <TaskSteps
            steps={steps}
            activeStep={activeStep}
            isComplete={taskStream.completed}
            isError={Boolean(taskStream.error)}
          />
        </div>

        <Outputs output={taskStream.output} />

        {buttonBarVisible ? (
          <div className="pb-4">
            <div className="rounded-xl border border-border bg-card text-card-foreground shadow">
              <div className="p-4">
                <div className="flex flex-row justify-end">
                  <Button
                    variant="outline"
                    className="mr-2"
                    disabled={
                      !cancelEnabled ||
                      (cancelStatus !== 'not-executed' && !isRetryableTask) ||
                      !canCancelTask
                    }
                    onClick={triggerCancel}
                    data-testid="cancel-button"
                  >
                    {t('ongoingTask.cancelButtonTitle')}
                  </Button>
                  {isRetryableTask && (
                    <Button
                      variant="outline"
                      className="mr-2"
                      disabled={cancelEnabled || !canRetry}
                      onClick={triggerRetry}
                      data-testid="retry-button"
                    >
                      {t('ongoingTask.retryButtonTitle')}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => setLogVisibleState(!logsVisible)}
                  >
                    {logsVisible
                      ? t('ongoingTask.hideLogsButtonTitle')
                      : t('ongoingTask.showLogsButtonTitle')}
                  </Button>
                  <Button
                    variant="default"
                    disabled={cancelEnabled || !canStartOver}
                    onClick={startOver}
                    data-testid="start-over-button"
                  >
                    {t('ongoingTask.startOverButtonTitle')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {logsVisible ? (
          <div className="rounded-xl border border-border bg-card text-card-foreground shadow h-full">
            <div className="p-4 h-full">
              <TaskLogStream logs={taskStream.stepLogs} />
            </div>
          </div>
        ) : null}
      </Content>
    </>
  );
}
