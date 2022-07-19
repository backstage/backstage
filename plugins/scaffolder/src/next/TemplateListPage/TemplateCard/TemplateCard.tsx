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
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  makeStyles,
} from '@material-ui/core';
import { CardHeader } from './CardHeader';
import { MarkdownContent, UserIcon, Button } from '@backstage/core-components';
import {
  parseEntityRef,
  RELATION_OWNED_BY,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  EntityRefLinks,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import { useRouteRef } from '@backstage/core-plugin-api';
import { selectedTemplateRouteRef } from '../../../routes';
import { BackstageTheme } from '@backstage/theme';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  box: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 10,
    '-webkit-box-orient': 'vertical',
    /** to make the styles for React Markdown not leak into the description */
    '& p:first-child': {
      marginTop: 0,
      marginBottom: theme.spacing(2),
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
  margin: {
    marginBottom: theme.spacing(2),
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
  const templateRoute = useRouteRef(selectedTemplateRouteRef);
  const { name, namespace } = parseEntityRef(stringifyEntityRef(template));
  const href = templateRoute({ templateName: name, namespace: namespace });

  return (
    <Card>
      <CardHeader template={template} />
      <CardContent>
        <Box className={styles.box}>
          <MarkdownContent
            content={template.metadata.description ?? 'No description'}
          />
        </Box>
        {(template.metadata.tags?.length ?? 0) > 0 && (
          <>
            <Divider className={styles.margin} />
            <Box>
              {template.metadata.tags?.map(tag => (
                <Chip size="small" label={tag} key={tag} />
              ))}
            </Box>
          </>
        )}
      </CardContent>
      <CardActions>
        <div className={styles.footer}>
          <div className={styles.ownedBy}>
            {ownedByRelations.length > 0 && (
              <>
                <UserIcon />
                <EntityRefLinks
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
