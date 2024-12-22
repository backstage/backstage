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

import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import { IconComponent, useAnalytics } from '@backstage/core-plugin-api';
import { getEntityRelations } from '@backstage/plugin-catalog-react';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { CardHeader } from './CardHeader';
import { usePermission } from '@backstage/plugin-permission-react';
import { taskCreatePermission } from '@backstage/plugin-scaffolder-common/alpha';
import { TemplateCardContent } from './TemplateCardContent';
import { TemplateCardTags } from './TemplateCardTags';
import { TemplateCardLinks } from './TemplateCardLinks';
import { TemplateCardActions } from './TemplateCardActions';

const useStyles = makeStyles<Theme>(() => ({
  actionContainer: { padding: '16px', flex: 1, alignItems: 'flex-end' },
}));

/**
 * The Props for the {@link TemplateCard} component
 * @alpha
 */
export interface TemplateCardProps {
  template: TemplateEntityV1beta3;
  additionalLinks?: {
    icon: IconComponent;
    text: string;
    url: string;
  }[];
  onSelected?: (template: TemplateEntityV1beta3) => void;
}

/**
 * The `TemplateCard` component that is rendered in a list for each template
 * @alpha
 */
export const TemplateCard = (props: TemplateCardProps) => {
  const { additionalLinks, onSelected, template } = props;
  const styles = useStyles();
  const analytics = useAnalytics();
  const ownedByRelations = getEntityRelations(template, RELATION_OWNED_BY);
  const hasTags = !!template.metadata.tags?.length;
  const hasLinks =
    !!additionalLinks?.length || !!template.metadata.links?.length;
  const displayDefaultDivider = !hasTags && !hasLinks;

  const { allowed: canCreateTask } = usePermission({
    permission: taskCreatePermission,
  });
  const handleChoose = useCallback(() => {
    analytics.captureEvent('click', `Template has been opened`);
    onSelected?.(template);
  }, [analytics, onSelected, template]);

  return (
    <Card>
      <CardHeader template={template} data-testid="template-card-header" />
      <CardContent>
        <Grid container spacing={2} data-testid="template-card-content">
          <TemplateCardContent template={template} />
          {displayDefaultDivider && (
            <Grid item xs={12}>
              <Divider data-testid="template-card-separator" />
            </Grid>
          )}
          {hasTags && <TemplateCardTags template={template} />}
          {hasLinks && (
            <TemplateCardLinks
              template={template}
              additionalLinks={additionalLinks}
            />
          )}
        </Grid>
      </CardContent>
      <CardActions
        className={styles.actionContainer}
        data-testid="template-card-actions"
      >
        <TemplateCardActions
          canCreateTask={canCreateTask}
          handleChoose={handleChoose}
          ownedByRelations={ownedByRelations}
        />
      </CardActions>
    </Card>
  );
};
