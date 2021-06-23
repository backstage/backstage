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

import { EntityName } from '@backstage/catalog-model';
import { Alert } from '@material-ui/lab';
import MDX from '@mdx-js/runtime';
import React from 'react';
import { useParams } from 'react-router-dom';
import { TechDocsNotFound } from './TechDocsNotFound';
import TechDocsProgressBar from './TechDocsProgressBar';
import { useReaderState } from './useReaderState';
import ToC from './ToC';

type Props = {
  entityId: EntityName;
  onReady?: () => void;
};

export const Reader = ({ entityId }: Props) => {
  const { kind, namespace, name } = entityId;
  const { '*': path } = useParams();

  const { state, raw: markdown, errorMessage, toc, baseUrl } = useReaderState(
    kind,
    namespace,
    name,
    path,
  );

  return (
    <>
      {(state === 'CHECKING' || state === 'INITIAL_BUILD') && (
        <TechDocsProgressBar />
      )}
      {state === 'CONTENT_STALE_REFRESHING' && (
        <Alert variant="outlined" severity="info">
          A newer version of this documentation is being prepared and will be
          available shortly.
        </Alert>
      )}
      {state === 'CONTENT_STALE_READY' && (
        <Alert variant="outlined" severity="success">
          A newer version of this documentation is now available, please refresh
          to view.
        </Alert>
      )}
      {state === 'CONTENT_STALE_TIMEOUT' && (
        <Alert variant="outlined" severity="warning">
          Building a newer version of this documentation took longer than
          expected. Please refresh to try again.
        </Alert>
      )}
      {state === 'CONTENT_STALE_ERROR' && (
        <Alert variant="outlined" severity="error">
          Building a newer version of this documentation failed. {errorMessage}
        </Alert>
      )}
      {state === 'CONTENT_NOT_FOUND' && (
        <TechDocsNotFound errorMessage={errorMessage} />
      )}

      <MDX data-testid="techdocs-content-shadowroot">{markdown}</MDX>
      {toc && (
        <ToC toc={(toc as { nav: object }).nav} baseUrl={baseUrl || '/'} />
      )}
    </>
  );
};
