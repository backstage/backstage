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
import { CompoundEntityRef, parseEntityRef } from '@backstage/catalog-model';
import {
  CatalogProcessorEmit,
  processingResult,
} from '@backstage/plugin-catalog-node';

/** @public */
export function doEmit(
  emit: CatalogProcessorEmit,
  selfRef: CompoundEntityRef,
  targets: string | string[] | undefined,
  context: { defaultKind?: string; defaultNamespace: string },
  outgoingRelation: string,
  incomingRelation: string,
): void {
  if (!targets) {
    return;
  }
  for (const target of [targets].flat()) {
    const targetRef = parseEntityRef(target, context);
    emit(
      processingResult.relation({
        source: selfRef,
        type: outgoingRelation,
        target: {
          kind: targetRef.kind,
          namespace: targetRef.namespace,
          name: targetRef.name,
        },
      }),
    );
    emit(
      processingResult.relation({
        source: {
          kind: targetRef.kind,
          namespace: targetRef.namespace,
          name: targetRef.name,
        },
        type: incomingRelation,
        target: selfRef,
      }),
    );
  }
}
