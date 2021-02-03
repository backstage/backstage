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

import { ExploreTool } from '@backstage/plugin-explore-react';
import { BackstageTheme } from '@backstage/theme';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  makeStyles,
  Typography,
} from '@material-ui/core';
import classNames from 'classnames';
import React from 'react';

// TODO: Align styling between Domain and ToolCard

const useStyles = makeStyles<BackstageTheme>(theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardActions: {
    flexGrow: 1,
    alignItems: 'flex-end',
  },
  media: {
    height: 128,
  },
  mediaContain: {
    backgroundSize: 'contain',
  },
  lifecycle: {
    lineHeight: '0.8em',
    color: 'white',
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
  domains: {
    position: 'relative',
    top: theme.spacing(2),
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
}));

type Props = {
  card: ExploreTool;
  objectFit?: 'cover' | 'contain';
};

export const ToolCard = ({ card, objectFit }: Props) => {
  const classes = useStyles();

  const { title, description, url, image, lifecycle, newsTag, tags } = card;

  return (
    <Card key={title} className={classes.card}>
      <CardMedia
        image={image}
        title={title}
        className={classNames(classes.media, {
          [classes.mediaContain]: objectFit === 'contain',
        })}
      />
      <CardContent>
        <Typography gutterBottom variant="h5">
          {title}{' '}
          {lifecycle && lifecycle.toLowerCase() !== 'ga' && (
            <Chip
              label={lifecycle}
              className={classNames(
                classes.lifecycle,
                classes[lifecycle.toLowerCase()],
              )}
            />
          )}
        </Typography>
        <Typography paragraph>
          {description || 'Description missing'}
        </Typography>
        {tags && (
          <div className={classes.domains}>
            {tags.map((item, idx) => (
              <Chip key={idx} label={item} />
            ))}
          </div>
        )}
      </CardContent>
      <CardActions
        className={classNames(classes.cardActions, {
          [classes.spaceBetween]: newsTag,
        })}
      >
        <Button size="small" color="primary" href={url} disabled={!url}>
          Explore
        </Button>
      </CardActions>
    </Card>
  );
};
