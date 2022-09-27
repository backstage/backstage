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
import {
  DEFAULT_NAMESPACE,
  parseEntityRef,
  RELATION_OWNED_BY,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { Button, MarkdownContent, UserIcon } from '@backstage/core-components';
import { IconComponent, useApp, useRouteRef } from '@backstage/core-plugin-api';
import {
  EntityRefLinks,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { BackstageTheme } from '@backstage/theme';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Grid,
  makeStyles,
} from '@material-ui/core';
import LanguageIcon from '@material-ui/icons/Language';
import React from 'react';
import {
  nextSelectedTemplateRouteRef,
  viewTechDocRouteRef,
} from '../../../routes';
import { CardHeader } from './CardHeader';
import { CardLink } from './CardLink';

const useStyles = makeStyles<BackstageTheme>(theme => ({
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
 * The Props for the Template Card component
 * @alpha
 */
export interface TemplateCardProps {
  template: TemplateEntityV1beta3;
  deprecated?: boolean;
}

/**
 * The Template Card component that is rendered in a list for each template
 * @alpha
 */
export const TemplateCard = (props: TemplateCardProps) => {
  const { template } = props;
  const styles = useStyles();
  const ownedByRelations = getEntityRelations(template, RELATION_OWNED_BY);
  const templateRoute = useRouteRef(nextSelectedTemplateRouteRef);
  const { name, namespace } = parseEntityRef(
    stringifyEntityRef(props.template),
  );
  const href = templateRoute({
    templateName: name,
    namespace: namespace,
  });

  const app = useApp();
  const iconResolver = (key?: string): IconComponent =>
    key ? app.getSystemIcon(key) ?? LanguageIcon : LanguageIcon;

  // TechDocs Link
  const viewTechDoc = useRouteRef(viewTechDocRouteRef);
  const viewTechDocsAnnotation =
    template.metadata.annotations?.['backstage.io/techdocs-ref'];
  const viewTechDocsLink =
    !!viewTechDocsAnnotation &&
    !!viewTechDoc &&
    viewTechDoc({
      namespace: template.metadata.namespace || DEFAULT_NAMESPACE,
      kind: template.kind,
      name: template.metadata.name,
    });

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
          {(template.metadata.tags?.length ?? 0) > 0 && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {template.metadata.tags?.map(tag => (
                    <Grid item>
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
          {(!!viewTechDocsLink || template.metadata.links?.length) && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {viewTechDocsLink && (
                    <Grid className={styles.linkText} item xs={6}>
                      <CardLink
                        icon={iconResolver('docs')}
                        text="View TechDocs"
                        url={viewTechDocsLink}
                      />
                    </Grid>
                  )}
                  {template.metadata.links?.map(({ url, icon, title }) => (
                    <Grid className={styles.linkText} item xs={6}>
                      <CardLink
                        icon={iconResolver(icon)}
                        text={title || url}
                        url={url}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
      <CardActions style={{ padding: '16px' }}>
        <div className={styles.footer}>
          <div className={styles.ownedBy}>
            {ownedByRelations.length > 0 && (
              <>
                <UserIcon fontSize="small" />
                <EntityRefLinks
                  style={{ marginLeft: '8px' }}
                  entityRefs={ownedByRelations}
                  defaultKind="Group"
                />
              </>
            )}
          </div>
          <Button size="small" variant="outlined" color="primary" to={href}>
            Choose
          </Button>
        </div>
      </CardActions>
    </Card>
  );
};
