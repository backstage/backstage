/*
 * Copyright 2021 The Backstage Authors
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

import { parseEntityRef } from '@backstage/catalog-model';
import { entityRouteRef } from '@backstage/plugin-catalog-react';
import { Box } from '@material-ui/core';
import LanguageIcon from '@material-ui/icons/Language';
import React from 'react';
import { ScaffolderTaskOutput } from '@backstage/plugin-scaffolder-react';
import { IconLink } from './IconLink';
import { IconComponent, useApp, useRouteRef } from '@backstage/core-plugin-api';

type TaskPageLinksProps = {
  output: ScaffolderTaskOutput;
};

export const TaskPageLinks = ({ output }: TaskPageLinksProps) => {
  const { links = [] } = output;
  const app = useApp();
  const entityRoute = useRouteRef(entityRouteRef);

  const iconResolver = (key?: string): IconComponent =>
    key ? app.getSystemIcon(key) ?? LanguageIcon : LanguageIcon;

  return (
    <Box px={3} pb={3}>
      {links
        .filter(({ url, entityRef }) => url || entityRef)
        .map(({ url, entityRef, title, icon }) => {
          if (entityRef) {
            const entityName = parseEntityRef(entityRef, {
              defaultKind: '<unknown>',
              defaultNamespace: '<unknown>',
            });
            const target = entityRoute(entityName);
            return { title, icon, url: target };
          }
          return { title, icon, url: url! };
        })
        .map(({ url, title, icon }, i) => (
          <IconLink
            key={`output-link-${i}`}
            href={url}
            text={title ?? url}
            Icon={iconResolver(icon)}
            target="_blank"
          />
        ))}
    </Box>
  );
};
