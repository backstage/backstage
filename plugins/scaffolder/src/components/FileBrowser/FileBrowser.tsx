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

import { useMemo, useState, useCallback } from 'react';
import { ChevronDown, ChevronRight, File, Folder } from 'lucide-react';
import { cn } from '@backstage/core-components';

export type FileEntry =
  | {
      type: 'file';
      name: string;
      path: string;
    }
  | {
      type: 'directory';
      name: string;
      path: string;
      children: FileEntry[];
    };

export function parseFileEntries(paths: string[]): FileEntry[] {
  const root: FileEntry = {
    type: 'directory',
    name: '',
    path: '',
    children: [],
  };

  for (const path of paths.slice().sort()) {
    const parts = path.split('/');

    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part === '') {
        throw new Error(`Invalid path part: ''`);
      }

      const entryPath = parts.slice(0, i + 1).join('/');

      const existing = current.children.find(child => child.name === part);
      if (existing?.type === 'file') {
        throw new Error(`Duplicate filename at '${entryPath}'`);
      } else if (existing) {
        current = existing;
      } else {
        if (i < parts.length - 1) {
          const newEntry: FileEntry = {
            type: 'directory',
            name: part,
            path: entryPath,
            children: [],
          };
          const firstFileIndex = current.children.findIndex(
            child => child.type === 'file',
          );
          current.children.splice(firstFileIndex, 0, newEntry);
          current = newEntry;
        } else {
          current.children.push({
            type: 'file',
            name: part,
            path: entryPath,
          });
        }
      }
    }
  }

  return root.children;
}

function FileTreeItem({
  entry,
  selected,
  onSelect,
  level = 0,
}: {
  entry: FileEntry;
  selected?: string;
  onSelect?: (path: string) => void;
  level?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (entry.type === 'file') {
    return (
      <button
        type="button"
        className={cn(
          'flex w-full items-center gap-1.5 rounded-sm px-1.5 py-1 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
          selected === entry.path &&
            'bg-accent text-accent-foreground font-medium',
        )}
        style={{ paddingInlineStart: `${level * 12 + 6}px` }}
        onClick={() => onSelect?.(entry.path)}
        data-path={entry.path}
      >
        <File className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="truncate">{entry.name}</span>
      </button>
    );
  }

  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center gap-1.5 rounded-sm px-1.5 py-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        style={{ paddingInlineStart: `${level * 12 + 6}px` }}
        onClick={() => setIsOpen(prev => !prev)}
        data-path={entry.path}
        data-state={isOpen ? 'open' : 'closed'}
      >
        {isOpen ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="truncate">{entry.name}</span>
      </button>
      {isOpen && (
        <div role="group">
          {entry.children.map(child => (
            <FileTreeItem
              key={child.path}
              entry={child}
              selected={selected}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FileBrowserProps {
  /** A list of all filepaths to show, directories are separated with a `/` */
  filePaths: string[];
  /** The currently selected file */
  selected?: string;
  /** Callback for when a file is selected */
  onSelect?(filePath: string): void;
}

/** A simple file browser that allows you to select individual files */
export function FileBrowser(props: FileBrowserProps) {
  const { filePaths, selected, onSelect } = props;

  const fileTree = useMemo(() => parseFileEntries(filePaths), [filePaths]);

  const handleSelect = useCallback(
    (filePath: string) => {
      if (onSelect && filePaths.includes(filePath)) {
        onSelect(filePath);
      }
    },
    [onSelect, filePaths],
  );

  return (
    <div
      className={cn('whitespace-nowrap overflow-y-auto p-2 text-sm')}
      role="tree"
      aria-label="File browser"
    >
      {fileTree.map(entry => (
        <FileTreeItem
          key={entry.path}
          entry={entry}
          selected={selected}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}
