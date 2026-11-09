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

import { fireEvent, screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import { ManifestYaml } from './ManifestYaml';

describe('ManifestYaml', () => {
  it('hides managed fields until enabled without removing other resource data', async () => {
    const object = {
      metadata: { name: 'test-pod', managedFields: [{ manager: 'kubectl' }] },
      spec: { replicas: 2, managedFields: [{ manager: 'controller' }] },
    };

    const { container } = await renderInTestApp(
      <ManifestYaml object={object} />,
    );
    expect(container.textContent).toContain('test-pod');
    expect(container.textContent).toContain('replicas');
    expect(container.textContent).not.toContain('managedFields');

    fireEvent.click(screen.getByRole('checkbox'));
    expect(container.textContent).toContain('managedFields');
    expect(container.textContent).toContain('kubectl');
    expect(container.textContent).toContain('controller');
    expect(object.metadata.managedFields).toEqual([{ manager: 'kubectl' }]);
  });
});
