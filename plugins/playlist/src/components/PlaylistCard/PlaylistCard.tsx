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
  ItemCardHeader,
  LinkButton,
  MarkdownContent,
} from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import { EntityRefLinks } from '@backstage/plugin-catalog-react';
import { Playlist } from '@backstage/plugin-playlist-common';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import React from 'react';
import { playlistRouteRef } from '../../routes';

const useStyles = makeStyles(theme => ({
  cardHeader: {
    position: 'relative',
  },
  title: {
    backgroundImage: theme.getPageTheme({ themeId: 'home' }).backgroundImage,
  },
  box: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 10,
    '-webkit-box-orient': 'vertical',
    paddingBottom: '0.8em',
  },
  label: {
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    fontSize: '0.65rem',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    lineHeight: 1,
    paddingBottom: '0.2rem',
  },
  chip: {
    marginRight: 'auto',
  },
  privateIcon: {
    position: 'absolute',
    top: theme.spacing(0.5),
    right: theme.spacing(0.5),
    padding: '0.25rem',
  },
}));

export type PlaylistCardProps = {
  playlist: Playlist;
};

export const PlaylistCard = ({ playlist }: PlaylistCardProps) => {
  const classes = useStyles();
  const playlistRoute = useRouteRef(playlistRouteRef);

  return (
    <Card>
      <CardMedia className={classes.cardHeader}>
        {!playlist.public && (
          <Tooltip className={classes.privateIcon} title="Private">
            <LockIcon />
          </Tooltip>
        )}
        <ItemCardHeader title={playlist.name} classes={{ root: classes.title }}>
          <Chip
            size="small"
            variant="outlined"
            label={`${playlist.entities} entities`}
          />
          <Chip
            size="small"
            variant="outlined"
            label={`${playlist.followers} followers`}
          />
        </ItemCardHeader>
      </CardMedia>
      <CardContent style={{ display: 'grid' }}>
        <Box className={classes.box}>
          <Typography variant="body2" className={classes.label}>
            Description
          </Typography>
          {playlist.description && (
            <MarkdownContent content={playlist.description} />
          )}
        </Box>
        <Box className={classes.box}>
          <Typography variant="body2" className={classes.label}>
            Owner
          </Typography>
          <EntityRefLinks entityRefs={[playlist.owner]} defaultKind="group" />
        </Box>
      </CardContent>
      <CardActions>
        <LinkButton
          color="primary"
          aria-label={`Choose ${playlist.name}`}
          to={playlistRoute({ playlistId: playlist.id })}
        >
          Choose
        </LinkButton>
      </CardActions>
    </Card>
  );
};
