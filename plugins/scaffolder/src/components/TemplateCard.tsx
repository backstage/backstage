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
import React, { FC } from 'react';
import {
  Button,
  Card,
  Chip,
  Grid,
  Typography,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  header: {
    color: theme.palette.common.white,
    padding: theme.spacing(2, 2, 6),
    backgroundImage:
      'linear-gradient(-137deg, rgb(25, 230, 140) 0%, rgb(29, 127, 110) 100%)',
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

type TemplateCardProps = {
  description: string;
  tags: string[];
  title: string;
  type: string;
};
const TemplateCard: FC<TemplateCardProps> = ({
  description,
  tags,
  title,
  type,
}) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card>
        <div className={classes.header}>
          <Typography variant="subtitle2">{type}</Typography>
          <Typography variant="h6">{title}</Typography>
        </div>
        <div className={classes.content}>
          {tags?.map(tag => (
            <Chip label={tag} />
          ))}
          <Typography variant="body2" paragraph className={classes.description}>
            {description}
          </Typography>
          <div className={classes.footer}>
            <Button color="primary">Choose</Button>
          </div>
        </div>
      </Card>
    </Grid>
  );
};

export default TemplateCard;
