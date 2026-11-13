/*
 * Copyright 2022 The Backstage Authors
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
import { createDevApp } from '@backstage/dev-utils';
import { createApiFactory } from '@backstage/core-plugin-api';
import { devToolsPlugin, DevToolsPage } from '../src/plugin';
import { devToolsApiRef, DevToolsApi } from '../src/api';
import { ExternalDependenciesContent } from '../src/components/Content';
import { TaskApiTasksResponse } from '@backstage/plugin-devtools-common/alpha';

// Keep the content screens usable without a running backend during UI development.
const tasks: TaskApiTasksResponse[] = Array.from(
  { length: 12 },
  (_, index) => ({
    taskId: `refresh-provider-${index + 1}`,
    pluginId: 'catalog',
    scope: 'global',
    settings: { version: 1, cadence: 'PT5M' },
    taskState:
      index === 0
        ? {
            status: 'running',
            startedAt: new Date().toISOString(),
            timesOutAt: new Date(Date.now() + 60000).toISOString(),
          }
        : {
            status: 'idle',
            startsAt: new Date(Date.now() + 300000).toISOString(),
            ...(index === 1
              ? {
                  lastRunError:
                    'The provider could not connect to the upstream service.',
                }
              : {}),
          },
    workerState: { status: 'idle' },
  }),
);

const api: DevToolsApi = {
  async getInfo() {
    return {
      operatingSystem: 'Linux',
      resourceUtilization: '4 CPUs, 8 GB RAM',
      nodeJsVersion: 'v22',
      backstageVersion: '1.45.0',
      dependencies: Array.from({ length: 35 }, (_, index) => ({
        name: `@backstage/example-${index + 1}`,
        versions: '1.0.0',
      })),
    };
  },
  async getConfig() {
    return {
      config: { app: { title: 'DevTools development' } },
      error: {
        name: 'ConfigError',
        message: 'Config validation failed',
        messages: ['Example validation warning'],
      },
    };
  },
  async getExternalDependencies() {
    return [
      {
        name: 'GitHub',
        target: 'https://api.github.com',
        type: 'fetch',
        status: 'Healthy',
      },
      {
        name: 'Registry',
        target: 'https://registry.example.com',
        type: 'fetch',
        status: 'Unhealthy',
        error: 'Connection timed out',
      },
      {
        name: 'Optional service',
        target: 'https://example.com',
        type: 'fetch',
        status: 'Unknown',
      },
    ];
  },
  async getScheduledTasksByPlugin(plugin) {
    return {
      scheduledTasks: tasks.map(task => ({ ...task, pluginId: plugin })),
    };
  },
  async triggerScheduledTask(_plugin, taskId) {
    const task = tasks.find(item => item.taskId === taskId)!;
    task.taskState = { status: 'running', startedAt: new Date().toISOString() };
    return {};
  },
  async cancelScheduledTask(_plugin, taskId) {
    const task = tasks.find(item => item.taskId === taskId)!;
    task.taskState = { status: 'idle' };
  },
};

createDevApp()
  .registerPlugin(devToolsPlugin)
  .registerApi(createApiFactory(devToolsApiRef, api))
  .addPage({
    element: (
      <DevToolsPage
        contents={[
          {
            path: 'external-dependencies',
            title: 'External Dependencies',
            children: <ExternalDependenciesContent />,
          },
        ]}
      />
    ),
    title: 'DevTools',
    path: '/devtools',
  })
  .render();
