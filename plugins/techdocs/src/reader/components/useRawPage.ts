/*
 * Copyright 2020 The Backstage Authors
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
import { CompoundEntityRef } from '@backstage/catalog-model';
import useAsyncRetry from 'react-use/esm/useAsyncRetry';
import { AsyncState } from 'react-use/esm/useAsync';
import { techdocsStorageApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';

export type RawPage = {
  content: string;
  path: string;
  entityId: CompoundEntityRef;
};

export function useRawPage(
  path: string,
  kind: string,
  namespace: string,
  name: string,
): AsyncState<RawPage> & {
  retry(): void;
} {
  const techdocsStorageApi = useApi(techdocsStorageApiRef);

  return useAsyncRetry(async () => {
    const content = await techdocsStorageApi.getEntityDocs(
      { kind, namespace, name },
      path,
    );

    return {
      content,
      path,
      entityId: {
        kind,
        name,
        namespace,
      },
    };
  }, [techdocsStorageApi, kind, namespace, name, path]);
}
