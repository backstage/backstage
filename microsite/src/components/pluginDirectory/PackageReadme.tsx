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
import React, { createContext, useContext, useEffect, useState } from 'react';
import ReactMarkdown, {
  defaultUrlTransform,
  type Components,
} from 'react-markdown';
import type { PackageSnapshot } from '../../../../scripts/plugin-directory/manifest';
import {
  getReadmeBaseUrl,
  isAllowedReadmeImage,
  resolveReadmeUrl,
} from '../../pluginDirectory/readmeUrls';
import { fetchPackageReadme } from '../../pluginDirectory/unpkgClient';
import styles from './pluginDirectory.module.scss';

interface PackageReadmeProps {
  packageSnapshot: PackageSnapshot;
}

type ReadmeState =
  | { status: 'loading' }
  | { status: 'ready'; value: string | undefined }
  | { status: 'error' }
  | { status: 'unavailable' }; // no known npm version to fetch against

function usePackageReadme(
  npmPackageName: string | undefined,
  version: string | undefined,
): ReadmeState {
  // The result is stored with the package it belongs to, so that switching
  // packages shows the loading state right away rather than the previous
  // README until the effect below has run.
  const key =
    npmPackageName && version ? `${npmPackageName}@${version}` : undefined;
  const [loaded, setLoaded] = useState<{ key: string; state: ReadmeState }>();

  useEffect(() => {
    if (!npmPackageName || !version || !key) {
      return undefined;
    }

    let cancelled = false;
    fetchPackageReadme(npmPackageName, version).then(result => {
      if (cancelled) {
        return;
      }
      if (result.status === 'error') {
        console.error(
          `Failed to load README for ${npmPackageName}@${version}`,
          result.error,
        );
        setLoaded({ key, state: { status: 'error' } });
        return;
      }
      setLoaded({ key, state: { status: 'ready', value: result.value } });
    });

    return () => {
      cancelled = true;
    };
  }, [key, npmPackageName, version]);

  if (!key) {
    return { status: 'unavailable' };
  }
  return loaded?.key === key ? loaded.state : { status: 'loading' };
}

// Markdown links can wrap images, and a link can't contain another link.
const InsideLinkContext = createContext(false);

function ReadmeLink(props: React.ComponentProps<'a'>) {
  const { children, ...rest } = props;
  return (
    <a {...rest}>
      <InsideLinkContext.Provider value>{children}</InsideLinkContext.Provider>
    </a>
  );
}

function ReadmeImage({ src, alt }: React.ComponentProps<'img'>) {
  const insideLink = useContext(InsideLinkContext);
  if (typeof src === 'string' && isAllowedReadmeImage(src)) {
    return <img src={src} alt={alt} loading="lazy" />;
  }
  // Images from other hosts are not loaded when the page renders.
  const label = alt || src || 'image';
  return typeof src === 'string' && src && !insideLink ? (
    <a href={src} rel="noopener noreferrer">
      {label}
    </a>
  ) : (
    <span>{label}</span>
  );
}

const markdownComponents: Components = { a: ReadmeLink, img: ReadmeImage };

export function PackageReadme({ packageSnapshot }: PackageReadmeProps) {
  const version =
    packageSnapshot.npm.status === 'unavailable'
      ? undefined
      : packageSnapshot.npm.latestVersion;
  const state = usePackageReadme(packageSnapshot.npmPackageName, version);

  return (
    <section className={styles.setupStep} aria-label="Package README">
      {state.status === 'loading' && <p role="status">Loading README…</p>}
      {(state.status === 'unavailable' ||
        (state.status === 'ready' && state.value === undefined)) && (
        <p>No README is available for this package.</p>
      )}
      {state.status === 'error' && (
        <p role="alert">The package README could not be loaded.</p>
      )}
      {state.status === 'ready' && state.value !== undefined && version && (
        <div className={styles.readmeContent}>
          <ReactMarkdown
            components={markdownComponents}
            urlTransform={url =>
              resolveReadmeUrl(
                defaultUrlTransform(url),
                getReadmeBaseUrl(packageSnapshot.npmPackageName, version),
              )
            }
          >
            {state.value}
          </ReactMarkdown>
        </div>
      )}
    </section>
  );
}
