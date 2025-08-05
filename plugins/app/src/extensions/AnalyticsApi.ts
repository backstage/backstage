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

import {
  analyticsApiRef,
  AnalyticsImplementationBlueprint,
  ApiBlueprint,
  ApiRef,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';

export const analyticsApi = ApiBlueprint.makeWithOverrides({
  name: 'analytics',
  inputs: {
    implementations: createExtensionInput([
      AnalyticsImplementationBlueprint.dataRefs.factory,
    ]),
  },
  factory(originalFactory, { inputs }) {
    // Pull out and aggregate deps from every implementation input into an
    // object keyed by the apiRef ID to be passed to this API implementation as
    // if they were its own deps.
    const aggregatedDeps = inputs.implementations
      .flatMap<ApiRef<unknown>>(impls =>
        Object.values(
          impls.get(AnalyticsImplementationBlueprint.dataRefs.factory).deps,
        ),
      )
      .reduce<{ [x: string]: ApiRef<unknown> }>((accum, ref) => {
        accum[ref.id] = ref;
        return accum;
      }, {});

    return originalFactory(defineParams =>
      defineParams({
        api: analyticsApiRef,
        deps: aggregatedDeps,
        factory: analyticsApiDeps => {
          const actualApis = inputs.implementations
            .map(impl =>
              impl.get(AnalyticsImplementationBlueprint.dataRefs.factory),
            )
            .map(({ factory, deps }) =>
              factory(
                // Reconstruct a deps argument to pass to this analytics
                // implementation factory from those passed into ours.
                Object.keys(deps).reduce<{ [x: string]: ApiRef<unknown> }>(
                  (accum, dep) => {
                    accum[dep] = analyticsApiDeps[
                      (deps as { [x: string]: ApiRef<unknown> })[dep].id
                    ] as ApiRef<unknown>;
                    return accum;
                  },
                  {},
                ),
              ),
            );
          return {
            captureEvent: event => {
              actualApis.forEach(api => {
                try {
                  api.captureEvent(event);
                } catch {
                  /* ignored */
                }
              });
            },
          };
        },
      }),
    );
  },
});
