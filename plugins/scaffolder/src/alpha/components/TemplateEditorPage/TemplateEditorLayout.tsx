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

import { PropsWithChildren, ReactNode, useState, useEffect } from 'react';
import { cn } from '@backstage/core-components';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

/**
 * Default Tailwind classes for TemplateEditorLayout.
 * Replicates the MUI withStyles grid layout that was previously defined via
 * CSS-in-JS with theme.breakpoints.up('md') responsive behavior.
 */
const defaultLayoutClasses = {
  root: cn(
    'h-full [grid-area:pageContent] grid',
    "[grid-template-areas:'toolbar'_'browser'_'editor'_'preview'_'results']",
    "md:[grid-template-areas:'toolbar_toolbar_toolbar'_'browser_editor_preview'_'results_results_results']",
    'md:grid-cols-[1fr_5fr] md:grid-rows-[auto_1fr_auto]',
  ),
};

/**
 * Main grid layout for the template editor page.
 * Defines a responsive grid with 5 named areas: toolbar, browser, editor,
 * preview, and results. On mobile the areas stack vertically; on md+ they
 * arrange into a 3-column layout.
 *
 * @param classes - Optional override classes for backward compatibility.
 *                  Parent components (e.g. TemplateFormPreviewer) may pass
 *                  `classes={{ root: "..." }}` to augment or override the
 *                  default Tailwind styles.
 */
export function TemplateEditorLayout({
  children,
  classes,
}: PropsWithChildren<{ classes?: { root?: string } }>) {
  return (
    <main className={cn(defaultLayoutClasses.root, classes?.root)}>
      {children}
    </main>
  );
}

/**
 * Toolbar area within the template editor grid layout.
 * Occupies the "toolbar" grid area.
 */
export function TemplateEditorLayoutToolbar({
  children,
  classes,
}: PropsWithChildren<{ classes?: { root?: string } }>) {
  return (
    <section className={cn('[grid-area:toolbar]', classes?.root)}>
      {children}
    </section>
  );
}

/**
 * File browser area within the template editor grid layout.
 * Occupies the "browser" grid area with overflow scrolling.
 * On md+ screens, displays a right border as a visual divider.
 */
export function TemplateEditorLayoutBrowser({
  children,
  classes,
}: PropsWithChildren<{ classes?: { root?: string } }>) {
  return (
    <section
      className={cn(
        '[grid-area:browser] overflow-auto md:border-r md:border-border',
        classes?.root,
      )}
    >
      {children}
    </section>
  );
}

/**
 * Editor/files area within the template editor grid layout.
 * Occupies the "editor" grid area with overflow scrolling.
 * On md+ screens, takes full height of its grid row.
 */
export function TemplateEditorLayoutFiles({
  children,
  classes,
}: PropsWithChildren<{ classes?: { root?: string } }>) {
  return (
    <section
      className={cn(
        '[grid-area:editor] overflow-auto md:h-full',
        classes?.root,
      )}
    >
      {children}
    </section>
  );
}

/**
 * Preview area within the template editor grid layout.
 * Occupies the "preview" grid area with a default background.
 * Contains an inner scroll container that on md+ screens uses absolute
 * positioning to enable independent scrolling within the grid cell.
 */
export function TemplateEditorLayoutPreview({
  children,
  classes,
}: PropsWithChildren<{ classes?: { root?: string } }>) {
  return (
    <section
      className={cn(
        '[grid-area:preview] relative bg-background md:h-full',
        classes?.root,
      )}
    >
      <div className="h-full p-2 md:absolute md:inset-0 md:overflow-auto">
        {children}
      </div>
    </section>
  );
}

/**
 * Console/results area within the template editor grid layout.
 * Occupies the "results" grid area.
 */
export function TemplateEditorLayoutConsole({
  children,
  classes,
}: PropsWithChildren<{ classes?: { root?: string } }>) {
  return (
    <section className={cn('[grid-area:results]', classes?.root)}>
      {children}
    </section>
  );
}

/**
 * Resize handle between resizable panels in the template editor.
 * Styled as a thin vertical bar with a col-resize cursor and subtle
 * background highlight to indicate the draggable area.
 */
export function TemplateEditorPanelResizeHandle({
  classes,
}: {
  classes?: { root?: string };
}) {
  return (
    <PanelResizeHandle
      className={cn('w-2 cursor-col-resize bg-black/[0.04]', classes?.root)}
    />
  );
}

/**
 * Custom hook that monitors whether the viewport width is at or above the
 * Tailwind md breakpoint (768px). Replaces MUI's useTheme + useMediaQuery
 * combination with a lightweight window.matchMedia listener.
 *
 * Falls back to `false` in environments where `window.matchMedia` is not
 * available (e.g. JSDOM in unit tests), matching the mobile/stacked layout.
 *
 * @returns `true` when the viewport width is >= 768px, `false` otherwise.
 */
function useIsMdUp(): boolean {
  const [isMdUp, setIsMdUp] = useState(false);
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return undefined;
    }
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMdUp(e.matches);
    handler(mediaQuery);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  return isMdUp;
}

/**
 * Renders the files and preview panes as resizable panels on md+ screens,
 * or as stacked blocks on smaller screens. Uses `react-resizable-panels`
 * for the horizontal split layout with a draggable resize handle.
 *
 * @param files - The file editor content to render in the left panel.
 * @param preview - The preview content to render in the right panel.
 * @param autoSaveId - Persistence key for the panel sizes (defaults to
 *                     'template-editor-panels').
 */
export function TemplateEditorPanels({
  files,
  preview,
  autoSaveId = 'template-editor-panels',
}: {
  files: ReactNode;
  preview: ReactNode;
  autoSaveId?: string;
}) {
  const isMdUp = useIsMdUp();

  if (isMdUp) {
    return (
      <PanelGroup direction="horizontal" autoSaveId={autoSaveId}>
        <Panel minSize={15} defaultSize={50}>
          {files}
        </Panel>
        <TemplateEditorPanelResizeHandle />
        <Panel minSize={15} defaultSize={50}>
          {preview}
        </Panel>
      </PanelGroup>
    );
  }
  // Stack as rows for small screens, just render children in a plain block
  return (
    <>
      {files}
      {preview}
    </>
  );
}
