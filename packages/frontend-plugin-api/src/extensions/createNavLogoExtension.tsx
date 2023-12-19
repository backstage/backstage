/*
 * Copyright 2023 The Backstage Authors
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

import { createExtension, createExtensionDataRef } from '../wiring';

/**
 * Helper for creating extensions for a nav logos.
 * @public
 */
export function createNavLogoExtension(options: {
  name?: string;
  namespace?: string;
  logoIcon: JSX.Element;
  logoFull: JSX.Element;
}) {
  const { logoIcon, logoFull } = options;
  return createExtension({
    kind: 'nav-logo',
    name: options?.name,
    namespace: options?.namespace,
    attachTo: { id: 'app/nav', input: 'logos' },
    output: {
      logos: createNavLogoExtension.logoElementsDataRef,
    },
    factory: () => {
      return {
        logos: {
          logoIcon,
          logoFull,
        },
      };
    },
  });
}

/** @public */
export namespace createNavLogoExtension {
  export const logoElementsDataRef = createExtensionDataRef<{
    logoIcon?: JSX.Element;
    logoFull?: JSX.Element;
  }>('core.nav-logo.logo-elements');
}
