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

import { useApi, configApiRef } from '@backstage/core-plugin-api';

import {
  useTechDocsReader,
  TechDocsShadowDom,
  TechDocsShadowDomHooks,
} from '@backstage/plugin-techdocs';

import {
  StylesTransformer,
  ScriptTransformer,
  ScrollTransformer,
  HeaderTransformer,
  FooterTransformer,
  DrawerTransformer,
  SidebarTransformer,
  AnchorTransformer,
  ImageTransformer,
  SourceTransformer,
  CodeTransformer,
} from '../MkDocsContentTransformers';

import { beforeSanitizeElements, afterSanitizeAttributes } from './hooks';

export const MkDocsContent = () => {
  const configApi = useApi(configApiRef);
  const { content, onReady } = useTechDocsReader();

  if (!content) {
    return null;
  }

  const config = {
    ADD_TAGS: ['link'],
    FORBID_TAGS: ['style'],
  };

  const hooks: TechDocsShadowDomHooks = {
    afterSanitizeAttributes,
  };

  const sanitizer = configApi.getOptionalConfig('techdocs.sanitizer');
  const allowedHosts = sanitizer?.getOptionalStringArray('allowedIframeHosts');

  if (allowedHosts) {
    config.ADD_TAGS.push('iframe');
    hooks.beforeSanitizeElements = beforeSanitizeElements(allowedHosts);
  }

  return (
    <TechDocsShadowDom
      source={content}
      config={config}
      hooks={hooks}
      onAttached={onReady}
    >
      <StylesTransformer />
      <ScriptTransformer />
      <ScrollTransformer />
      <HeaderTransformer />
      <FooterTransformer />
      <DrawerTransformer />
      <SidebarTransformer />
      <AnchorTransformer />
      <ImageTransformer />
      <SourceTransformer />
      <CodeTransformer />
    </TechDocsShadowDom>
  );
};
