/*
 * Copyright 2024 The Backstage Authors
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

import { createExtensionBlueprint, createExtensionDataRef } from '../wiring';

const logoElementsDataRef = createExtensionDataRef<{
  logoIcon?: JSX.Element;
  logoFull?: JSX.Element;
}>().with({ id: 'core.nav-logo.logo-elements' });

/**
 * Creates an extension that replaces the logo in the nav bar with your own.
 *
 * @public
 */
export const NavLogoBlueprint = createExtensionBlueprint({
  kind: 'nav-logo',
  attachTo: { id: 'app/nav', input: 'logos' },
  output: [logoElementsDataRef],
  dataRefs: {
    logoElements: logoElementsDataRef,
  },
  *factory({
    logoIcon,
    logoFull,
  }: {
    logoIcon: JSX.Element;
    logoFull: JSX.Element;
  }) {
    yield logoElementsDataRef({
      logoIcon,
      logoFull,
    });
  },
});
