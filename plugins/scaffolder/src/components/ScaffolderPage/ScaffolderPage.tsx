/*
 * Copyright 2020 The Backstage Authors
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

import {
  Content,
  ContentHeader,
  CreateButton,
  Header,
  Lifecycle,
  Page,
  SupportButton,
} from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import {
  EntityKindPicker,
  EntityListProvider,
  EntitySearchBar,
  EntityTagPicker,
  UserListPicker,
} from '@backstage/plugin-catalog-react';
import { makeStyles } from '@material-ui/core';
import React from 'react';
import { registerComponentRouteRef } from '../../routes';
import { TemplateList } from '../TemplateList';
import { TemplateTypePicker } from '../TemplateTypePicker';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'grid',
    gridTemplateAreas: "'filters' 'grid'",
    gridTemplateColumns: '250px 1fr',
    gridColumnGap: theme.spacing(2),
  },
}));

export type ScaffolderPageProps = {
  renderTemplateCard: Function | undefined;
};

export const ScaffolderPageContents = ({
  renderTemplateCard,
}: ScaffolderPageProps) => {
  const styles = useStyles();

  const registerComponentLink = useRouteRef(registerComponentRouteRef);

  return (
    <Page themeId="home">
      <Header
        pageTitleOverride="Create a New Component"
        title={
          <>
            Create a New Component <Lifecycle shorthand />
          </>
        }
        subtitle="Create new software components using standard templates"
      />
      <Content>
        <ContentHeader title="Available Templates">
          <CreateButton
            title="Register Existing Component"
            to={registerComponentLink && registerComponentLink()}
          />
          <SupportButton>
            Create new software components using standard templates. Different
            templates create different kinds of components (services, websites,
            documentation, ...).
          </SupportButton>
        </ContentHeader>

        <div className={styles.contentWrapper}>
          <div>
            <EntitySearchBar />
            <EntityKindPicker initialFilter="template" hidden />
            <UserListPicker
              initialFilter="all"
              availableFilters={['all', 'starred']}
            />
            <TemplateTypePicker />
            <EntityTagPicker />
          </div>
          <div>
            <TemplateList renderTemplateCard={renderTemplateCard} />
          </div>
        </div>
      </Content>
    </Page>
  );
};

export const ScaffolderPage = ({ renderTemplateCard }: ScaffolderPageProps) => (
  <EntityListProvider>
    <ScaffolderPageContents renderTemplateCard={renderTemplateCard} />
  </EntityListProvider>
);
