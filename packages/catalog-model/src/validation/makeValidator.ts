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

import { KubernetesValidatorFunctions } from './KubernetesValidatorFunctions';
import { Validators } from './types';

const defaultValidators: Validators = {
  isValidApiVersion: KubernetesValidatorFunctions.isValidApiVersion,
  isValidKind: KubernetesValidatorFunctions.isValidKind,
  isValidEntityName: KubernetesValidatorFunctions.isValidObjectName,
  isValidNamespace: KubernetesValidatorFunctions.isValidNamespace,
  isValidLabelKey: KubernetesValidatorFunctions.isValidLabelKey,
  isValidLabelValue: KubernetesValidatorFunctions.isValidLabelValue,
  isValidAnnotationKey: KubernetesValidatorFunctions.isValidAnnotationKey,
  isValidAnnotationValue: KubernetesValidatorFunctions.isValidAnnotationValue,
  isValidTag: (value: unknown): boolean => {
    // NOTE(freben): This one is a bit of an oddball and doesn't fit well anywhere to delegate to, so it's just inlined for now.
    return (
      typeof value === 'string' &&
      value.length >= 1 &&
      value.length <= 63 &&
      /^[a-z0-9:+#]+(\-[a-z0-9:+#]+)*$/.test(value)
    );
  },
};

/**
 * Creates a {@link Validators} object from `overrides`, with default values taken from {@link KubernetesValidatorFunctions}
 *
 * @public
 */
export function makeValidator(overrides: Partial<Validators> = {}): Validators {
  return {
    ...defaultValidators,
    ...overrides,
  };
}
