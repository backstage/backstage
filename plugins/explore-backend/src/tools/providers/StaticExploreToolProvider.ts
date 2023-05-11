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
  ExploreTool,
  GetExploreToolsRequest,
  GetExploreToolsResponse,
} from '@backstage/plugin-explore-common';
import { intersection, isEmpty } from 'lodash';
import { ExploreToolProvider } from '../types';

const anyOf = <T>(prop: T | T[], matches: T[]) =>
  isEmpty(matches)
    ? true
    : intersection([...[prop]].flat(), matches)?.length > 0;

/**
 * A basic ExploreToolProvider implementation using static data.
 *
 * @public
 */
export class StaticExploreToolProvider implements ExploreToolProvider {
  private readonly tools: ExploreTool[];

  static fromData(tools: ExploreTool[]) {
    return new StaticExploreToolProvider(tools);
  }

  private constructor(tools: ExploreTool[]) {
    this.tools = tools;
  }

  async getTools(
    request: GetExploreToolsRequest,
  ): Promise<GetExploreToolsResponse> {
    const { filter } = request ?? {};
    const tags = filter?.tags ?? [];
    const lifecycles = filter?.lifecycle ?? [];

    const tools = this.tools.filter(
      t => anyOf(t.tags ?? [], tags) && anyOf(t.lifecycle ?? [], lifecycles),
    );

    return { tools };
  }
}
