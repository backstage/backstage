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

import { createContext, useContext, ReactNode } from 'react';
import { CompoundEntityRef, parseEntityRef } from '@backstage/catalog-model';
import { colorVariants } from '@backstage/theme';
import { Visit } from '../../api/VisitsApi';

/**
 * Type definition for the chip color function
 * @public
 */
export type GetChipColorFunction = (visit: Visit) => string;

/**
 * Type definition for the label function
 * @public
 */
export type GetLabelFunction = (visit: Visit) => string;

/**
 * Context value interface
 * @public
 */
export interface VisitDisplayContextValue {
  getChipColor: GetChipColorFunction;
  getLabel: GetLabelFunction;
}

/**
 * Props for the VisitDisplayProvider
 * @public
 */
export interface VisitDisplayProviderProps {
  children: ReactNode;
  getChipColor?: GetChipColorFunction;
  getLabel?: GetLabelFunction;
}

// Default implementations
const getColorByIndex = (index: number) => {
  const variants = Object.keys(colorVariants);
  const variantIndex = index % variants.length;
  return colorVariants[variants[variantIndex]][0];
};

const maybeEntity = (visit: Visit): CompoundEntityRef | undefined => {
  try {
    return parseEntityRef(visit?.entityRef ?? '');
  } catch (e) {
    return undefined;
  }
};

const defaultGetChipColor: GetChipColorFunction = (visit: Visit): string => {
  const defaultColor = getColorByIndex(0);
  const entity = maybeEntity(visit);
  if (!entity) return defaultColor;

  // IDEA: Use or replicate useAllKinds hook thus supporting all software catalog
  //       registered kinds. See:
  //       plugins/catalog-react/src/components/EntityKindPicker/kindFilterUtils.ts
  //       Provide extension point to register your own color code.
  const entityKinds = [
    'component',
    'template',
    'api',
    'group',
    'user',
    'resource',
    'system',
    'domain',
    'location',
  ];
  const foundIndex = entityKinds.indexOf(
    entity.kind.toLocaleLowerCase('en-US'),
  );
  return foundIndex === -1 ? defaultColor : getColorByIndex(foundIndex + 1);
};

const defaultGetLabel: GetLabelFunction = (visit: Visit): string => {
  const entity = maybeEntity(visit);
  return (entity?.kind ?? 'Other').toLocaleLowerCase('en-US');
};

// Create the context
const VisitDisplayContext = createContext<VisitDisplayContextValue>({
  getChipColor: defaultGetChipColor,
  getLabel: defaultGetLabel,
});

/**
 * Provider component for VisitDisplay customization
 * @public
 */
export const VisitDisplayProvider = ({
  children,
  getChipColor = defaultGetChipColor,
  getLabel = defaultGetLabel,
}: VisitDisplayProviderProps) => {
  const value: VisitDisplayContextValue = {
    getChipColor,
    getLabel,
  };

  return (
    <VisitDisplayContext.Provider value={value}>
      {children}
    </VisitDisplayContext.Provider>
  );
};

/**
 * Hook to use the VisitDisplay context
 * @public
 */
export const useVisitDisplay = (): VisitDisplayContextValue => {
  const context = useContext(VisitDisplayContext);
  if (!context) {
    throw new Error(
      'useVisitDisplay must be used within a VisitDisplayProvider',
    );
  }
  return context;
};
