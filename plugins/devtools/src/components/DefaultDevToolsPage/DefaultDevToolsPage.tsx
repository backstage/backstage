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

import {
  devToolsConfigReadPermission,
  devToolsInfoReadPermission,
  devToolsTaskSchedulerReadPermission,
} from '@backstage/plugin-devtools-common';

import { ConfigContent } from '../Content/ConfigContent';
import { DevToolsLayout } from '../DevToolsLayout';
import { InfoContent } from '../Content/InfoContent';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { ScheduledTasksContent } from '../Content/ScheduledTasksContent';

/** @public */
export const DefaultDevToolsPage = () => (
  <DevToolsLayout>
    <DevToolsLayout.Route path="info" title="Info">
      <RequirePermission permission={devToolsInfoReadPermission}>
        <InfoContent />
      </RequirePermission>
    </DevToolsLayout.Route>
    <DevToolsLayout.Route path="config" title="Config">
      <RequirePermission permission={devToolsConfigReadPermission}>
        <ConfigContent />
      </RequirePermission>
    </DevToolsLayout.Route>
    <DevToolsLayout.Route path="scheduled-tasks" title="Scheduled Tasks">
      <RequirePermission permission={devToolsTaskSchedulerReadPermission}>
        <ScheduledTasksContent />
      </RequirePermission>
    </DevToolsLayout.Route>
  </DevToolsLayout>
);
