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
import { Button } from '@backstage/core';
import { BackstageTheme, pageTheme } from '@backstage/theme';
import {
  Card,
  Chip,
  makeStyles,
  Typography,
  useTheme,
} from '@material-ui/core';
import React from 'react';
import { generatePath } from 'react-router-dom';
import { templateRoute } from '../../routes';

const useStyles = makeStyles(theme => ({
  header: {
    color: theme.palette.common.white,
    padding: theme.spacing(2, 2, 6),
    backgroundImage: (props: { backgroundImage: string }) =>
      props.backgroundImage,
    backgroundPosition: 0,
  },
  content: {
    padding: theme.spacing(2),
  },
  description: {
    height: 175,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row-reverse',
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

  const themeId = pageTheme[type] ? type : 'other';
  const theme = backstageTheme.getPageTheme({ themeId });
  const classes = useStyles({ backgroundImage: theme.backgroundImage });
  const href = generatePath(templateRoute.path, { templateName: name });

  return (
    <Card>
      <div className={classes.header}>
        <Typography variant="subtitle2">{type}</Typography>
        <Typography variant="h6">{title}</Typography>
      </div>
      <div className={classes.content}>
        {tags?.map(tag => (
          <Chip label={tag} key={tag} />
        ))}
        <Typography variant="body2" paragraph className={classes.description}>
          {description}
        </Typography>
        <div className={classes.footer}>
          <Button color="primary" to={href}>
            Choose
          </Button>
        </div>
      </div>
    </Card>
  );
};
