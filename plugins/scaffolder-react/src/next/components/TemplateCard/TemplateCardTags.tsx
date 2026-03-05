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

import type { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { Badge, Separator } from '@backstage/core-components';

/**
 * The Props for the {@link TemplateCardTags} component
 * @alpha
 */
export interface TemplateCardTagsProps {
  template: TemplateEntityV1beta3;
}
export const TemplateCardTags = ({ template }: TemplateCardTagsProps) => (
  <>
    <div className="col-span-full">
      <Separator data-testid="template-card-separator--tags" />
    </div>
    <div className="col-span-full">
      <div className="flex flex-wrap gap-2" data-testid="template-card-tags">
        {template.metadata.tags?.map(tag => (
          <div
            key={`grid-${tag}`}
            data-testid={`template-card-tag-item-${tag}`}
          >
            <Badge
              variant="secondary"
              className="m-0"
              data-testid={`template-card-tag-chip-${tag}`}
              key={tag}
            >
              {tag}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  </>
);
