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
import { GoldenPathEntityV1beta1 } from '@backstage/plugin-golden-paths-common';

export const getRegionsText = (entity: GoldenPathEntityV1beta1) => {
  const {
    metadata: { availability },
  } = entity;

  const regions =
    Array.isArray(availability) && availability.length > 0
      ? availability.join(', ')
      : null;

  return regions;
};

export const getNumberOfTemplatesText = ({
  spec: { steps },
}: GoldenPathEntityV1beta1) =>
  `${steps.length} ${steps.length === 1 ? 'template' : 'templates'}`;
