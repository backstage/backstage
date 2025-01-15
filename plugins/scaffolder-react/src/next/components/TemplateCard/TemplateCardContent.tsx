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

import { MarkdownContent } from '@backstage/core-components';
import type { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import React from 'react';

const useStyles = makeStyles(() => ({
  box: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 10,
    '-webkit-box-orient': 'vertical',
  },
  markdown: {
    /** to make the styles for React Markdown not leak into the description */
    '& :first-child': {
      margin: 0,
    },
  },
}));

/**
 * The Props for the {@link TemplateCardContent} component
 * @alpha
 */
export interface TemplateCardContentProps {
  template: TemplateEntityV1beta3;
}
export const TemplateCardContent = ({ template }: TemplateCardContentProps) => {
  const styles = useStyles();
  return (
    <Grid item xs={12} data-testid="template-card-content-grid">
      <Box className={styles.box} data-testid="template-card-content-container">
        <MarkdownContent
          className={styles.markdown}
          content={template.metadata.description ?? 'No description'}
        />
      </Box>
    </Grid>
  );
};
