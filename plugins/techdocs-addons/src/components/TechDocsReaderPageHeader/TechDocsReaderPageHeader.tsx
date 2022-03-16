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

import { Header } from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
// todo(backstage/techdocs-core): Export these from @backstage/plugin-techdocs
import { Skeleton } from '@material-ui/lab';
import React, { useEffect } from 'react';
import Helmet from 'react-helmet';

import { useTechDocsAddons } from '../../addons';
import { useTechDocsMetadata, useTechDocsReaderPage } from '../../context';
import { TechDocsAddonLocations as locations } from '../../types';

const skeleton = <Skeleton animation="wave" variant="text" height={40} />;

export const TechDocsReaderPageHeader = () => {
  const addons = useTechDocsAddons();
  const configApi = useApi(configApiRef);

  const { value: metadata } = useTechDocsMetadata();

  const { title, setTitle, subtitle, setSubtitle } = useTechDocsReaderPage();

  useEffect(() => {
    if (!metadata) return;
    setTitle(prevTitle => prevTitle || metadata.site_name);
    setSubtitle(
      prevSubtitle => prevSubtitle || metadata.site_description || 'Home',
    );
  }, [metadata, setTitle, setSubtitle]);

  const appTitle = configApi.getOptional('app.title') || 'Backstage';
  const tabTitle = [subtitle, title, appTitle].filter(Boolean).join(' | ');

  return (
    <Header
      type="Documentation"
      title={title || skeleton}
      subtitle={subtitle || skeleton}
    >
      <Helmet titleTemplate="%s">
        <title>{tabTitle}</title>
      </Helmet>
      {addons.renderComponentsByLocation(locations.HEADER)}
    </Header>
  );
};
