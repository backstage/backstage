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

import * as yup from 'yup';
import { LocationSpec, Location } from './types';

/**
 * @public
 * @deprecated Use JSONSchema or validators instead.
 */
export const locationSpecSchema: yup.SchemaOf<LocationSpec> = yup
  .object({
    type: yup.string().required(),
    target: yup.string().required(),
    presence: yup.mixed().oneOf(['required', 'optional']),
  })
  .noUnknown()
  .required();

/**
 * @public
 * @deprecated Use JSONSchema or validators instead.
 */
export const locationSchema: yup.SchemaOf<Location> = yup
  .object({
    id: yup.string().required(),
    type: yup.string().required(),
    target: yup.string().required(),
    presence: yup.mixed().oneOf(['required', 'optional']),
  })
  .noUnknown()
  .required();

/**
 * @public
 * @deprecated Use JSONSchema or validators instead.
 */
export const analyzeLocationSchema: yup.SchemaOf<{ location: LocationSpec }> =
  yup
    .object({
      location: locationSpecSchema,
    })
    .noUnknown()
    .required();
