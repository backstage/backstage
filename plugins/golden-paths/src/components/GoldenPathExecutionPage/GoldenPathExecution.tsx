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
import {
  Content,
  ErrorPanel,
  Header,
  Page,
  Progress,
} from '@backstage/core-components';

import { useGoldenPathTask } from './GoldenPathExecution.utils';
import { ExecutionContentLayout } from './ExecutionContentLayout';
import { GoldenPathTaskContextProvider } from './useGoldenPathTaskContext';
import { TaskContextMenu } from './TaskContextMenu';

export const GoldenPathExecution = () => {
  const { error, loading, task, getGoldenPathTask } = useGoldenPathTask();

  if (loading) return <Progress />;

  if (error)
    return (
      <Content>
        <ErrorPanel error={error} />
      </Content>
    );

  if (!task)
    return (
      <Content>
        <ErrorPanel
          error={new Error('There is no Golden Path created for this task ID')}
        />
      </Content>
    );

  const {
    spec: { goldenPathInfo },
    status: goldenPathStatus,
  } = task;
  const title =
    goldenPathInfo?.entity?.metadata.title ||
    goldenPathInfo?.entity?.metadata.name ||
    'Golden Path';

  const GoldenPathContextMenuProps = {
    id: task.id,
    taskConfigUrl: goldenPathInfo?.baseUrl,
    entityRef: goldenPathInfo?.entityRef,
    goldenPathStatus,
  };

  return (
    <GoldenPathTaskContextProvider
      task={task}
      getGoldenPathTask={getGoldenPathTask}
    >
      <Page themeId="golden-path-execution">
        <Header title={title} pageTitleOverride={title}>
          <TaskContextMenu {...GoldenPathContextMenuProps} />
        </Header>

        <Content>
          <ExecutionContentLayout />
        </Content>
      </Page>
    </GoldenPathTaskContextProvider>
  );
};
