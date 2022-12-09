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
import React from 'react';
import * as ps from 'platformscript';

export const Fragment = ps.fn(
  function* Fragment({ arg, env }) {
    const $arg = yield* env.eval(arg);

    let elements: ps.PSValue[];
    if ($arg.type === 'list') {
      elements = $arg.value;
    } else {
      elements = [$arg.value];
    }

    const children = elements.map((psValue: { value: any }, i: number) => ({
      ...psValue.value,
      key: psValue.value.key !== null ? psValue.value.key : i,
    }));

    return ps.external(React.createElement(React.Fragment, null, children));
  },
  { name: '' },
);
