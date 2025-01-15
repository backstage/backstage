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
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import React from 'react';

/**
 * The Props for the {@link TemplateCardTags} component
 * @alpha
 */
export interface TemplateCardTagsProps {
  template: TemplateEntityV1beta3;
}
export const TemplateCardTags = ({ template }: TemplateCardTagsProps) => (
  <>
    <Grid item xs={12}>
      <Divider data-testid="template-card-separator--tags" />
    </Grid>
    <Grid item xs={12}>
      <Grid container spacing={2} data-testid="template-card-tags">
        {template.metadata.tags?.map(tag => (
          <Grid
            key={`grid-${tag}`}
            item
            data-testid={`template-card-tag-item-${tag}`}
          >
            <Chip
              style={{ margin: 0 }}
              size="small"
              data-testid={`template-card-tag-chip-${tag}`}
              label={tag}
              key={tag}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  </>
);
