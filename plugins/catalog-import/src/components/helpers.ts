/*
 * Copyright 2021 The Backstage Authors
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

import { UseFormRegisterReturn } from 'react-hook-form';

/**
 * A helper that converts the result of a render('name', opts) to make it compatible with material-ui.
 *
 * See also https://github.com/react-hook-form/react-hook-form/issues/4629#issuecomment-815840872
 * TODO: remove when updating to material-ui v5 (https://github.com/mui-org/material-ui/pull/23174)
 *
 * @param renderResult - the result of a render('name', opts)
 */
export function asInputRef(renderResult: UseFormRegisterReturn) {
  const { ref, ...rest } = renderResult;
  return {
    inputRef: ref,
    ...rest,
  };
}
