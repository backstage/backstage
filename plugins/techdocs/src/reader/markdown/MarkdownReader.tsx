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

import {
  createElement,
  CSSProperties,
  Fragment,
  lazy,
  ReactNode,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Link,
  useLocation,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useAsync from 'react-use/esm/useAsync';
import { fetchApiRef, useApi, useApiHolder } from '@backstage/core-plugin-api';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import { useTechDocsReaderPage } from '@backstage/plugin-techdocs-react';
import {
  TechDocsDocumentProvider,
  TechDocsMarkdownAddon,
  TechDocsSelection,
  techdocsMarkdownAddonsApiRef,
} from '@backstage/plugin-techdocs-react/alpha';
import {
  parseTechDocsMarkdown,
  TechDocsMarkdownNode,
  TechDocsNavigation,
  TechDocsSourceManifest,
  techDocsNodeText,
} from '@backstage/plugin-techdocs-common/alpha';
import { readSourceJson } from './sourceClient';
import { SourceImage } from './SourceImage';
import { SourceAssetLink } from './SourceAssetLink';
import { MathContent, HighlightedCode } from './renderers';
import { MarkdownTabs } from './MarkdownTabs';
import styles from './markdown.module.css';
import { TechDocsSearch } from '../../search';
import { Content } from '@backstage/core-components';
import { BackstageTheme } from '@backstage/theme';

const useStyles = makeStyles(theme => ({
  article: Object.fromEntries(
    (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map(tag => [
      `& ${tag}`,
      {
        ...theme.typography[tag],
        fontSize:
          typeof theme.typography[tag].fontSize === 'number'
            ? Number(theme.typography[tag].fontSize) * 0.6
            : theme.typography[tag].fontSize,
      },
    ]),
  ),
}));

const MermaidBlock = lazy(() => import('./MermaidBlock'));

function resolveDocumentPath(
  target: string,
  page: string,
): { path: string; hash: string } | undefined {
  if (/^[a-z][a-z0-9+.-]*:|^\/\//i.test(target)) return undefined;
  try {
    const url = new URL(target, `https://techdocs.invalid/${page}`);
    if (url.origin !== 'https://techdocs.invalid') return undefined;
    return { path: decodeURIComponent(url.pathname.slice(1)), hash: url.hash };
  } catch {
    return undefined;
  }
}

export default function MarkdownReader(props: {
  manifest: TechDocsSourceManifest;
  base: string;
  defaultPath?: string;
  withSearch?: boolean;
  searchResultUrlMapper?: (url: string) => string;
  onReady?: () => void;
  onMissingArtifact?: (file: string) => void;
}) {
  const { manifest, base, defaultPath, onReady, onMissingArtifact } = props;
  const { '*': route = '' } = useParams();
  const location = useLocation();
  const theme = useTheme<BackstageTheme>();
  const typographyClasses = useStyles();
  const narrow = useMediaQuery('(max-width: 900px)');
  const fetchApi = useApi(fetchApiRef);
  const holder = useApiHolder();
  const { entityRef, setTitle, entityMetadata } = useTechDocsReaderPage();
  const [selection, setSelection] = useState<TechDocsSelection>({ text: '' });
  const article = useRef<HTMLElement>(null);
  const selectedRoute = route || defaultPath || '';
  const page = manifest.pages.find(
    p =>
      p.route.replace(/\/$/, '') === selectedRoute.replace(/\/$/, '') ||
      p.path === selectedRoute,
  );
  const prefix = useResolvedPath('.').pathname.replace(/\/?$/, '/');
  const addons = useMemo(
    () => holder.get(techdocsMarkdownAddonsApiRef)?.getAddons() ?? [],
    [holder],
  );
  const registrations = useMemo(() => {
    const blocks = new Map<string, ReturnType<typeof lazy>>();
    const components: NonNullable<TechDocsMarkdownAddon['components']> = {};
    for (const addon of addons) {
      for (const block of addon.codeBlocks ?? []) {
        if (blocks.has(block.language))
          throw new Error(
            `Duplicate Markdown code renderer: ${block.language}`,
          );
        blocks.set(block.language, lazy(block.loader));
      }
      for (const [tag, component] of Object.entries(addon.components ?? {})) {
        if (tag in components)
          throw new Error(`Duplicate Markdown component: ${tag}`);
        Object.assign(components, { [tag]: component });
      }
    }
    return { blocks, components };
  }, [addons]);
  const state = useAsync(async () => {
    if (!page)
      throw new Error(
        `Page is unavailable in the source publication: ${
          selectedRoute || 'index'
        }`,
      );
    const value = await readSourceJson(
      fetchApi,
      `${base}${page.file}`,
      6_000_000,
      false,
      undefined,
      () => onMissingArtifact?.(page.file),
    );
    if (
      !value ||
      typeof value !== 'object' ||
      !('markdown' in value) ||
      typeof value.markdown !== 'string'
    )
      throw new Error('Invalid Markdown page artifact');
    return parseTechDocsMarkdown(
      value.markdown,
      addons.flatMap(addon => addon.transforms ?? []),
    );
  }, [fetchApi, base, page?.file, selectedRoute, addons, onMissingArtifact]);
  useEffect(() => {
    const update = () => {
      const selected = window.getSelection();
      if (
        !selected ||
        !article.current?.contains(selected.anchorNode) ||
        !article.current.contains(selected.focusNode)
      ) {
        setSelection({ text: '' });
        return;
      }
      const line = (node: Node | null) =>
        Number(
          (node?.nodeType === Node.ELEMENT_NODE
            ? (node as Element)
            : node?.parentElement
          )
            ?.closest('[data-source-line]')
            ?.getAttribute('data-source-line'),
        ) || undefined;
      setSelection({
        text: selected.toString(),
        startLine: line(selected.anchorNode),
        endLine: line(selected.focusNode),
      });
    };
    document.addEventListener('selectionchange', update);
    return () => document.removeEventListener('selectionchange', update);
  }, []);
  useEffect(() => {
    setSelection({ text: '' });
  }, [page?.file]);
  useEffect(() => {
    if (!state.value) return;
    setTitle(page?.title ?? manifest.title);
    onReady?.();
    if (location.hash) {
      let id: string;
      try {
        id = decodeURIComponent(location.hash.slice(1));
      } catch {
        return;
      }
      const element = Array.from(
        article.current?.querySelectorAll('[id]') ?? [],
      ).find(
        el =>
          el.id === id ||
          el.id === `techdocs-${id}` ||
          el.id === `user-content-${id}`,
      );
      element?.scrollIntoView();
    }
  }, [
    state.value,
    page?.title,
    manifest.title,
    setTitle,
    onReady,
    location.hash,
  ]);
  if (state.loading) return <Progress />;
  if (state.error) return <ResponseErrorPanel error={state.error} />;
  const parsed = state.value!;
  const pageUrl = (target: string) => {
    const resolved = resolveDocumentPath(target, page!.path);
    if (!resolved)
      return /^(https?:|mailto:)/i.test(target) ? target : undefined;
    const targetPage = manifest.pages.find(
      p =>
        p.path === resolved.path ||
        p.route === resolved.path ||
        p.route.replace(/\/$/, '') === resolved.path.replace(/\/$/, ''),
    );
    if (!targetPage) return undefined;
    return `${prefix}${targetPage.route
      .split('/')
      .map(encodeURIComponent)
      .join('/')}${location.search}${resolved.hash}`;
  };
  const slot = (
    name: NonNullable<TechDocsMarkdownAddon['slots']>[number]['location'],
  ) =>
    addons.flatMap((addon, a) =>
      (addon.slots ?? [])
        .filter(s => s.location === name)
        .map((s, i) => createElement(s.component, { key: `${a}-${i}` })),
    );
  const renderChildren = (nodes: TechDocsMarkdownNode[] = []): ReactNode[] => {
    const result: ReactNode[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const isTab = (node: TechDocsMarkdownNode) =>
        node.tagName === 'details' &&
        (node.properties?.className as string[] | undefined)?.includes(
          'techdocs-tab',
        );
      if (!isTab(nodes[i])) {
        result.push(render(nodes[i], i));
        continue;
      }
      const tabs = [];
      do {
        const tab = nodes[i];
        tabs.push({
          title: techDocsNodeText(
            tab.children?.[0] ?? { type: 'text', value: 'Tab' },
          ),
          content: renderChildren(tab.children?.slice(1)),
        });
        if (
          nodes[i + 1]?.type === 'text' &&
          !nodes[i + 1].value?.trim() &&
          nodes[i + 2] &&
          isTab(nodes[i + 2])
        )
          i++;
        if (!nodes[i + 1] || !isTab(nodes[i + 1])) break;
        i++;
      } while (i < nodes.length);
      result.push(<MarkdownTabs key={i} tabs={tabs} />);
    }
    return result;
  };
  function render(node: TechDocsMarkdownNode, key: number): ReactNode {
    if (node.type === 'text') return node.value;
    if (node.type === 'root')
      return <Fragment key={key}>{renderChildren(node.children)}</Fragment>;
    if (node.type !== 'element' || !node.tagName) return null;
    const tag = node.tagName;
    const properties = node.properties ?? {};
    const classes = Array.isArray(properties.className)
      ? properties.className.join(' ')
      : '';
    let content: ReactNode;
    if (/math-inline|math-display/.test(classes)) {
      content = (
        <MathContent
          text={techDocsNodeText(node)}
          display={classes.includes('math-display')}
        />
      );
    } else if (tag === 'pre' && node.children?.[0]?.tagName === 'code') {
      const codeNode = node.children[0];
      const language =
        (codeNode.properties?.className as string[] | undefined)
          ?.find(c => c.startsWith('language-'))
          ?.slice(9) ?? '';
      const code = techDocsNodeText(codeNode);
      const Custom = registrations.blocks.get(language);
      if (Custom) {
        content = (
          <Suspense fallback={<pre>{code}</pre>}>
            <Custom code={code} language={language} />
          </Suspense>
        );
      } else if (
        (codeNode.properties?.className as string[] | undefined)?.includes(
          'math-display',
        )
      ) {
        content = <MathContent text={code} display />;
      } else if (language === 'mermaid') {
        content = (
          <Suspense fallback={<pre>{code}</pre>}>
            <MermaidBlock code={code} language={language} />
          </Suspense>
        );
      } else {
        content = <HighlightedCode code={code} language={language} />;
      }
    } else if (tag === 'img') {
      const resolved = resolveDocumentPath(
        String(properties.src ?? ''),
        page!.path,
      );
      const asset = manifest.assets.find(a => a.path === resolved?.path);
      content = asset ? (
        <SourceImage
          base={base}
          file={asset.file}
          width={
            Number(properties.width) > 0 && Number(properties.width) <= 10000
              ? Number(properties.width)
              : undefined
          }
          alt={String(properties.alt ?? '')}
          onMissingArtifact={onMissingArtifact}
        />
      ) : (
        <span role="note">
          Image unavailable: {String(properties.alt ?? properties.src ?? '')}
        </span>
      );
    } else if (tag === 'a') {
      const href = pageUrl(String(properties.href ?? ''));
      const resolved = resolveDocumentPath(
        String(properties.href ?? ''),
        page!.path,
      );
      const asset = manifest.assets.find(a => a.path === resolved?.path);
      if (asset) {
        content = (
          <SourceAssetLink
            base={base}
            asset={asset}
            onMissingArtifact={onMissingArtifact}
          >
            {renderChildren(node.children)}
          </SourceAssetLink>
        );
      } else if (!href) {
        content = (
          <span title="Unsupported or missing documentation link">
            {renderChildren(node.children)}
          </span>
        );
      } else if (/^https?:|^mailto:/i.test(href)) {
        content = (
          <a href={href} rel="noopener noreferrer">
            {renderChildren(node.children)}
          </a>
        );
      } else {
        content = <Link to={href}>{renderChildren(node.children)}</Link>;
      }
    } else {
      const attrs: Record<string, unknown> = { ...properties };
      // Sanitized properties still need conversion from HAST to React's DOM names.
      if (Array.isArray(attrs.className))
        attrs.className = attrs.className.join(' ');
      if (attrs.for) {
        attrs.htmlFor = attrs.for;
        delete attrs.for;
      }
      if (tag === 'input') {
        attrs.disabled = true;
        attrs.readOnly = true;
      }
      if (node.position) attrs['data-source-line'] = node.position.start.line;
      content = createElement(
        tag,
        attrs,
        ...(renderChildren(node.children) ?? []),
      );
    }
    const Component =
      registrations.components[tag as keyof typeof registrations.components];
    return (
      <Fragment key={key}>
        {Component ? (
          <Component node={node} defaultComponent={content}>
            {renderChildren(node.children)}
          </Component>
        ) : (
          content
        )}
      </Fragment>
    );
  }
  const containsPage = (entry: TechDocsNavigation): boolean =>
    entry.path === page!.path || (entry.children?.some(containsPage) ?? false);
  const navigationPages: TechDocsNavigation[] = [];
  const collectPages = (entries: TechDocsNavigation[]) => {
    for (const entry of entries) {
      if (entry.path) navigationPages.push(entry);
      if (entry.children) collectPages(entry.children);
    }
  };
  collectPages(manifest.nav);
  const pageIndex = navigationPages.findIndex(
    entry => entry.path === page!.path,
  );
  const previous = navigationPages[pageIndex - 1];
  const next = navigationPages[pageIndex + 1];
  const navigationTitle = (entry: TechDocsNavigation) =>
    entry.title === entry.path
      ? manifest.pages.find(p => p.path === entry.path)?.title ?? entry.title
      : entry.title;
  const headings = parsed.headings.filter((h, i) => i !== 0 || h.level !== 1);
  const nav = (entries: TechDocsNavigation[]): ReactNode => (
    <ul>
      {entries.map((entry, i) => (
        <li key={i}>
          {entry.path ? (
            <Link
              aria-current={entry.path === page!.path ? 'page' : undefined}
              to={`${prefix}${(
                manifest.pages.find(p => p.path === entry.path)?.route ?? ''
              )
                .split('/')
                .map(encodeURIComponent)
                .join('/')}${location.search}`}
            >
              {navigationTitle(entry)}
            </Link>
          ) : (
            <details open={containsPage(entry)}>
              <summary>{navigationTitle(entry)}</summary>
              {entry.children && nav(entry.children)}
            </details>
          )}
          {entry.path && entry.children && nav(entry.children)}
        </li>
      ))}
    </ul>
  );
  return (
    <TechDocsDocumentProvider
      document={{
        entityRef,
        path: page!.path,
        title: page!.title,
        headings: parsed.headings,
        navigation: manifest.nav,
      }}
      selection={selection}
    >
      <Content>
        <div
          className={styles.root}
          style={
            {
              '--techdocs-link-color': theme.palette.link,
              '--techdocs-text-color': theme.palette.text.primary,
              '--techdocs-muted-color': theme.palette.text.secondary,
              '--techdocs-border-color': theme.palette.divider,
              '--techdocs-paper-color': theme.palette.background.paper,
              '--techdocs-code-color':
                theme.palette.type === 'dark' ? '#90caf9' : '#4051b5',
              '--techdocs-string-color':
                theme.palette.type === 'dark' ? '#a5d6a7' : '#388e3c',
            } as CSSProperties
          }
        >
          <div className={styles.toolbar}>
            {slot('toolbar')}
            {slot('settings')}
          </div>
          {props.withSearch !== false && (
            <div className={styles.search}>
              <TechDocsSearch
                entityId={entityRef}
                entityTitle={entityMetadata.value?.metadata.title}
                searchResultUrlMapper={props.searchResultUrlMapper}
              />
            </div>
          )}
          <div className={styles.layout}>
            <nav
              className={styles.navigation}
              aria-label="Documentation navigation"
            >
              <details className={styles.navigationContents} open={!narrow}>
                <summary>Browse documentation</summary>
                <strong>{manifest.title}</strong>
                {nav(manifest.nav)}
                {slot('navigation')}
              </details>
            </nav>
            <article className={typographyClasses.article} ref={article}>
              {slot('before-content')}
              {!parsed.headings.some(h => h.level === 1) && (
                <h1>{page!.title}</h1>
              )}
              {render(parsed.tree, 0)}
              {slot('after-content')}
              <nav
                className={styles.pagination}
                aria-label="Documentation pages"
              >
                {previous?.path ? (
                  <Link to={pageUrl(`/${previous.path}`)!}>
                    <small>Previous</small>
                    {navigationTitle(previous)}
                  </Link>
                ) : (
                  <span />
                )}
                {next?.path && (
                  <Link to={pageUrl(`/${next.path}`)!}>
                    <small>Next</small>
                    {navigationTitle(next)}
                  </Link>
                )}
              </nav>
            </article>
            <nav className={styles.navigation} aria-label="On this page">
              {headings.length > 0 && <strong>Table of contents</strong>}
              <ul>
                {headings.map(h => (
                  <li
                    key={h.id}
                    style={{
                      marginInlineStart: Math.max(0, h.level - 2) * 12,
                    }}
                  >
                    <Link
                      to={`${location.pathname}${
                        location.search
                      }#${encodeURIComponent(h.id.replace(/^techdocs-/, ''))}`}
                    >
                      {h.title}
                    </Link>
                  </li>
                ))}
              </ul>
              {slot('toc')}
            </nav>
          </div>
          {manifest.diagnostics.length > 0 && (
            <details className={styles.diagnostics}>
              <summary>
                Source migration diagnostics ({manifest.diagnostics.length})
              </summary>
              <ul>
                {manifest.diagnostics.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </Content>
    </TechDocsDocumentProvider>
  );
}
