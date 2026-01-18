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

import {
  AppRootWrapperBlueprint as _AppRootWrapperBlueprint,
  IconBundleBlueprint as _IconBundleBlueprint,
  NavContentBlueprint as _NavContentBlueprint,
  type NavContentComponent,
  type NavContentComponentProps,
  RouterBlueprint as _RouterBlueprint,
  SignInPageBlueprint as _SignInPageBlueprint,
  type SignInPageProps,
  SwappableComponentBlueprint as _SwappableComponentBlueprint,
  ThemeBlueprint as _ThemeBlueprint,
  TranslationBlueprint as _TranslationBlueprint,
} from '@backstage/frontend-plugin-api';

/**
 * Creates an extension that renders a React wrapper at the app root, enclosing
 * the app layout. This blueprint is limited to use by the app plugin.
 *
 * @public
 */
export const AppRootWrapperBlueprint = _AppRootWrapperBlueprint;

/**
 * Creates an extension that adds/replaces an app theme. This blueprint is limited to use by the app plugin.
 *
 * @public
 */
export const ThemeBlueprint = _ThemeBlueprint;

/**
 * Blueprint for creating swappable components from a SwappableComponentRef and a loader. This blueprint is limited to use by the app plugin.
 *
 * @public
 */
export const SwappableComponentBlueprint = _SwappableComponentBlueprint;

/**
 * Creates an extension that replaces the sign in page. This blueprint is limited to use by the app plugin.
 *
 * @public
 */
export const SignInPageBlueprint = _SignInPageBlueprint;

/**
 * Creates an extension that replaces the router component. This blueprint is limited to use by the app plugin.
 *
 * @public
 */
export const RouterBlueprint = _RouterBlueprint;

/**
 * Creates an extension that replaces the entire nav bar with your own component. This blueprint is limited to use by the app plugin.
 *
 * @public
 */
export const NavContentBlueprint = _NavContentBlueprint;

/**
 * Creates an extension that adds icon bundles to your app. This blueprint is limited to use by the app plugin.
 *
 * @public
 */
export const IconBundleBlueprint = _IconBundleBlueprint;

/**
 * Props for the `SignInPage` component.
 *
 * @public
 */
export type { SignInPageProps };

/**
 * The props for the {@link NavContentComponent}.
 *
 * @public
 */
export type { NavContentComponentProps };

/**
 * A component that renders the nav bar content, to be passed to the {@link NavContentBlueprint}.
 *
 * @public
 */
export type { NavContentComponent };

/**
 * Creates an extension that adds translations to your app. This blueprint is limited to use by the app plugin.
 *
 * @public
 */
export const TranslationBlueprint = _TranslationBlueprint;
