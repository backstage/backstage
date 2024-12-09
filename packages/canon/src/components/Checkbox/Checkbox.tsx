/*
 * Copyright 2024 The Backstage Authors
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
import React from 'react';

import { CheckboxRoot, CheckboxIndicator } from '@base_ui/react';
import { Icon } from '@backstage/canon';

export const Checkbox = () => {
  return (
    <label className="checkbox-label">
      <CheckboxRoot className="checkbox">
        <CheckboxIndicator className="checkbox-indicator">
          <Icon name="check" size={12} />
        </CheckboxIndicator>
      </CheckboxRoot>
      Label
    </label>
  );
};
