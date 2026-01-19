/*
 * Copyright 2025 The Backstage Authors
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

import { ReactNode } from 'react';
import { RouterProvider } from 'react-aria-components';
import { useNavigate, useHref } from 'react-router-dom';
import { isExternalLink } from '../../utils/isExternalLink';

/**
 * Inner component that uses router hooks.
 * Separated so hooks are only called when this component mounts.
 */
function InternalLinkProviderInner({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      {children}
    </RouterProvider>
  );
}

/**
 * Conditionally wraps children in a RouterProvider for internal link navigation.
 * Only mounts the router hooks when `href` is an internal link, avoiding the
 * requirement for a Router context when rendering components without internal hrefs.
 *
 * @internal
 */
export function InternalLinkProvider({
  href,
  children,
}: {
  href: string | undefined;
  children: ReactNode;
}) {
  const hasInternalHref = !!href && !isExternalLink(href);

  if (!hasInternalHref) {
    return <>{children}</>;
  }
  return <InternalLinkProviderInner>{children}</InternalLinkProviderInner>;
}
