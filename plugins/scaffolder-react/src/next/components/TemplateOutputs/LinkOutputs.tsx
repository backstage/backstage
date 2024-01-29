/*
 * Copyright 2023 The Backstage Authors
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
import { IconComponent, useApp, useRouteRef } from '@backstage/core-plugin-api';
import { entityRouteRef } from '@backstage/plugin-catalog-react';
import { Button, makeStyles } from '@material-ui/core';
import React from 'react';
import LinkIcon from '@material-ui/icons/Link';
import { parseEntityRef } from '@backstage/catalog-model';
import { Link } from '@backstage/core-components';
import { ScaffolderTaskOutput } from '../../../api';

const useStyles = makeStyles({
  root: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
});

export const LinkOutputs = (props: { output: ScaffolderTaskOutput }) => {
  const { links = [] } = props.output;
  const classes = useStyles();
  const app = useApp();
  const entityRoute = useRouteRef(entityRouteRef);

  const iconResolver = (key?: string): IconComponent =>
    app.getSystemIcon(key!) ?? LinkIcon;

  return (
    <>
      {links
        .filter(({ url, entityRef }) => url || entityRef)
        .map(({ url, entityRef, title, icon }) => {
          if (entityRef) {
            const entityName = parseEntityRef(entityRef);
            const target = entityRoute(entityName);
            return { title, icon, url: target };
          }
          return { title, icon, url: url! };
        })
        .map(({ url, title, icon }, i) => {
          const Icon = iconResolver(icon);
          return (
            <Link to={url} key={i} classes={{ root: classes.root }}>
              <Button startIcon={<Icon />} component="div" color="primary">
                {title}
              </Button>
            </Link>
          );
        })}
    </>
  );
};
