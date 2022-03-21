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

import React, { PropsWithChildren } from 'react';
import {
  CompoundEntityRef,
  DEFAULT_NAMESPACE,
  Entity,
} from '@backstage/catalog-model';
import {
  Reader,
  useTechDocsReaderDom,
  withTechDocsReaderProvider,
} from './reader';
import { toLowerMaybe } from './helpers';
import {
  configApiRef,
  getComponentData,
  useApi,
} from '@backstage/core-plugin-api';
import {
  TechDocsReaderPage as AddonAwareReaderPage,
  TECHDOCS_ADDONS_WRAPPER_KEY,
} from '@backstage/plugin-techdocs-addons';
import { AsyncState } from 'react-use/lib/useAsyncFn';
import { TechDocsEntityMetadata } from './types';
import { techdocsApiRef } from '.';
import useAsync from 'react-use/lib/useAsync';

type SpecialReaderPageProps = {
  entityName: CompoundEntityRef;
  asyncEntityMetadata: AsyncState<TechDocsEntityMetadata>;
  addonConfig?: React.ReactNode;
};

// todo(backstage/techdocs-core): Combine with <SpecialReaderPage> and simplify
// with the version in TechDocsReaderPage.tsx
const SpecialReaderPage = (props: SpecialReaderPageProps) => {
  const techdocsApi = useApi(techdocsApiRef);
  const dom = useTechDocsReaderDom(props.entityName);
  const { kind, namespace, name } = props.entityName;

  const asyncTechDocsMetadata = useAsync(() => {
    return techdocsApi.getTechDocsMetadata({ kind, namespace, name });
  }, [kind, namespace, name, techdocsApi]);

  return (
    <AddonAwareReaderPage
      asyncEntityMetadata={props.asyncEntityMetadata}
      asyncTechDocsMetadata={asyncTechDocsMetadata}
      addonConfig={props.addonConfig}
      dom={dom}
      hideHeader
    />
  );
};

export const EntityPageDocs = ({
  children,
  entity,
}: PropsWithChildren<{ entity: Entity }>) => {
  const config = useApi(configApiRef);
  const entityName = {
    namespace: toLowerMaybe(
      entity.metadata.namespace ?? DEFAULT_NAMESPACE,
      config,
    ),
    kind: toLowerMaybe(entity.kind, config),
    name: toLowerMaybe(entity.metadata.name, config),
  };

  // Check if we were given a set of TechDocs addons.
  if (children && getComponentData(children, TECHDOCS_ADDONS_WRAPPER_KEY)) {
    const Component = withTechDocsReaderProvider(SpecialReaderPage, entityName);
    return (
      <Component
        entityName={entityName}
        asyncEntityMetadata={{
          loading: false,
          error: undefined,
          value: entity,
        }}
        addonConfig={children}
      />
    );
  }

  // Otherwise, return a version of the reader that is not addon-aware.
  return <Reader withSearch={false} entityRef={entityName} />;
};
