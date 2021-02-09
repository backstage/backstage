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
import { Entity, ENTITY_DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { Content, Header, HeaderLabel, Page, Progress } from '@backstage/core';
import { Box } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { PropsWithChildren, useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  EntityContext,
  useEntityCompoundName,
} from '@backstage/plugin-catalog-react';
import { EntityContextMenu } from '../EntityContextMenu/EntityContextMenu';
import { FavouriteEntity } from '../FavouriteEntity/FavouriteEntity';
import { UnregisterEntityDialog } from '../UnregisterEntityDialog/UnregisterEntityDialog';

import { Tabbed } from './Tabbed';

const EntityPageTitle = ({
  entity,
  title,
}: {
  title: string;
  entity: Entity | undefined;
}) => (
  <Box display="inline-flex" alignItems="center" height="1em">
    {title}
    {entity && <FavouriteEntity entity={entity} />}
  </Box>
);

const headerProps = (
  kind: string,
  namespace: string | undefined,
  name: string,
  entity: Entity | undefined,
): { headerTitle: string; headerType: string } => {
  return {
    headerTitle: `${name}${
      namespace && namespace !== ENTITY_DEFAULT_NAMESPACE
        ? ` in ${namespace}`
        : ''
    }`,
    headerType: (() => {
      let t = kind.toLowerCase();
      if (entity && entity.spec && 'type' in entity.spec) {
        t += ' — ';
        t += (entity.spec as { type: string }).type.toLowerCase();
      }
      return t;
    })(),
  };
};

export const EntityPageLayout = ({ children }: PropsWithChildren<{}>) => {
  const { kind, namespace, name } = useEntityCompoundName();
  const { entity, loading, error } = useContext(EntityContext);
  const { headerTitle, headerType } = headerProps(
    kind,
    namespace,
    name,
    entity!,
  );

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const navigate = useNavigate();
  const cleanUpAfterRemoval = async () => {
    setConfirmationDialogOpen(false);
    navigate('/');
  };

  const showRemovalDialog = () => setConfirmationDialogOpen(true);

  return (
    <Page themeId={entity?.spec?.type?.toString() ?? 'home'}>
      <Header
        title={<EntityPageTitle title={headerTitle} entity={entity!} />}
        pageTitleOverride={headerTitle}
        type={headerType}
      >
        {/* TODO: fix after catalog page customization is added */}
        {entity && kind !== 'user' && (
          <>
            <HeaderLabel
              label="Owner"
              value={entity.spec?.owner || 'unknown'}
            />
            <HeaderLabel
              label="Lifecycle"
              value={entity.spec?.lifecycle || 'unknown'}
            />
            <EntityContextMenu onUnregisterEntity={showRemovalDialog} />
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
      <UnregisterEntityDialog
        open={confirmationDialogOpen}
        entity={entity!}
        onConfirm={cleanUpAfterRemoval}
        onClose={() => setConfirmationDialogOpen(false)}
      />
    </Page>
  );
};
EntityPageLayout.Content = Tabbed.Content;
