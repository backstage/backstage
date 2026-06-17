/*
 * Copyright 2026 The Backstage Authors
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

import { ComponentType, lazy, ReactNode } from 'react';
import {
  createExtensionBlueprint,
  createExtensionDataRef,
  ExtensionBoundary,
  IdentityApi,
} from '@backstage/frontend-plugin-api';

/**
 * Props for the `SignInPage` component.
 *
 * @public
 */
export type SignInPageProps = {
  /**
   * Set the IdentityApi on successful sign-in. This should only be called once.
   */
  onSignInSuccess(identityApi: IdentityApi): void;

  /**
   * The children to render.
   */
  children?: ReactNode;
};

const componentDataRef = createExtensionDataRef<
  ComponentType<SignInPageProps>
>().with({ id: 'core.sign-in-page.component' });

/**
 * Creates an extension that replaces the sign in page. This blueprint is limited to use by the app plugin.
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
      <ExtensionBoundary node={node}>
        <ExtensionComponent {...props} />
      </ExtensionBoundary>
    ));
  },
});
