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

import React, { useEffect } from 'react';

import { Card, CardContent } from '@material-ui/core';

import {
  techdocsPlugin,
  useShadowRootElements,
} from '@backstage/plugin-techdocs';
import {
  createTechDocsAddon,
  TechDocsAddonLocations,
} from '@backstage/techdocs-addons';
import { HeaderLabel } from '@backstage/core-components';

/**
 * Note: this is not typically how or where one might define such things. It
 * would more typically be exported/provided by a plugin!
 *
 * In fact, this whole file and usage should be deleted before we merge things
 * in. This is just a convenient way to test the addon framework in a nice
 * end-to-end way before releasing anything.
 */

export const ExampleHeader = techdocsPlugin.provide(
  createTechDocsAddon({
    name: 'ExampleHeader',
    location: TechDocsAddonLocations.HEADER,
    component: () => {
      return <HeaderLabel label="Label" value="Value" />;
    },
  }),
);

export const ExampleSubHeader = techdocsPlugin.provide(
  createTechDocsAddon({
    name: 'ExampleSubHeader',
    location: TechDocsAddonLocations.SUBHEADER,
    component: () => {
      return (
        <Card>
          <CardContent>Subheader.</CardContent>
        </Card>
      );
    },
  }),
);

export const ExamplePrimarySidebar = techdocsPlugin.provide(
  createTechDocsAddon({
    name: 'ExamplePrimarySidebar',
    location: TechDocsAddonLocations.PRIMARY_SIDEBAR,
    component: () => {
      return (
        <Card>
          <CardContent>Primary Sidebar.</CardContent>
        </Card>
      );
    },
  }),
);

export const ExampleSecondarySidebar = techdocsPlugin.provide(
  createTechDocsAddon({
    name: 'ExampleSecondarySidebar',
    location: TechDocsAddonLocations.SECONDARY_SIDEBAR,
    component: () => {
      return (
        <Card>
          <CardContent>Secondary Sidebar.</CardContent>
        </Card>
      );
    },
  }),
);

const ExampleContentComponent = () => {
  const h1 = useShadowRootElements(['h1'])[0];
  useEffect(() => {
    if (h1 && !h1.innerText.startsWith('Modified: ')) {
      h1.innerText = `Modified: ${h1.innerText}`;
    }
  }, [h1]);
  return null;
};

export const ExampleContent = techdocsPlugin.provide(
  createTechDocsAddon({
    name: 'ExampleContent',
    location: TechDocsAddonLocations.CONTENT,
    component: ExampleContentComponent,
  }),
);
