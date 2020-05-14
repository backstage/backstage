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
import React, { FC, useState } from 'react';
import { useAsync } from 'react-use';
import { ComponentFactory } from '../../data/component';
import ComponentMetadataCard from '../ComponentMetadataCard/ComponentMetadataCard';
import { Typography } from '@material-ui/core';
import { InfoCard, Content, Header, pageTheme, Page } from '@backstage/core';
import ComponentContextMenu from '../ComponentContextMenu/ComponentContextMenu';
import ComponentRemovalDialog from '../ComponentRemovalDialog/ComponentRemovalDialog';

type ComponentPageProps = {
  componentFactory: ComponentFactory;
  match: {
    params: {
      name: string;
    };
  };
  history: {
    push: (url: string) => void;
  };
};

const ComponentPage: FC<ComponentPageProps> = ({
  match,
  history,
  componentFactory,
}) => {
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [removingPending, setRemovingPending] = useState(false);
  const showRemovalDialog = () => setConfirmationDialogOpen(true);
  const hideRemovalDialog = () => setConfirmationDialogOpen(false);
  const componentName = match.params.name;

  if (componentName === '') {
    history.push('/catalog');
    return null;
  }

  const catalogRequest = useAsync(() =>
    componentFactory.getComponentByName(match.params.name),
  );

  const removeComponent = async () => {
    setConfirmationDialogOpen(false);
    setRemovingPending(true);
    await componentFactory.removeComponentByName(componentName);
    history.push('/catalog');
  };

  return (
    <Page theme={pageTheme.home}>
      <Header title="Catalog" subtitle="Your components">
        <ComponentContextMenu onUnregisterComponent={showRemovalDialog} />
      </Header>
      {confirmationDialogOpen && catalogRequest.value && (
        <ComponentRemovalDialog
          component={catalogRequest.value}
          onClose={hideRemovalDialog}
          onConfirm={removeComponent}
          onCancel={hideRemovalDialog}
        />
      )}
      <Content>
        {catalogRequest.error ? (
          <InfoCard>
            <Typography variant="subtitle1" paragraph>
              Error encountered while fetching component metadata.
            </Typography>
          </InfoCard>
        ) : (
          <ComponentMetadataCard
            loading={catalogRequest.loading || removingPending}
            component={catalogRequest.value}
          />
        )}
      </Content>
    </Page>
  );
};
export default ComponentPage;
