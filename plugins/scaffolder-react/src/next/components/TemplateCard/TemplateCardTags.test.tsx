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

import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { renderInTestApp } from '@backstage/test-utils';
import { lightTheme } from '@backstage/theme';
import { TemplateCardTags } from './TemplateCardTags';

describe('TemplateCardTags', () => {
  it('uses info color for the new tag', async () => {
    const template: TemplateEntityV1beta3 = {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      kind: 'Template',
      metadata: {
        name: 'sample',
        tags: ['new', 'other'],
      },
      spec: {
        type: 'service',
        steps: [],
      },
    };

    const { getByTestId } = await renderInTestApp(
      <TemplateCardTags template={template} />,
    );

    expect(getByTestId('template-card-tag-chip-new')).toHaveStyle(
      `background-color: ${lightTheme.palette.info.dark}`,
    );

    const otherChip = getByTestId('template-card-tag-chip-other');
    expect(otherChip.getAttribute('style') ?? '').not.toContain(
      'background-color',
    );
  });
});
