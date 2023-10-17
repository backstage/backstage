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

import { StreamLanguage } from '@codemirror/language';
import { yaml as yamlSupport } from '@codemirror/legacy-modes/mode/yaml';
import { showPanel } from '@codemirror/view';
import { IconButton, makeStyles, Paper, Tooltip } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import SaveIcon from '@material-ui/icons/Save';
import { useKeyboardEvent } from '@react-hookz/web';
import CodeMirror from '@uiw/react-codemirror';
import React, { useMemo } from 'react';
import { useDirectoryEditor } from './DirectoryEditorContext';

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  codeMirror: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  errorPanel: {
    color: theme.palette.error.main,
    lineHeight: 2,
    margin: theme.spacing(0, 1),
  },
  floatingButtons: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(3),
  },
  floatingButton: {
    padding: theme.spacing(1),
  },
}));

/** A wrapper around CodeMirror with an error panel and extra actions available */
export function TemplateEditorTextArea(props: {
  content?: string;
  onUpdate?: (content: string) => void;
  errorText?: string;
  onSave?: () => void;
  onReload?: () => void;
}) {
  const { errorText } = props;
  const classes = useStyles();

  const panelExtension = useMemo(() => {
    if (!errorText) {
      return showPanel.of(null);
    }

    const dom = document.createElement('div');
    dom.classList.add(classes.errorPanel);
    dom.textContent = errorText;
    return showPanel.of(() => ({ dom, bottom: true }));
  }, [classes, errorText]);

  useKeyboardEvent(
    e => e.key === 's' && (e.ctrlKey || e.metaKey),
    e => {
      e.preventDefault();
      if (props.onSave) {
        props.onSave();
      }
    },
  );

  return (
    <div className={classes.container}>
      <CodeMirror
        className={classes.codeMirror}
        theme="dark"
        height="100%"
        extensions={[StreamLanguage.define(yamlSupport), panelExtension]}
        value={props.content}
        onChange={props.onUpdate}
      />
      {(props.onSave || props.onReload) && (
        <div className={classes.floatingButtons}>
          <Paper>
            {props.onSave && (
              <Tooltip title="Save file">
                <IconButton
                  className={classes.floatingButton}
                  onClick={() => props.onSave?.()}
                >
                  <SaveIcon />
                </IconButton>
              </Tooltip>
            )}
            {props.onReload && (
              <Tooltip title="Reload file">
                <IconButton
                  className={classes.floatingButton}
                  onClick={() => props.onReload?.()}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            )}
          </Paper>
        </div>
      )}
    </div>
  );
}

/** A version of the TemplateEditorTextArea that is connected to the DirectoryEditor context */
export function TemplateEditorDirectoryEditorTextArea(props: {
  errorText?: string;
}) {
  const directoryEditor = useDirectoryEditor();

  const actions = directoryEditor.selectedFile?.dirty
    ? {
        onSave: () => directoryEditor.save(),
        onReload: () => directoryEditor.reload(),
      }
    : {
        onReload: () => directoryEditor.reload(),
      };

  return (
    <TemplateEditorTextArea
      errorText={props.errorText}
      content={directoryEditor.selectedFile?.content}
      onUpdate={content => directoryEditor.selectedFile?.updateContent(content)}
      {...actions}
    />
  );
}

TemplateEditorTextArea.DirectoryEditor = TemplateEditorDirectoryEditorTextArea;
