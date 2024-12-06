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

import { ComponentType, lazy } from 'react';
import { createExtensionBlueprint, createExtensionDataRef } from '../wiring';
import { SignInPageProps } from '@backstage/core-plugin-api';
import { ExtensionBoundary } from '../components';

const componentDataRef = createExtensionDataRef<
  ComponentType<SignInPageProps>
>().with({ id: 'core.sign-in-page.component' });

/**
 * Creates an extension that replaces the sign in page.
 *
 * @public
 */
export const SignInPageBlueprint = createExtensionBlueprint({
  kind: 'sign-in-page',
  attachTo: { id: 'app/root', input: 'signInPage' },
  output: [componentDataRef],
  dataRefs: {
    component: componentDataRef,
  },
  *factory(
    {
      loader,
    }: {
      loader: () => Promise<ComponentType<SignInPageProps>>;
    },
    { node },
  ) {
    const ExtensionComponent = lazy(() =>
      loader().then(component => ({ default: component })),
    );

    yield componentDataRef(props => (
      <ExtensionBoundary node={node} routable>
        <ExtensionComponent {...props} />
      </ExtensionBoundary>
    ));
  },
});
