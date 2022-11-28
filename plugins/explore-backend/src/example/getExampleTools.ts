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

import {
  GetExploreToolsRequest,
  GetExploreToolsResponse,
} from '@backstage/plugin-explore-common';
import { intersection, isEmpty } from 'lodash';
import { exampleTools } from './tools';

const anyOf = <T>(prop: T | T[], matches: T[]) =>
  isEmpty(matches)
    ? true
    : intersection([...[prop]].flat(), matches)?.length > 0;

/**
 * @private Example only - do not use in production
 */
export async function getExampleTools(
  request: GetExploreToolsRequest,
): Promise<GetExploreToolsResponse> {
  const { filter } = request ?? {};
  const tags = filter?.tags ?? [];
  const lifecycles = filter?.lifecycle ?? [];

  return {
    tools: exampleTools.filter(
      t => anyOf(t.tags ?? [], tags) && anyOf(t.lifecycle ?? [], lifecycles),
    ),
  };
}
