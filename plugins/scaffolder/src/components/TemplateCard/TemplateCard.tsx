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
import { Button, useRouteRef } from '@backstage/core';
import { BackstageTheme, pageTheme } from '@backstage/theme';
import {
  Card,
  CardActions,
  CardContent,
  Chip,
  makeStyles,
  Typography,
  useTheme,
} from '@material-ui/core';
import React from 'react';
import { generatePath } from 'react-router';
import { rootRouteRef } from '../../routes';

const useStyles = makeStyles(theme => ({
  header: {
    color: theme.palette.common.white,
    padding: theme.spacing(2, 2, 6),
    backgroundImage: (props: { backgroundImage: string }) =>
      props.backgroundImage,
    backgroundPosition: 0,
  },
  description: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 10,
    '-webkit-box-orient': 'vertical',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    flexGrow: 1,
  },
}));

export type TemplateCardProps = {
  description: string;
  tags: string[];
  title: string;
  type: string;
  name: string;
};

export const TemplateCard = ({
  description,
  tags,
  title,
  type,
  name,
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
    <Card className={classes.card}>
      <div className={classes.header}>
        <Typography variant="subtitle2">{type}</Typography>
        <Typography variant="h6">{title}</Typography>
      </div>
      <CardContent className={classes.cardContent}>
        {tags?.map(tag => (
          <Chip label={tag} key={tag} />
        ))}
        <Typography variant="body2" paragraph className={classes.description}>
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button color="primary" to={href}>
          Choose
        </Button>
      </CardActions>
    </Card>
  );
};
