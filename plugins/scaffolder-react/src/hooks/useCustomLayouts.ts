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
import { LAYOUTS_KEY, LAYOUTS_WRAPPER_KEY } from '../layouts/keys';
import { LayoutOptions } from '../layouts';

/**
 * Hook that returns all custom field extensions from the current outlet.
 * @public
 */
export const useCustomLayouts = <TComponentDataType = LayoutOptions>(
  outlet: React.ReactNode,
) => {
  return useElementFilter(outlet, elements =>
    elements
      .selectByComponentData({
        key: LAYOUTS_WRAPPER_KEY,
      })
      .findComponentData<TComponentDataType>({
        key: LAYOUTS_KEY,
      }),
  );
};
