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
import { Button, Card, Chip, makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { Link } from '../../components';

const useStyles = makeStyles(theme => ({
  header: {
    color: theme.palette.common.white,
    padding: theme.spacing(2, 2, 6),
    backgroundImage: 'linear-gradient(-137deg,  #4BB8A5 0%,  #187656 100%)',
  },
  content: {
    padding: theme.spacing(2),
  },
  description: {
    height: 175,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  withTags: {
    height: 'calc(175px - 32px - 8px)',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
}));

type ItemCardProps = {
  description?: string;
  tags?: string[];
  title: string;
  type?: string;
  label: string;
  onClick?: () => void;
  href?: string;
};

export const ItemCard = ({
  description,
  tags,
  title,
  type,
  label,
  onClick,
  href,
}: ItemCardProps) => {
  const classes = useStyles();

  return (
    <Card>
      <div className={classes.header}>
        {type ?? <Typography variant="subtitle2">{type}</Typography>}
        <Typography variant="h6">{title}</Typography>
      </div>
      <div className={classes.content}>
        {tags?.map((tag, i) => (
          <Chip label={tag} key={`tag-${i}`} />
        ))}
        <Typography
          variant="body2"
          paragraph
          className={clsx(
            classes.description,
            tags && tags.length > 0 && classes.withTags,
          )}
        >
          {description}
        </Typography>
        <div className={classes.footer}>
          {!href && (
            <Button onClick={onClick} color="primary">
              {label}
            </Button>
          )}
          {href && (
            <Button component={Link} to={href} color="primary">
              {label}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
