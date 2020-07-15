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
// /*
//  * Copyright 2020 Spotify AB
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */

import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Link } from '@material-ui/core';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import GitHubIcon from '@material-ui/icons/GitHub';

import LanguageIcon from '@material-ui/icons/Language';

import ToolsCardActionsComponent from '../ToolsCardActionsComponent';

type Props = {
  tool: Tools;
};

const useStyles = makeStyles({
  card: {
    maxWidth: 345,
    minHeight: 400,
  },
  cardActions: {
    display: 'block',
  },
  toolsCardActions: {
    marginLeft: 8,
    marginBottom: 10,
  },
  link: {
    color: 'black',
    paddingRight: 5,
    float: 'right',
  },
  media: {
    height: 130,
    paddingTop: 10,
    paddingBottom: 10,
    objectFit: 'contain',
    backgroundColor: '#FFFFFF',
  },
});

const ToolsCardComponent: FC<Props> = props => {
  const classes = useStyles(props);
  const { tool } = props;

  return (
    <Grid item>
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            component="img"
            className={classes.media}
            image={`https://easylo.github.io/project-resources/${tool.src}`}
            title={tool.caption}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {tool.homepage!.length > 0 ? (
                <Link
                  className={classes.link}
                  target="_blank"
                  href={tool.homepage}
                >
                  <LanguageIcon />
                </Link>
              ) : (
                ''
              )}
              {tool.scm!.length > 0 ? (
                <Link className={classes.link} target="_blank" href={tool.scm}>
                  <GitHubIcon />
                </Link>
              ) : (
                ''
              )}

              {tool.type}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {tool.caption}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions className={classes.cardActions}>
          {tool.actions.map(action => (
            <ToolsCardActionsComponent
              action={action}
              className={classes.toolsCardActions}
            />
          ))}
        </CardActions>
      </Card>
    </Grid>
  );
};

export default ToolsCardComponent;
