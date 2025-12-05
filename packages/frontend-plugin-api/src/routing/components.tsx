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

import { FC } from 'react';
import { useApi, routerApiRef } from '../apis';
import type { LinkProps, NavLinkProps } from './routerTypes';

/**
 * Navigation link component.
 * Renders an anchor tag that navigates on click without a full page reload.
 *
 * @example
 * ```tsx
 * <Link to="/about">About</Link>
 * <Link to="/login" replace>Login</Link>
 * ```
 *
 * @public
 */
export const Link: FC<LinkProps> = props => {
  const { Link: LinkComponent } = useApi(routerApiRef);
  return <LinkComponent {...props} />;
};

/**
 * Navigation link with active state styling.
 * Automatically applies active styles when the link matches the current URL.
 *
 * @example
 * ```tsx
 * <NavLink
 *   to="/dashboard"
 *   className={({ isActive }) => isActive ? 'active' : ''}
 * >
 *   Dashboard
 * </NavLink>
 * ```
 *
 * @public
 */
export const NavLink: FC<NavLinkProps> = props => {
  const { NavLink: NavLinkComponent } = useApi(routerApiRef);
  return <NavLinkComponent {...props} />;
};

/**
 * Outlet for rendering nested routes.
 * Place this where you want child route content to appear.
 *
 * @example
 * ```tsx
 * function Layout() {
 *   return (
 *     <div>
 *       <nav>...</nav>
 *       <Outlet />
 *     </div>
 *   );
 * }
 * ```
 *
 * @public
 */
export const Outlet: FC<{ context?: unknown }> = props => {
  const { Outlet: OutletComponent } = useApi(routerApiRef);
  return <OutletComponent {...props} />;
};

// Note: Routes and Route components are NOT exported here because
// react-router's Routes component inspects its children's types and
// rejects wrapper components. To use Routes/Route, access them via:
//
//   const { Routes, Route } = useApi(routerApiRef);
//
// This is a fundamental limitation of react-router's design.
