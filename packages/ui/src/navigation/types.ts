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
  Link as RouterLink,
  type NavigateOptions,
  useHref,
  useInRouterContext,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom';

/** @internal */
export type BUIRoutingIntegration = {
  Link: typeof RouterLink;
  useHref: typeof useHref;
  useInRouterContext: typeof useInRouterContext;
  useLocation: typeof useLocation;
  useNavigate: typeof useNavigate;
  useResolvedPath: typeof useResolvedPath;
  createRouterOptions(
    action: () => void,
    options?: NavigateOptions,
  ): NavigateOptions;
};
