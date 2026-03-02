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

import { NotFoundErrorPage } from '@backstage/frontend-plugin-api';
import { SwappableComponentBlueprint } from '@backstage/plugin-app-react';
import { Button } from '@backstage/core-components';

function CustomNotFoundErrorPage() {
  return (
    <article className="w-full h-screen grid text-center content-center justify-center justify-items-center">
      <h1 className="text-6xl font-bold tracking-tight">404</h1>
      <p className="text-muted-foreground w-[300px]">
        Unable to locate this page. Please contact your support team if this
        page used to exist.
      </p>
      <Button variant="default" to="/" className="mt-4 w-[200px]">
        Go home
      </Button>
    </article>
  );
}

export default SwappableComponentBlueprint.make({
  name: 'not-found-error-page',
  params: define =>
    define({
      component: NotFoundErrorPage,
      loader: () => CustomNotFoundErrorPage,
    }),
});
