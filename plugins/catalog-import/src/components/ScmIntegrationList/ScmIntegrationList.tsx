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

import React from 'react';
import { ContentHeader, Progress } from '@backstage/core-components';
import { useApp } from '@backstage/core-plugin-api';
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  createStyles,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import CodeIcon from '@material-ui/icons/Code';
import { useScmIntegrations } from '../../hooks/useIntegrations';
import { Link } from 'react-router-dom';
import { getIntegrationTitle } from '../helpers';

const useStyles = makeStyles(() =>
  createStyles({
    icon: {
      marginTop: 5,
    },
  }),
);

const ScmIcon = ({ icon }: { icon: string }) => {
  const app = useApp();
  const classes = useStyles();
  const Icon = app.getSystemIcon(icon) ?? CodeIcon;
  return <Icon className={classes.icon} />;
};

const supportedTypes = ['github'];

export const ScmIntegrationList = () => {
  const { integrations, loading } = useScmIntegrations();

  if (loading) {
    return <Progress />;
  }

  return (
    <>
      <ContentHeader title="Where are the software components stored?" />
      <Grid container>
        {integrations.map((integration, index) => (
          <Grid item xs={8} key={index}>
            {supportedTypes.includes(integration.type) ? (
              <Card raised>
                <CardActionArea>
                  <Link to={`${integration.type}/${integration.title}`}>
                    <CardHeader
                      avatar={<ScmIcon icon={integration.type} />}
                      title={getIntegrationTitle(integration)}
                      titleTypographyProps={{ variant: 'h5' }}
                    />
                    <CardContent>
                      <Typography>
                        Import software components from {integration.title}
                      </Typography>
                    </CardContent>
                  </Link>
                </CardActionArea>
              </Card>
            ) : (
              <Card aria-disabled="true" style={{ opacity: 0.5 }}>
                <CardHeader
                  avatar={<ScmIcon icon={integration.type} />}
                  title={getIntegrationTitle(integration)}
                  titleTypographyProps={{ variant: 'h5' }}
                />
                <CardContent>
                  <Typography>Not yet supported</Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        ))}
      </Grid>
    </>
  );
};
