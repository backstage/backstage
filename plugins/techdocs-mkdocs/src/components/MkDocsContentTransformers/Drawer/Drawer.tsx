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

import { useEffect } from 'react';
import { useTechDocsShadowDom } from '@backstage/plugin-techdocs';

const NAV_TITLE_SELECTOR = '.md-nav__title';

/**
 * Disable MkDocs drawer toggling ('for' attribute => checkbox mechanism)
 */
export const DrawerTransformer = () => {
  const dom = useTechDocsShadowDom();

  useEffect(() => {
    if (!dom) return;
    dom.querySelector(NAV_TITLE_SELECTOR)?.removeAttribute('for');
  }, [dom]);

  return null;
};
