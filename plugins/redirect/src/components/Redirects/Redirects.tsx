/*
 * Copyright 2021 Spotify AB
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

import React from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router';
import { configApiRef, useApi } from '@backstage/core';

interface RedirectProps {
  from: string;
  to: string;
}

function NavigateRedirect({ to }: Pick<RedirectProps, 'to'>) {
  const params = useParams();
  let finalTo = to;

  Object.entries(params).forEach(([name, value]) => {
    finalTo = finalTo.replace(name === '*' ? name : `:${name}`, value);
  });

  return <Navigate replace to={finalTo} />;
}

export const Redirects = () => {
  const redirects =
    useApi(configApiRef).getOptionalConfigArray('redirects.patterns') || [];
  return (
    <Routes>
      {redirects.map(redirect => {
        return (
          <Route
            key={redirect.getString('from')}
            path={redirect.getString('from')}
            element={<NavigateRedirect to={redirect.getString('to')} />}
          />
        );
      })}
    </Routes>
  );
};
