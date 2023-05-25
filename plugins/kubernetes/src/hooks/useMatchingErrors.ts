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
import React, { useContext } from 'react';
import { DetectedError, ResourceRef } from '../error-detection/types';
import { TypeMeta } from '@kubernetes-models/base';
import { IIoK8sApimachineryPkgApisMetaV1ObjectMeta as V1ObjectMeta } from '@kubernetes-models/apimachinery/apis/meta/v1/ObjectMeta';

export const DetectedErrorsContext = React.createContext<DetectedError[]>([]);

type Matcher = {
  metadata?: V1ObjectMeta;
} & TypeMeta;

export const useMatchingErrors = (matcher: Matcher): DetectedError[] => {
  const targetRef: ResourceRef = {
    name: matcher.metadata?.name ?? '',
    namespace: matcher.metadata?.namespace ?? '',
    kind: matcher.kind,
    apiGroup: matcher.apiVersion,
  };

  const errors = useContext(DetectedErrorsContext);

  return errors.filter(e => {
    const r = e.sourceRef;
    return (
      targetRef.apiGroup === r.apiGroup &&
      targetRef.kind === r.kind &&
      targetRef.name === r.name &&
      targetRef.namespace === r.namespace
    );
  });
};
