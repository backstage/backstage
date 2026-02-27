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

import { CheckboxGroup } from './CheckboxGroup';
import { Checkbox } from '../Checkbox/Checkbox';

export default {
  title: 'BACKSTAGE UI/CheckboxGroup',
  component: CheckboxGroup,
};

export const Default = () => (
  <CheckboxGroup>
    <Checkbox value="option1">Option 1</Checkbox>
    <Checkbox value="option2">Option 2</Checkbox>
    <Checkbox value="option3">Option 3</Checkbox>
  </CheckboxGroup>
);
