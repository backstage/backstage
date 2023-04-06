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

import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

const useStyles = makeStyles({
  root: {
    whiteSpace: 'nowrap',
    overflowY: 'auto',
  },
});

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

export function parseFileEntires(paths: string[]): FileEntry[] {
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

function FileTreeItem({ entry }: { entry: FileEntry }) {
  if (entry.type === 'file') {
    return <TreeItem nodeId={entry.path} label={entry.name} />;
  }

  return (
    <TreeItem nodeId={entry.path} label={entry.name}>
      {entry.children.map(child => (
        <FileTreeItem key={child.path} entry={child} />
      ))}
    </TreeItem>
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
  const classes = useStyles();

  const fileTree = useMemo(
    () => parseFileEntires(props.filePaths),
    [props.filePaths],
  );

  return (
    <TreeView
      selected={props.selected}
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeSelect={(_e: unknown, nodeId: string) => {
        if (props.onSelect && props.filePaths.includes(nodeId)) {
          props.onSelect(nodeId);
        }
      }}
    >
      {fileTree.map(entry => (
        <FileTreeItem key={entry.path} entry={entry} />
      ))}
    </TreeView>
  );
}
