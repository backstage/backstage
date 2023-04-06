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

import { default as variables } from './variables';
import { default as reset } from './reset';
import { default as layout } from './layout';
import { default as typeset } from './typeset';
import { default as animations } from './animations';
import { default as extensions } from './extensions';

/**
 * A list of style rules that will be applied to an element in the order they were added.
 *
 * @remarks
 * The order of items is important, which means that a rule can override any other rule previously added to the list,
 * i.e. the rules will be applied from the first added to the last added.
 */
export const rules = [
  variables,
  reset,
  layout,
  typeset,
  animations,
  extensions,
];
