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
import { PropsWithChildren, ReactNode } from 'react';
import { Route, Routes, useOutlet } from 'react-router-dom';
import { GoldenPathDetailsPage } from '../GoldenPathDetailsPage';
import {
  detailsRouteRef,
  executeRouteRef,
  GoldenPathContextProvider,
  initialParamsRouteRef,
} from '@backstage/plugin-golden-paths-react';
import { useCustomFieldExtensions } from '@backstage/plugin-scaffolder-react';

import { GoldenPathsHomepage } from '../GoldenPathsHomepage';
import { GoldenPathInitialParamsPage } from '../GoldenPathInitialParamsPage';
import { GoldenPathExecution } from '../GoldenPathExecutionPage';

type Props = PropsWithChildren<{
  GoldenPathNotFound?: ReactNode;
}>;

/**
 * The Golden Paths Router
 *
 * @public
 */
export const Router = ({ GoldenPathNotFound, children }: Props) => {
  const outlet = useOutlet() || children;
  const customFieldExtensions = useCustomFieldExtensions(outlet);

  return (
    <GoldenPathContextProvider customFieldExtensions={customFieldExtensions}>
      <Routes>
        <Route
          path={detailsRouteRef.path}
          element={
            <GoldenPathDetailsPage GoldenPathNotFound={GoldenPathNotFound} />
          }
        />

        <Route
          path={initialParamsRouteRef.path}
          element={<GoldenPathInitialParamsPage />}
        />

        <Route path={executeRouteRef.path} element={<GoldenPathExecution />} />

        <Route path="*" element={<GoldenPathsHomepage />} />
      </Routes>
    </GoldenPathContextProvider>
  );
};
