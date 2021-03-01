/*
 * Copyright 2020 Spotify AB
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
import React from 'react';
import { useAsync } from 'react-use';
import { useTheme } from '@material-ui/core';
import { useParams, useNavigate } from 'react-router-dom';
import { EntityName } from '@backstage/catalog-model';
import { useApi } from '@backstage/core';
import { BackstageTheme } from '@backstage/theme';
import { useShadowDom } from '..';
import { techdocsStorageApiRef } from '../../api';
import TechDocsProgressBar from './TechDocsProgressBar';

import transformer, {
  addBaseUrl,
  rewriteDocLinks,
  addLinkClickListener,
  removeMkdocsHeader,
  simplifyMkdocsFooter,
  onCssReady,
  sanitizeDOM,
  injectCss,
} from '../transformers';
import { TechDocsNotFound } from './TechDocsNotFound';

type Props = {
  entityId: EntityName;
  onReady?: () => void;
};

export const Reader = ({ entityId, onReady }: Props) => {
  const { kind, namespace, name } = entityId;
  const { '*': path } = useParams();
  const theme = useTheme<BackstageTheme>();

  const techdocsStorageApi = useApi(techdocsStorageApiRef);
  const [shadowDomRef, shadowRoot] = useShadowDom();
  const navigate = useNavigate();

  const { value, loading, error } = useAsync(async () => {
    return techdocsStorageApi.getEntityDocs({ kind, namespace, name }, path);
  }, [techdocsStorageApi, kind, namespace, name, path]);

  React.useEffect(() => {
    if (!shadowRoot || loading || error) {
      return; // Shadow DOM isn't ready / It's not ready / Docs was not found
    }
    if (onReady) {
      onReady();
    }
    // Pre-render
    const transformedElement = transformer(value as string, [
      sanitizeDOM(),
      addBaseUrl({
        techdocsStorageApi,
        entityId: entityId,
        path,
      }),
      rewriteDocLinks(),
      removeMkdocsHeader(),
      simplifyMkdocsFooter(),
      injectCss({
        css: `
        body {
          font-family: ${theme.typography.fontFamily};
          --md-text-color: ${theme.palette.text.primary};
          --md-text-link-color: ${theme.palette.primary.main};

          --md-code-fg-color: ${theme.palette.text.primary};
          --md-code-bg-color: ${theme.palette.background.paper};
        }
        .md-main__inner { margin-top: 0; }
        .md-sidebar { top: 0; width: 20rem; }
        .md-typeset { font-size: 1rem; }
        .md-nav { font-size: 1rem; }
        .md-grid { max-width: 80vw; }
        `,
      }),
    ]);

    if (!transformedElement) {
      return; // An unexpected error occurred
    }

    Array.from(shadowRoot.children).forEach(child =>
      shadowRoot.removeChild(child),
    );
    shadowRoot.appendChild(transformedElement);

    // Post-render
    transformer(shadowRoot.children[0], [
      dom => {
        setTimeout(() => {
          if (window.location.hash) {
            const hash = window.location.hash.slice(1);
            shadowRoot?.getElementById(hash)?.scrollIntoView();
          }
        }, 200);
        return dom;
      },
      addLinkClickListener({
        baseUrl: window.location.origin,
        onClick: (_: MouseEvent, url: string) => {
          const parsedUrl = new URL(url);
          if (parsedUrl.hash) {
            history.pushState(
              null,
              '',
              `${parsedUrl.pathname}${parsedUrl.hash}`,
            );
          } else {
            navigate(parsedUrl.pathname);
          }

          shadowRoot?.querySelector(parsedUrl.hash)?.scrollIntoView();
        },
      }),
      onCssReady({
        docStorageUrl: techdocsStorageApi.getApiOrigin(),
        onLoading: (dom: Element) => {
          (dom as HTMLElement).style.setProperty('opacity', '0');
        },
        onLoaded: (dom: Element) => {
          (dom as HTMLElement).style.removeProperty('opacity');
        },
      }),
    ]);
  }, [
    name,
    path,
    shadowRoot,
    value,
    error,
    loading,
    namespace,
    kind,
    entityId,
    navigate,
    techdocsStorageApi,
    theme,
    onReady,
  ]);

  if (error) {
    // TODO Enhance API call to return customize error objects so we can identify which we ran into
    // For now this defaults to display error code 404
    return <TechDocsNotFound statusCode={404} errorMessage={error.message} />;
  }

  return (
    <>
      {loading ? <TechDocsProgressBar /> : null}
      <div ref={shadowDomRef} />
    </>
  );
};
