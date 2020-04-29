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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Link,
  Typography,
  withStyles,
} from '@material-ui/core';

import { cardLayoutStyles } from './CardLayoutStyles';

// import FollowNews from 'plugins/news/components/FollowNews';

export type Card = {
  title: string;
  description: string;
  url: string;
  image: string;
  tags?: string[];
  lifecycle?: string;
};

const styles = theme => ({
  ...cardLayoutStyles(theme),
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
});

class ExploreCard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    lifecycle: PropTypes.string,
    domains: PropTypes.arrayOf(PropTypes.string),
    tags: PropTypes.arrayOf(PropTypes.string),
    newsTag: PropTypes.string,
    description: PropTypes.string,
    objectFit: PropTypes.oneOf(['cover', 'contain']),
    url: PropTypes.string,
  };

  render() {
    const {
      classes,
      title,
      description,
      url,
      image,
      lifecycle,
      domains,
      newsTag,
      tags,
      objectFit = 'cover',
    } = this.props;
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
          <Typography component="p">
            {description || 'Description missing'}
          </Typography>
          {domains && (
            <div className={classes.domains}>
              {domains.map((item, idx) => (
                <Link key={idx} to={`/explore/infra/${item}`}>
                  <Chip label={item} clickable />
                </Link>
              ))}
            </div>
          )}
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
          {newsTag && <FollowNews tag={newsTag} />}
          <Button size="small" color="primary" href={url} disabled={!url}>
            Explore
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(ExploreCard);
