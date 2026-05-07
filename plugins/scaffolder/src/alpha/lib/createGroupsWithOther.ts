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

import { TemplateGroupFilter } from '@backstage/plugin-scaffolder-react';

/**
 * Appends an "Other" group matching templates not matched by any of the
 * configured groups. The `otherTitle` should already be translated.
 */
export const createGroupsWithOther = (
  groups: TemplateGroupFilter[],
  otherTitle: string,
): TemplateGroupFilter[] => {
  const baseGroups = [...groups];
  return [
    ...baseGroups,
    {
      title: otherTitle,
      filter: e => !baseGroups.some(({ filter }) => filter(e)),
    },
  ];
};
