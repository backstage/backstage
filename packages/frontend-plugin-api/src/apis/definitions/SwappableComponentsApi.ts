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

import { SwappableComponentRef } from '../../components';
import { createApiRef } from '../system';

/**
 * API for looking up components based on component refs.
 *
 * @public
 */
export interface SwappableComponentsApi {
  getComponent<
    TInnerComponentProps extends {},
    TExternalComponentProps extends {} = TInnerComponentProps,
  >(
    ref: SwappableComponentRef<TInnerComponentProps, TExternalComponentProps>,
  ): (props: TInnerComponentProps) => JSX.Element | null;
}

/**
 * The `ApiRef` of {@link SwappableComponentsApi}.
 *
 * @public
 */
export const swappableComponentsApiRef = createApiRef<SwappableComponentsApi>({
  id: 'core.swappable-components',
});
