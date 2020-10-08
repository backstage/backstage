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
import React from 'react';
import { useParams } from 'react-router';

import {
  pageTheme,
  PageTheme,
  Page,
  Header,
  HeaderLabel,
  Content,
  Progress,
  useApi
} from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import { Box } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Tabbed } from './Tabbed';
import { catalogApiRef } from '@backstage/plugin-catalog'
import { useAsync } from 'react-use';


const getPageTheme = (entity?: Entity): PageTheme => {
  const themeKey = entity?.spec?.type?.toString() ?? 'home';
  return pageTheme[themeKey] ?? pageTheme.home;
};

const EntityPageTitle = ({
  title,
}: {
  title: string;
}) => (
  <Box display="inline-flex" alignItems="center" height="1em">
    {title}
  </Box>
);

function headerProps(
  kind: string,
  namespace: string | undefined,
  name: string,
  entity: Entity | undefined,
): { headerTitle: string; headerType: string } {
  return {
    headerTitle: `${name}${namespace ? ` in ${namespace}` : ''}`,
    headerType: (() => {
      let t = kind.toLowerCase();
      if (entity && entity.spec && 'type' in entity.spec) {
        t += ' — ';
        t += (entity.spec as { type: string }).type.toLowerCase();
      }
      return t;
    })(),
  };
}

export const EntityPageLayout = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const { optionalNamespaceAndName } = useParams() as {
    optionalNamespaceAndName: string;
  };
  const [name, namespace] = optionalNamespaceAndName.split(':').reverse();

  const catalogApi = useApi(catalogApiRef);

  const kind = "group";

  const { value: entity, error, loading } = useAsync(
    () => catalogApi.getEntityByName({ kind: kind, namespace, name }),
    [catalogApi, namespace, name],
  );

  const { headerTitle, headerType } = headerProps(
    kind,
    namespace,
    name,
    entity!,
  );

  return (
    <Page theme={getPageTheme(entity!)}>
      <Header
        title={<EntityPageTitle title={headerTitle} />}
        pageTitleOverride={headerTitle}
        type={headerType}
      >
        {entity && (
          <>
            <HeaderLabel
              label="Squad Leader"
              value={entity.spec?.owner || 'unknown'}
            />
          </>
        )}
      </Header>

      {loading && <Progress />}

      {entity && <Tabbed.Layout>{children}</Tabbed.Layout>}

      {error && (
        <Content>
          <Alert severity="error">{error.toString()}</Alert>
        </Content>
      )}
    </Page>
  );
};
EntityPageLayout.Content = Tabbed.Content;
