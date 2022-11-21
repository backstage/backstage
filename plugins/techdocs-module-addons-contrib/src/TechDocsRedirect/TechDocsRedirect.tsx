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
import {
  TechDocsMetadata,
  useTechDocsReaderPage,
} from '@backstage/plugin-techdocs-react';
import React from 'react';
import { useParams } from 'react-router';
import { AsyncState } from 'react-use/lib/useAsyncFn';
import { Navigate } from 'react-router-dom';

// this type is used internally to map the redirections to usable objects
type TechDocsMetadataExt = TechDocsMetadata & {
  redirects?: { [key: string]: string };
};

/**
 * TechDocsRedirectAddon component
 *
 * @internal
 *
 */
export const TechDocsRedirectAddon = () => {
  const { metadata } = useTechDocsReaderPage();
  const params = useParams();
  // the path indicates what sub-page of docs we're currently in
  const path = params['*'] ?? '';
  // if we don't have redirects, it's the same as having an empty set of redirects
  const redirects =
    (metadata as AsyncState<TechDocsMetadataExt>).value?.redirects ?? {};
  // do we have a redirect for that path? if not, the target is just the current page.
  const target = redirects[path] ?? path;
  if (target === path) {
    // just do nothing if we would "redirect to oneself"
    return <></>;
  }
  // issue a Navigate component that will perform the redirection in a react-router adequate manner
  return <Navigate to={target} />;
};
