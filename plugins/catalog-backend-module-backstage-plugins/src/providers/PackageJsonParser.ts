/*
 * Copyright 2023 The Backstage Authors
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

import { z } from 'zod';

import { BackstagePackageJson } from './types';

// @ts-expect-error all object props are optional unless strict ts compilation
export const PackageJson: z.ZodSchema<BackstagePackageJson> = z
  .object({
    name: z.string(),
    version: z.string(),
    description: z.string().optional(),
    backstage: z.object({
      role: z.string(),
    }),
    catalogInfo: z
      .object({
        apiVersion: z.string().optional(),
        kind: z.string().optional(),
        metadata: z.record(z.any()).optional(),
        spec: z.record(z.any()).optional(),
        relations: z
          .array(
            z.object({
              type: z.string(),
              targetRef: z.string(),
            }),
          )
          .optional(),
      })
      .optional(),
  })
  .passthrough();
