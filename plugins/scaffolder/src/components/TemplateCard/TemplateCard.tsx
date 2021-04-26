/*
 * Copyright 2020 Spotify AB
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
import { Button, ItemCardHeader, useRouteRef } from '@backstage/core';
import { BackstageTheme, pageTheme } from '@backstage/theme';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  makeStyles,
  useTheme,
} from '@material-ui/core';
import React from 'react';
import { generatePath } from 'react-router';
import { rootRouteRef } from '../../routes';
import { Entity } from '@backstage/catalog-model';
import { FavouriteTemplate } from '../FavouriteTemplate/FavouriteTemplate';

const useStyles = makeStyles({
  cardHeader: {
    position: 'relative',
  },
  title: {
    backgroundImage: ({ backgroundImage }: any) => backgroundImage,
  },
  description: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 10,
    '-webkit-box-orient': 'vertical',
  },
});

export type TemplateCardProps = {
  description: string;
  tags: string[];
  title: string;
  type: string;
  name: string;
  entityTemplate: Entity;
};

export const TemplateCard = ({
  description,
  tags,
  title,
  type,
  name,
  entityTemplate,
}: TemplateCardProps) => {
  const backstageTheme = useTheme<BackstageTheme>();
  const rootLink = useRouteRef(rootRouteRef);

  const themeId = pageTheme[type] ? type : 'other';
  const theme = backstageTheme.getPageTheme({ themeId });
  const classes = useStyles({ backgroundImage: theme.backgroundImage });
  const href = generatePath(`${rootLink()}/templates/:templateName`, {
    templateName: name,
  });

  return (
    <Card>
      <CardMedia className={classes.cardHeader}>
        <FavouriteTemplate entity={entityTemplate} />
        <ItemCardHeader
          title={title}
          subtitle={type}
          classes={{ root: classes.title }}
        />
      </CardMedia>
      <CardContent>
        <Box>
          {tags?.map(tag => (
            <Chip size="small" label={tag} key={tag} />
          ))}
        </Box>
        <Box className={classes.description}>{description}</Box>
      </CardContent>
      <CardActions>
        <Button color="primary" to={href} aria-label={`Choose ${title} `}>
          Choose
        </Button>
      </CardActions>
    </Card>
  );
};
