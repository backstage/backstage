/*
 * Copyright 2020 Spotify AB
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

import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

type IUseShadowDOM = (
  componentId: string,
  path: string,
) => [RefObject<HTMLDivElement>, ShadowRoot?];

export const useShadowDom: IUseShadowDOM = (componentId, path) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const innerDivElement = document.createElement('div');
    innerDivElement.attachShadow({ mode: 'open' });

    const outerDivElement = ref.current;
    outerDivElement?.appendChild(innerDivElement);

    return function cancel() {
      outerDivElement?.removeChild(innerDivElement);
    };
  }, [componentId, path]);

  const shadowRoot =
    ref.current?.children && ref.current?.children[0].shadowRoot
      ? ref.current?.children[0].shadowRoot
      : undefined;

  return [ref, shadowRoot];
};
