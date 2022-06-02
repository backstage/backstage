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
import { createApiRef } from '@backstage/core-plugin-api';

export type DynatraceEntity = {
  entityId: {
    id: string;
    type: string;
  };
  name: string;
};

export type DynatraceProblem = {
  problemId: string;
  impactLevel: string;
  status: string;
  startTime: number;
  endTime: number;
  title: string;
  severityLevel: string;
  rootCauseEntity: DynatraceEntity;
  affectedEntities: Array<DynatraceEntity>;
};

export interface DynatraceProblems {
  problems: Array<DynatraceProblem>;
}

export const dynatraceApiRef = createApiRef<DynatraceApi>({
  id: 'plugin.dynatrace.service',
});

export type DynatraceApi = {
  getDynatraceProblems(
    dynatraceEntityId: string,
  ): Promise<DynatraceProblems | undefined>;
};
