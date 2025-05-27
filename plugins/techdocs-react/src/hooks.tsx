/*
 * Copyright 2022 The Backstage Authors
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
import { useEffect, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import DocsIcon from '@material-ui/icons/Description';

import { ExternalRouteRef, useRouteRef } from '@backstage/core-plugin-api';
import {
  TranslationRef,
  useTranslationRef,
} from '@backstage/core-plugin-api/alpha';

import {
  TECHDOCS_ANNOTATION,
  TECHDOCS_EXTERNAL_ANNOTATION,
} from '@backstage/plugin-techdocs-common';

import { useEntity } from '@backstage/plugin-catalog-react';

import { useTechDocsReaderPage } from './context';
import { buildTechDocsURL } from './helpers';

/** @alpha */
export function useTechdocsReaderIconLinkProps(options: {
  translationRef: TranslationRef;
  externalRouteRef: ExternalRouteRef;
}) {
  const { translationRef, externalRouteRef } = options;
  const { entity } = useEntity();
  const viewTechdocLink = useRouteRef(externalRouteRef);
  const { t } = useTranslationRef(translationRef);

  return {
    label: t('aboutCard.viewTechdocs'),
    disabled:
      !(
        entity.metadata.annotations?.[TECHDOCS_ANNOTATION] ||
        entity.metadata.annotations?.[TECHDOCS_EXTERNAL_ANNOTATION]
      ) || !viewTechdocLink,
    icon: <DocsIcon />,
    href: buildTechDocsURL(entity, viewTechdocLink),
  };
}

/**
 * Hook for use within TechDocs addons that provides access to the underlying
 * shadow root of the current page, allowing the DOM within to be mutated.
 * @public
 */
export const useShadowRoot = () => {
  const { shadowRoot } = useTechDocsReaderPage();
  return shadowRoot;
};

/**
 * Convenience hook for use within TechDocs addons that provides access to
 * elements that match a given selector within the shadow root.
 *
 * @public
 */
export const useShadowRootElements = <
  TReturnedElement extends HTMLElement = HTMLElement,
>(
  selectors: string[],
): TReturnedElement[] => {
  const shadowRoot = useShadowRoot();
  const [root, setRootNode] = useState(shadowRoot?.firstChild);

  useEffect(() => {
    let observer: MutationObserver;
    if (shadowRoot) {
      observer = new MutationObserver(() => {
        setRootNode(shadowRoot?.firstChild);
      });
      observer.observe(shadowRoot, {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
      });
    }
    return () => observer?.disconnect();
  }, [shadowRoot]);

  if (!root || !(root instanceof HTMLElement)) return [];

  return selectors
    .map(selector => root.querySelectorAll<TReturnedElement>(selector))
    .filter(nodeList => nodeList.length)
    .map(nodeList => Array.from(nodeList))
    .flat();
};

const isValidSelection = (newSelection: Selection) => {
  // Safari sets the selection rect to top zero
  return (
    newSelection.toString() &&
    newSelection.rangeCount &&
    newSelection.getRangeAt(0).getBoundingClientRect().top
  );
};

/**
 * Hook for retrieving a selection within the ShadowRoot.
 * @public
 */
export const useShadowRootSelection = (waitMillis: number = 0) => {
  const shadowRoot = useShadowRoot();
  const [selection, setSelection] = useState<Selection | null>(null);
  const handleSelectionChange = useMemo(
    () =>
      debounce(() => {
        const shadowDocument = shadowRoot as ShadowRoot &
          Pick<Document, 'getSelection'>;
        // Firefox and Safari don't implement getSelection for Shadow DOM
        const newSelection = shadowDocument.getSelection
          ? shadowDocument.getSelection()
          : document.getSelection();

        if (newSelection && isValidSelection(newSelection)) {
          setSelection(newSelection);
        } else {
          setSelection(null);
        }
      }, waitMillis),
    [shadowRoot, setSelection, waitMillis],
  );

  useEffect(() => {
    window.document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      handleSelectionChange.cancel();
      window.document.removeEventListener(
        'selectionchange',
        handleSelectionChange,
      );
    };
  }, [handleSelectionChange]);

  return selection;
};
