/*
 * Copyright 2021 The Backstage Authors
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

/**
 * Scroll to the desired anchor or to the top of page
 */
export const ScrollTransformer = () => {
  const dom = useTechDocsShadowDom();

  useEffect(() => {
    if (!dom) return;

    setTimeout(() => {
      // Scroll to the desired anchor ot top of content
      const { hash } = window.location;
      if (!hash) return;
      dom.querySelector<HTMLElement>(hash)?.scrollIntoView();
    }, 200);
  }, [dom]);

  return null;
};
