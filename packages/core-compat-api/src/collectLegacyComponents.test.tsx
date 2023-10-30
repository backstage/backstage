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

import React from 'react';

import { collectLegacyComponents } from './collectLegacyComponents';

describe('collectLegacyComponents', () => {
  const components = {
    Progress: () => <div>Progress</div>,
    BootErrorPage: () => <div>BootErrorPage</div>,
    NotFoundErrorPage: () => <div>NotFoundErrorPage</div>,
    ErrorBoundaryFallback: () => <div>ErrorBoundaryFallback</div>,
  };

  it('should collect legacy routes', () => {
    const collected = collectLegacyComponents(components);

    expect(
      collected.map(p => ({
        id: p.id,
        attachTo: p.attachTo,
        disabled: p.disabled,
      })),
    ).toEqual([
      {
        id: 'core.components.progress',
        attachTo: { id: 'core', input: 'components' },
        disabled: false,
      },
      {
        id: 'core.components.bootErrorPage',
        attachTo: { id: 'core', input: 'components' },
        disabled: false,
      },
      {
        id: 'core.components.notFoundErrorPage',
        attachTo: { id: 'core', input: 'components' },
        disabled: false,
      },
      {
        id: 'core.components.errorBoundaryFallback',
        attachTo: { id: 'core', input: 'components' },
        disabled: false,
      },
    ]);
  });
});
