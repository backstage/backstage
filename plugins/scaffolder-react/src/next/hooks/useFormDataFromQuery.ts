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

import { JsonValue } from '@backstage/types';
import qs from 'qs';
import { useState } from 'react';

/**
 * This hook is used to get the formData from the query string.
 * @alpha
 */
export const useFormDataFromQuery = (
  initialState?: Record<string, JsonValue>,
) => {
  return useState<Record<string, any>>(() => {
    if (initialState) {
      return initialState;
    }

    const query = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });

    try {
      return JSON.parse(query.formData as string);
    } catch (e) {
      return {};
    }
  });
};
