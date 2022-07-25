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

import React, { MouseEvent, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';

import { Link } from '@material-ui/core';

import {
  techdocsStorageApiRef,
  useTechDocsReaderPage,
  useTechDocsReaderPageContent,
} from '@backstage/plugin-techdocs-react';
import { useApi } from '@backstage/core-plugin-api';
import { useTechDocsRoute } from '../hooks';

const A = ({ href = '', download, children }: JSX.IntrinsicElements['a']) => {
  const navigate = useNavigate();
  const techdocsRoute = useTechDocsRoute();

  // if link is external, add target to open in a new window or tab
  const target = useMemo(() => {
    return href.match(/^https?:\/\//i) ? '_blank' : undefined;
  }, [href]);

  const { entityRef } = useTechDocsReaderPage();
  const { path } = useTechDocsReaderPageContent();
  const techdocsStorageApi = useApi(techdocsStorageApiRef);

  const { value } = useAsync(async () => {
    if (!download) {
      return window.location.origin.concat(techdocsRoute(href));
    }
    return await techdocsStorageApi.getBaseUrl(href, entityRef, path);
  }, [href, download, path, entityRef, techdocsRoute, techdocsStorageApi]);

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (!value || target) return;

      event.preventDefault();

      const { pathname, hash } = new URL(value.replace('.md', ''));
      const url = pathname.concat(hash);

      // detect if CTRL or META keys are pressed
      // so that links can be opened in a new tab
      if (event.ctrlKey || event.metaKey) {
        window.open(url, '_blank');
        return;
      }

      navigate(url);
    },
    [value, target, navigate],
  );

  return value ? (
    <Link
      target={target}
      download={download}
      href={value}
      onClick={handleClick}
    >
      {children}
    </Link>
  ) : null;
};

export { A as a };
