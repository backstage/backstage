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

/**
 * Name for the event dispatched when ShadowRoot styles are loaded.
 * @public
 */
export const SHADOW_DOM_STYLE_LOAD_EVENT = 'TECH_DOCS_SHADOW_DOM_STYLE_LOAD';

export const STYLESHEET_HREFS_DATASET = 'techdocsStylesheetHrefs';

const stylesheetCacheByEntity = new Map<string, string[]>();

export function getEntityDocsKey(): string {
  const catalogMatch = window.location.pathname.match(
    /\/catalog\/([^/]+\/[^/]+\/[^/]+)\/docs/,
  );
  if (catalogMatch) {
    return catalogMatch[1];
  }
  const docsMatch = window.location.pathname.match(
    /\/docs\/([^/]+\/[^/]+\/[^/]+)/,
  );
  if (docsMatch) {
    return docsMatch[1];
  }
  return '';
}

function findStylesheetLinks(element: Element): HTMLLinkElement[] {
  return Array.from(
    element.querySelectorAll<HTMLLinkElement>('head link[rel="stylesheet"]'),
  );
}

function getBackstageStyleAnchor(head: Element): Element | null {
  const styles = head.querySelectorAll('style');
  return styles.length > 0 ? styles[styles.length - 1] : null;
}

function insertStylesheetInHead(
  head: Element,
  link: HTMLLinkElement,
): HTMLLinkElement {
  const anchor = getBackstageStyleAnchor(head);
  if (anchor) {
    head.insertBefore(link, anchor);
  } else {
    head.appendChild(link);
  }
  return link;
}

function ensureLinksBeforeBackstageStyle(
  element: Element,
  links: HTMLLinkElement[],
): HTMLLinkElement[] {
  const head = element.querySelector('head');
  if (!head) {
    return links;
  }
  const anchor = getBackstageStyleAnchor(head);
  if (!anchor) {
    return links;
  }
  links.forEach(link => {
    if (link.parentNode === head) {
      head.insertBefore(link, anchor);
    }
  });
  return links;
}

function rememberStylesheetHrefs(hrefs: string[], entityKey: string): void {
  const unique = hrefs.filter(Boolean);
  if (unique.length > 0 && entityKey) {
    stylesheetCacheByEntity.set(entityKey, unique);
  }
}

function getCachedStylesheetHrefs(entityKey: string): string[] {
  if (!entityKey) {
    return [];
  }
  return stylesheetCacheByEntity.get(entityKey) ?? [];
}

function getStoredStylesheetHrefs(element: HTMLElement): string[] {
  const raw = element.dataset[STYLESHEET_HREFS_DATASET];
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function resolveStylesheetHrefs(
  element: HTMLElement,
  entityKey: string,
): { hrefs: string[]; source: 'live' | 'dataset' | 'cache' | 'none' } {
  const liveHrefs = findStylesheetLinks(element)
    .map(link => link.href)
    .filter(Boolean);
  if (liveHrefs.length > 0) {
    return { hrefs: liveHrefs, source: 'live' };
  }
  const storedHrefs = getStoredStylesheetHrefs(element);
  if (storedHrefs.length > 0) {
    return { hrefs: storedHrefs, source: 'dataset' };
  }
  const cachedHrefs = getCachedStylesheetHrefs(entityKey);
  if (cachedHrefs.length > 0) {
    return { hrefs: cachedHrefs, source: 'cache' };
  }
  return { hrefs: [], source: 'none' };
}

function injectStylesheets(
  element: Element,
  hrefs: string[],
): HTMLLinkElement[] {
  const head = element.querySelector('head');
  if (!head || hrefs.length === 0) {
    return [];
  }
  return hrefs.map(href => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    return insertStylesheetInHead(head, link);
  });
}

function renewStylesheetLink(link: HTMLLinkElement): HTMLLinkElement {
  const href = link.href;
  if (!href) {
    return link;
  }
  const head = link.parentNode;
  const fresh = document.createElement('link');
  fresh.rel = 'stylesheet';
  fresh.href = href;
  if (link.media) {
    fresh.media = link.media;
  }
  if (link.crossOrigin) {
    fresh.crossOrigin = link.crossOrigin;
  }
  if (head instanceof Element) {
    insertStylesheetInHead(head, fresh);
    link.remove();
  } else {
    link.replaceWith(fresh);
  }
  return fresh;
}

export type PreparedStylesheets = {
  links: HTMLLinkElement[];
  didRenew: boolean;
};

export function prepareStylesheetsForShadowMount(
  element: HTMLElement,
): PreparedStylesheets {
  const entityKey = getEntityDocsKey();
  const liveLinks = findStylesheetLinks(element);
  const { hrefs } = resolveStylesheetHrefs(element, entityKey);
  let links = liveLinks;
  let didRenew = false;

  if (links.length === 0 && hrefs.length > 0) {
    links = injectStylesheets(element, hrefs);
    links = links.map(link => renewStylesheetLink(link));
    didRenew = true;
  } else if (links.length > 0) {
    links = ensureLinksBeforeBackstageStyle(element, links);
    rememberStylesheetHrefs(
      links.map(link => link.href),
      entityKey,
    );
  }

  return { links, didRenew };
}

export function notifyShadowDomStylesLoaded(
  element: HTMLElement,
  stylesheetLinks: HTMLLinkElement[],
  didRenew: boolean,
): void {
  if (!(element.getRootNode() instanceof ShadowRoot)) {
    return;
  }

  const links = stylesheetLinks ?? [];
  const event = new CustomEvent(SHADOW_DOM_STYLE_LOAD_EVENT);

  if (!links.length) {
    return;
  }

  let pending = links.length;
  const maybeDone = () => {
    if (--pending === 0) {
      const entityKey = getEntityDocsKey();
      rememberStylesheetHrefs(
        links.map(link => link.href),
        entityKey,
      );
      element.dispatchEvent(event);
    }
  };

  links.forEach(link => {
    if (!didRenew && link.sheet) {
      maybeDone();
    } else {
      link.addEventListener('load', maybeDone, { once: true });
      link.addEventListener('error', maybeDone, { once: true });
    }
  });
}
