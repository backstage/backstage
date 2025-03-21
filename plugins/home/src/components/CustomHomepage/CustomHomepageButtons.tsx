/*
 * Copyright 2023 The Backstage Authors
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
import Button from '@material-ui/core/Button';
import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contentHeaderBtn: {
      marginLeft: theme.spacing(2),
    },
    widgetWrapper: {
      '& > *:first-child': {
        width: '100%',
        height: '100%',
      },
    },
  }),
);

interface CustomHomepageButtonsProps {
  editMode: boolean;
  numWidgets: number;
  clearLayout: () => void;
  setAddWidgetDialogOpen: (open: boolean) => void;
  changeEditMode: (mode: boolean) => void;
  defaultConfigAvailable: boolean;
  restoreDefault: () => void;
}
export const CustomHomepageButtons = (props: CustomHomepageButtonsProps) => {
  const {
    editMode,
    numWidgets,
    clearLayout,
    setAddWidgetDialogOpen,
    changeEditMode,
    defaultConfigAvailable,
    restoreDefault,
  } = props;
  const styles = useStyles();

  return (
    <>
      {!editMode && numWidgets > 0 ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => changeEditMode(true)}
          size="small"
          startIcon={<EditIcon />}
        >
          Edit
        </Button>
      ) : (
        <>
          {defaultConfigAvailable && (
            <Button
              variant="contained"
              className={styles.contentHeaderBtn}
              onClick={restoreDefault}
              size="small"
              startIcon={<CancelIcon />}
            >
              Restore defaults
            </Button>
          )}
          {numWidgets > 0 && (
            <Button
              variant="contained"
              color="secondary"
              className={styles.contentHeaderBtn}
              onClick={clearLayout}
              size="small"
              startIcon={<DeleteIcon />}
            >
              Clear all
            </Button>
          )}
          <Button
            variant="contained"
            className={styles.contentHeaderBtn}
            onClick={() => setAddWidgetDialogOpen(true)}
            size="small"
            startIcon={<AddIcon />}
          >
            Add widget
          </Button>
          {numWidgets > 0 && (
            <Button
              className={styles.contentHeaderBtn}
              variant="contained"
              color="primary"
              onClick={() => changeEditMode(false)}
              size="small"
              startIcon={<SaveIcon />}
            >
              Save
            </Button>
          )}
        </>
      )}
    </>
  );
};
