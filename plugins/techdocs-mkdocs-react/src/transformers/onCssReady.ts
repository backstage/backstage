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

import { TECHDOCS_SHADOW_DOM_STYLE_LOAD_EVENT } from '@backstage/plugin-techdocs-react';
import type { Transformer } from './transformer';

type OnCssReadyOptions = {
  onLoading: () => void;
  onLoaded: () => void;
};

export const onCssReady = ({
  onLoading,
  onLoaded,
}: OnCssReadyOptions): Transformer => {
  return dom => {
    onLoading();
    dom.addEventListener(
      TECHDOCS_SHADOW_DOM_STYLE_LOAD_EVENT,
      function handleShadowDomStyleLoad() {
        onLoaded();
        dom.removeEventListener(
          TECHDOCS_SHADOW_DOM_STYLE_LOAD_EVENT,
          handleShadowDomStyleLoad,
        );
      },
    );
    return dom;
  };
};
