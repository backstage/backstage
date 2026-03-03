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

import React, { useState, useCallback, useRef, useEffect } from 'react';

import { Settings } from 'lucide-react';

import {
  TechDocsAddonLocations as locations,
  useTechDocsAddons,
  useTechDocsReaderPage,
} from '@backstage/plugin-techdocs-react';

/**
 * Props accepted by the subheader toolbar container element.
 * Replaces the former MUI ToolbarProps with standard HTML div attributes.
 * @public
 */
export type TechDocsSubheaderToolbarProps =
  React.HTMLAttributes<HTMLDivElement>;

/**
 * Renders the reader page subheader.
 * Please use the Tech Docs add-ons to customize it
 * @public
 */
export const TechDocsReaderPageSubheader = (props: {
  toolbarProps?: TechDocsSubheaderToolbarProps;
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  /* Close the settings dropdown when clicking outside */
  useEffect(() => {
    if (!open) return undefined;
    const onMouseDown = (event: globalThis.MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  const {
    entityMetadata: { value: entityMetadata, loading: entityMetadataLoading },
  } = useTechDocsReaderPage();

  const addons = useTechDocsAddons();

  const subheaderAddons = addons.renderComponentsByLocation(
    locations.Subheader,
  );

  const settingsAddons = addons.renderComponentsByLocation(locations.Settings);

  if (!subheaderAddons && !settingsAddons) return null;

  // No entity metadata = 404. Don't render subheader on 404.
  if (entityMetadataLoading === false && !entityMetadata) return null;

  const { className: toolbarClassName, ...restToolbarProps } =
    props.toolbarProps ?? {};

  return (
    <div
      role="toolbar"
      className={[
        'flex flex-col min-h-0 px-6 pt-6 pb-0 print:hidden',
        toolbarClassName,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ gridArea: 'pageSubheader' }}
      {...restToolbarProps}
    >
      <div className="flex justify-end w-full flex-wrap">
        {subheaderAddons}
        {settingsAddons ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-controls="tech-docs-reader-page-settings"
              aria-haspopup="true"
              aria-expanded={open}
              onClick={handleClick}
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
            {open && (
              <div
                id="tech-docs-reader-page-settings"
                className="absolute right-0 top-full mt-1 z-50 min-w-[8rem] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
                role="menu"
              >
                {settingsAddons}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
