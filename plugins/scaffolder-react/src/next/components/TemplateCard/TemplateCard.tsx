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

import { createSwappableComponent } from '@backstage/frontend-plugin-api';
import type { TemplateCardProps } from './TemplateCardImpl';

export type { TemplateCardProps } from './TemplateCardImpl';

/**
 * The `TemplateCard` component that is rendered in a list for each template.
 * Apps using the new frontend system can replace it by registering a
 * `SwappableComponentBlueprint` against `TemplateCard.ref`.
 *
 * @alpha
 */
export const TemplateCard = createSwappableComponent<TemplateCardProps>({
  id: 'scaffolder.templateCard',
  loader: () => import('./TemplateCardImpl').then(m => m.TemplateCardImpl),
});
