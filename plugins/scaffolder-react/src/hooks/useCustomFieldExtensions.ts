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
import { useElementFilter } from '@backstage/core-plugin-api';
import { FieldExtensionOptions } from '../extensions';
import {
  FIELD_EXTENSION_KEY,
  FIELD_EXTENSION_WRAPPER_KEY,
} from '../extensions/keys';

/**
 * Hook that returns all custom field extensions from the current outlet.
 * @public
 */
export const useCustomFieldExtensions = <
  TComponentDataType = FieldExtensionOptions,
>(
  outlet: React.ReactNode,
) => {
  return useElementFilter(outlet, elements =>
    elements
      .selectByComponentData({
        key: FIELD_EXTENSION_WRAPPER_KEY,
      })
      .findComponentData<TComponentDataType>({
        key: FIELD_EXTENSION_KEY,
      }),
  );
};
