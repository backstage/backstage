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

import { Entity } from '@backstage/catalog-model';
import { PagerDutyEntity } from '../types';
import { PAGERDUTY_INTEGRATION_KEY, PAGERDUTY_SERVICE_ID } from './constants';

export function getPagerDutyEntity(entity: Entity): PagerDutyEntity {
  const {
    [PAGERDUTY_INTEGRATION_KEY]: integrationKey,
    [PAGERDUTY_SERVICE_ID]: serviceId,
  } = entity.metadata.annotations || ({} as Record<string, string>);
  const name = entity.metadata.name;

  return { integrationKey, serviceId, name };
}
