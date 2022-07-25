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

import React from 'react';
import useAsync from 'react-use/lib/useAsync';

import { makeStyles } from '@material-ui/core';

import {
  techdocsStorageApiRef,
  useTechDocsReaderPage,
  useTechDocsReaderPageContent,
} from '@backstage/plugin-techdocs-react';
import { useApi } from '@backstage/core-plugin-api';

const useStyles = makeStyles({
  root: {
    display: 'block',
    maxWidth: '100%',
  },
});

const getSvgText = (url: string) => {
  return fetch(url, { credentials: 'include' }).then(res => res.text());
};

/**
 * TechDocs backend serves SVGs with text/plain content-type for security. This
 * helper determines if an SVG is being loaded from the backend, and thus needs
 * inlining to be displayed properly.
 */
const isInlineSvg = (src: string, apiOrigin: string) => {
  const isSrcToSvg = src.endsWith('.svg');
  const isRelativeUrl = !src.match(/^([a-z]*:)?\/\//i);
  const pointsToOurBackend = src.startsWith(apiOrigin);
  return isSrcToSvg && (isRelativeUrl || pointsToOurBackend);
};

const Img = ({ src, alt = '' }: JSX.IntrinsicElements['img']) => {
  const classes = useStyles();
  const { entityRef } = useTechDocsReaderPage();
  const { path } = useTechDocsReaderPageContent();
  const techdocsStorageApi = useApi(techdocsStorageApiRef);

  const { value } = useAsync(async () => {
    if (!src) return '';
    const baseUrl = await techdocsStorageApi.getBaseUrl(src, entityRef, path);
    if (isInlineSvg(src, baseUrl)) {
      const text = await getSvgText(baseUrl);
      return `data:image/svg+xml;base64,${btoa(text)}`;
    }
    return baseUrl;
  }, [src, path, entityRef, techdocsStorageApi]);

  return value ? <img className={classes.root} src={value} alt={alt} /> : null;
};

export { Img as img };
