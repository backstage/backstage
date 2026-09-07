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

import { z } from 'zod/v4';
import {
  createExtension,
  coreExtensionData,
  createExtensionInput,
  NotFoundErrorPage,
} from '@backstage/frontend-plugin-api';
import { Navigate, useLocation, useParams, useRoutes } from 'react-router-dom';

function RedirectWithParams({ to }: { to: string }) {
  const params = useParams() as Record<string, string>;
  const { search, hash } = useLocation();

  let target = to;
  for (const [name, value] of Object.entries(params)) {
    // Use \b (word boundary) for named params so that `:a` doesn't
    // accidentally match inside `:ab` when both are present.
    target = target.replace(
      name === '*' ? /\*/g : new RegExp(`:${name}\\b`, 'g'),
      value ?? '',
    );
  }

  const hashIndex = target.indexOf('#');
  const beforeHash = hashIndex === -1 ? target : target.slice(0, hashIndex);
  const targetHash = hashIndex === -1 ? '' : target.slice(hashIndex);

  const queryIndex = beforeHash.indexOf('?');
  const path = queryIndex === -1 ? beforeHash : beforeHash.slice(0, queryIndex);
  const targetSearch = queryIndex === -1 ? '' : beforeHash.slice(queryIndex);

  return (
    <Navigate
      to={{
        pathname: path,
        search: targetSearch || search,
        hash: targetHash || hash,
      }}
      replace
    />
  );
}

export const AppRoutes = createExtension({
  name: 'routes',
  attachTo: { id: 'app/layout', input: 'content' },
  inputs: {
    routes: createExtensionInput([
      coreExtensionData.routePath,
      coreExtensionData.routeRef.optional(),
      coreExtensionData.reactElement,
    ]),
  },
  configSchema: {
    redirects: z
      .array(
        z.object({
          from: z.string(),
          to: z.string(),
        }),
      )
      .optional(),
  },
  output: [coreExtensionData.reactElement],
  factory({ inputs, config }) {
    const redirects = config.redirects ?? [];

    const Routes = () => {
      const element = useRoutes([
        ...redirects.map(redirect => ({
          path:
            redirect.from === '/'
              ? redirect.from
              : `${redirect.from.replace(/\/$/, '')}/*`,
          element: <RedirectWithParams to={redirect.to} />,
        })),
        ...inputs.routes.map(route => {
          const routePath = route.get(coreExtensionData.routePath);

          return {
            path:
              routePath === '/'
                ? routePath
                : `${routePath.replace(/\/$/, '')}/*`,

            element: route.get(coreExtensionData.reactElement),
          };
        }),
        {
          path: '*',
          element: <NotFoundErrorPage />,
        },
      ]);

      return element;
    };

    return [coreExtensionData.reactElement(<Routes />)];
  },
});
