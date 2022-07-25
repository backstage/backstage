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

const Source = ({ src }: JSX.IntrinsicElements['source']) => {
  const classes = useStyles();
  const { entityRef } = useTechDocsReaderPage();
  const { path } = useTechDocsReaderPageContent();
  const techdocsStorageApi = useApi(techdocsStorageApiRef);

  const { value } = useAsync(async () => {
    if (!src) return '';
    return await techdocsStorageApi.getBaseUrl(src, entityRef, path);
  }, [src, path, entityRef, techdocsStorageApi]);

  return value ? <source className={classes.root} src={value} /> : null;
};

export { Source as source };
