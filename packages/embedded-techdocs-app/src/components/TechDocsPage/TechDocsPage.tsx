/*
 * Copyright 2021 Spotify AB
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

import { Content } from '@backstage/core-components';

import {
  Reader,
  TechDocsPage,
  TechDocsPageHeader,
} from '@backstage/plugin-techdocs';

const DefaultTechDocsPage = () => {
  const techDocsMetadata = {
    site_name: 'Live preview environment',
    site_description: '',
  };

  return (
    <TechDocsPage>
      {({ entityRef, onReady }) => (
        <>
          <TechDocsPageHeader
            techDocsMetadata={techDocsMetadata}
            entityRef={entityRef}
          />
          <Content data-testid="techdocs-content">
            <Reader
              onReady={onReady}
              entityRef={entityRef}
              withSearch={false}
            />
          </Content>
        </>
      )}
    </TechDocsPage>
  );
};

export const techDocsPage = <DefaultTechDocsPage />;
