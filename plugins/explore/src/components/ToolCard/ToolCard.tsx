/*
 * Copyright 2020 The Backstage Authors
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

import { ExploreTool } from '@backstage/plugin-explore-react';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { LinkButton } from '@backstage/core-components';
import classNames from 'classnames';
import React from 'react';

// TODO: Align styling between Domain and ToolCard

const useStyles = makeStyles<Theme>(
  theme => ({
    media: {
      height: 128,
    },
    mediaContain: {
      backgroundSize: 'contain',
    },
    lifecycle: {
      lineHeight: '0.8em',
      color: theme.palette.common.white,
    },
    ga: {
      backgroundColor: theme.palette.status.ok,
    },
    alpha: {
      backgroundColor: theme.palette.status.error,
    },
    beta: {
      backgroundColor: theme.palette.status.warning,
    },
  }),
  {
    name: 'ExploreToolCard',
  },
);

type Props = {
  card: ExploreTool;
  objectFit?: 'cover' | 'contain';
};

export const ToolCard = ({ card, objectFit }: Props) => {
  const classes = useStyles();

  const { title, description, url, image, lifecycle, tags } = card;

  return (
    <Card key={title}>
      <CardMedia
        image={image}
        title={title}
        className={classNames(classes.media, {
          [classes.mediaContain]: objectFit === 'contain',
        })}
      />
      <CardContent>
        <Typography variant="h5">
          {title}{' '}
          {lifecycle && lifecycle.toLocaleLowerCase('en-US') !== 'ga' && (
            <Chip
              size="small"
              label={lifecycle}
              className={classNames(
                classes.lifecycle,
                classes[lifecycle.toLocaleLowerCase('en-US')],
              )}
            />
          )}
        </Typography>
        <Typography>{description || 'Description missing'}</Typography>
        {tags && (
          <Box marginTop={2}>
            {tags.map((item, idx) => (
              <Chip size="small" key={idx} label={item} />
            ))}
          </Box>
        )}
      </CardContent>
      <CardActions>
        <LinkButton color="primary" to={url} disabled={!url}>
          Explore
        </LinkButton>
      </CardActions>
    </Card>
  );
};
