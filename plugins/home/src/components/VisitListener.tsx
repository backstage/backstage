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
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
  ReactNode,
} from 'react';

import { useLocation } from 'react-router-dom';

import { visitsApiRef } from '../api';
import { useApi } from '@backstage/core-plugin-api';
import { stringifyEntityRef } from '@backstage/catalog-model';

/** @public */
export type VisitListenerContextValue = {
  doNotTrack: boolean;
  setDoNotTrack: Dispatch<SetStateAction<boolean>>;
};

const defaultVisitListenerContext: VisitListenerContextValue = {
  doNotTrack: false,
  setDoNotTrack: () => {},
};

/** @public */
export const VisitListenerContext = createContext<VisitListenerContextValue>(
  defaultVisitListenerContext,
);

/**
 * @public
 * This function returns an implementation of toEntityRef which is responsible
 * for receiving a pathname and maybe returning an entityRef compatible with the
 * catalog-model.
 * By default this function uses the url root "/catalog" and the
 * stringifyEntityRef implementation from catalog-model.
 * Example:
 *   const toEntityRef = getToEntityRef();
 *   toEntityRef(\{ pathname: "/catalog/default/component/playback-order" \})
 *   // returns "component:default/playback-order"
 */
export const getToEntityRef =
  ({
    rootPath = 'catalog',
    stringifyEntityRefImpl = stringifyEntityRef,
  } = {}) =>
  ({ pathname }: { pathname: string }): string | undefined => {
    const regex = new RegExp(
      `^\/${rootPath}\/(?<namespace>[^\/]+)\/(?<kind>[^\/]+)\/(?<name>[^\/]+)`,
    );
    const result = regex.exec(pathname);
    if (!result || !result?.groups) return undefined;
    const entity = {
      namespace: result.groups.namespace,
      kind: result.groups.kind,
      name: result.groups.name,
    };
    return stringifyEntityRefImpl(entity);
  };

/**
 * @public
 * This function returns an implementation of visitName which is responsible
 * for receiving a pathname and returning a string (name). The default
 * implementation ignores the pathname and uses the document.title .
 */
export const getVisitName = (document: Document) => () => document.title;

/**
 * @public
 * Component responsible for listening to location changes and calling
 * the visitsApi to save visits.
 */
export const VisitListener = ({
  children,
  toEntityRef,
  visitName,
}: {
  children?: React.ReactNode;
  toEntityRef?: ({ pathname }: { pathname: string }) => string | undefined;
  visitName?: ({ pathname }: { pathname: string }) => string;
}): JSX.Element => {
  const [doNotTrack, setDoNotTrack] = useState<boolean>(
    defaultVisitListenerContext.doNotTrack,
  );
  const visitsApi = useApi(visitsApiRef);
  const { pathname } = useLocation();
  const toEntityRefImpl = toEntityRef ?? getToEntityRef();
  const visitNameImpl = visitName ?? getVisitName(document);
  useEffect(() => {
    // Wait for the browser to finish with paint with the assumption react
    // has finished with dom reconciliation and the doNotTrack state update.
    const requestId = requestAnimationFrame(() => {
      if (!doNotTrack)
        visitsApi.saveVisit({
          visit: {
            name: visitNameImpl({ pathname }),
            pathname,
            entityRef: toEntityRefImpl({ pathname }),
          },
        });
    });
    return () => cancelAnimationFrame(requestId);
  }, [doNotTrack, visitsApi, pathname, toEntityRefImpl, visitNameImpl]);

  return (
    <VisitListenerContext.Provider value={{ doNotTrack, setDoNotTrack }}>
      {children}
    </VisitListenerContext.Provider>
  );
};

/**
 * @public
 * Hook used to access visit listener context. Is able to control if tracking
 * should be disabled.
 */
export const useVisitListener = () => {
  const value = useContext(VisitListenerContext);

  if (value === undefined)
    throw new Error(
      'useVisitListener found an undefined context, <VisitListener/> could be missing',
    );

  return value;
};

/**
 * @public
 * Use this component to warn VisitListener to disable tracking.
 */
export const DoNotTrack = ({
  children,
}: {
  children?: ReactNode;
}): JSX.Element => {
  const { setDoNotTrack } = useVisitListener();
  useEffect(() => {
    setDoNotTrack(true);
    return () => setDoNotTrack(false);
  }, [setDoNotTrack]);

  return <>{children}</>;
};
