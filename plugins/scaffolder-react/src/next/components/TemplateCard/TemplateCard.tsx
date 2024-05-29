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
import { MarkdownContent, UserIcon } from '@backstage/core-components';
import {
  IconComponent,
  useAnalytics,
  useApp,
} from '@backstage/core-plugin-api';
import {
  EntityRefLinks,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';
import LanguageIcon from '@material-ui/icons/Language';
import React, { useCallback } from 'react';
import { CardHeader } from './CardHeader';
import { CardLink } from './CardLink';
import { usePermission } from '@backstage/plugin-permission-react';
import { taskCreatePermission } from '@backstage/plugin-scaffolder-common/alpha';

const useStyles = makeStyles<Theme>(theme => ({
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
  label: {
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    lineHeight: 1,
    fontSize: '0.75rem',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
  },
  ownedBy: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    color: theme.palette.link,
  },
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
  const { onSelected, template } = props;
  const styles = useStyles();
  const analytics = useAnalytics();
  const ownedByRelations = getEntityRelations(template, RELATION_OWNED_BY);
  const app = useApp();
  const iconResolver = (key?: string): IconComponent =>
    key ? app.getSystemIcon(key) ?? LanguageIcon : LanguageIcon;
  const hasTags = !!template.metadata.tags?.length;
  const hasLinks =
    !!props.additionalLinks?.length || !!template.metadata.links?.length;
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
      <CardHeader template={template} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box className={styles.box}>
              <MarkdownContent
                className={styles.markdown}
                content={template.metadata.description ?? 'No description'}
              />
            </Box>
          </Grid>
          {displayDefaultDivider && (
            <Grid item xs={12}>
              <Divider data-testid="template-card-separator" />
            </Grid>
          )}
          {hasTags && (
            <>
              <Grid item xs={12}>
                <Divider data-testid="template-card-separator--tags" />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {template.metadata.tags?.map(tag => (
                    <Grid key={`grid-${tag}`} item>
                      <Chip
                        style={{ margin: 0 }}
                        size="small"
                        label={tag}
                        key={tag}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </>
          )}
          {hasLinks && (
            <>
              <Grid item xs={12}>
                <Divider data-testid="template-card-separator--links" />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {props.additionalLinks?.map(({ icon, text, url }, index) => (
                    <Grid className={styles.linkText} item xs={6} key={index}>
                      <CardLink icon={icon} text={text} url={url} />
                    </Grid>
                  ))}
                  {template.metadata.links?.map(
                    ({ url, icon, title }, index) => (
                      <Grid className={styles.linkText} item xs={6} key={index}>
                        <CardLink
                          icon={iconResolver(icon)}
                          text={title || url}
                          url={url}
                        />
                      </Grid>
                    ),
                  )}
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
      <CardActions style={{ padding: '16px', flex: 1, alignItems: 'flex-end' }}>
        <div className={styles.footer}>
          <div className={styles.ownedBy}>
            {ownedByRelations.length > 0 && (
              <>
                <UserIcon fontSize="small" />
                <EntityRefLinks
                  style={{ marginLeft: '8px' }}
                  entityRefs={ownedByRelations}
                  defaultKind="Group"
                  hideIcons
                />
              </>
            )}
          </div>
          {canCreateTask ? (
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={handleChoose}
            >
              Choose
            </Button>
          ) : null}
        </div>
      </CardActions>
    </Card>
  );
};
