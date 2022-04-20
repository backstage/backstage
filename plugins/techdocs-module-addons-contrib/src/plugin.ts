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

import { createPlugin } from '@backstage/core-plugin-api';
import {
  createTechDocsAddonExtension,
  TechDocsAddonLocations,
} from '@backstage/plugin-techdocs-react';
import { ReportIssueAddon, ReportIssueProps } from './ReportIssue';

/**
 * The TechDocs addons contrib plugin
 *
 * @public
 */

export const techdocsModuleAddonsContribPlugin = createPlugin({
  id: 'techdocsModuleAddonsContrib',
});

/**
 * TechDocs addon that lets you select text and open GitHub/Gitlab issues
 *
 * @public
 */

export const ReportIssue = techdocsModuleAddonsContribPlugin.provide(
  createTechDocsAddonExtension<ReportIssueProps>({
    name: 'ReportIssue',
    location: TechDocsAddonLocations.Content,
    component: ReportIssueAddon,
  }),
);
