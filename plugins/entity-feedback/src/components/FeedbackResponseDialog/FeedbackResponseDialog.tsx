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

import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { Progress } from '@backstage/core-components';
import { ErrorApiError, errorApiRef, useApi } from '@backstage/core-plugin-api';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  FormHelperText,
  Grid,
  makeStyles,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { ReactNode, useState } from 'react';
import useAsyncFn from 'react-use/lib/useAsyncFn';

import { entityFeedbackApiRef } from '../../api';

/**
 * @public
 */
export interface EntityFeedbackResponse {
  id: string;
  label: string;
}

const defaultFeedbackResponses: EntityFeedbackResponse[] = [
  { id: 'incorrect', label: 'Incorrect info' },
  { id: 'missing', label: 'Missing info' },
  { id: 'other', label: 'Other (please specify below)' },
];

/**
 * @public
 */
export interface FeedbackResponseDialogProps {
  entity: Entity;
  feedbackDialogResponses?: EntityFeedbackResponse[];
  feedbackDialogTitle?: ReactNode;
  open: boolean;
  onClose: () => void;
  enableValidation?: boolean;
  showCommentsTextBox?: boolean;
}

const useStyles = makeStyles({
  contactConsent: {
    marginTop: '5px',
  },
});

export const FeedbackResponseDialog = (props: FeedbackResponseDialogProps) => {
  const {
    entity,
    feedbackDialogResponses = defaultFeedbackResponses,
    feedbackDialogTitle = 'Please provide feedback on what can be improved',
    open,
    onClose,
    enableValidation = false,
    showCommentsTextBox = true,
  } = props;
  const classes = useStyles();
  const errorApi = useApi(errorApiRef);
  const feedbackApi = useApi(entityFeedbackApiRef);
  const [responseSelections, setResponseSelections] = useState(() => {
    const initialSelections = Object.fromEntries(
      feedbackDialogResponses.map(r => [r.id, false]),
    );
    if (!initialSelections.hasOwnProperty('other')) {
      initialSelections.other = false;
    }
    return initialSelections;
  });
  const [comments, setComments] = useState('');
  const [consent, setConsent] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [{ loading: saving }, saveResponse] = useAsyncFn(async () => {
    try {
      setErrorMessage(''); // Clear any previous error message

      if (
        enableValidation &&
        Object.keys(responseSelections).every(key =>
          key !== 'other' ? !responseSelections[key] : true,
        )
      ) {
        setErrorMessage('Please select at least one reason.');
        return;
      }

      if (showCommentsTextBox && responseSelections.other && !comments) {
        setErrorMessage('Please add some comments.');
        return;
      }

      await feedbackApi.recordResponse(stringifyEntityRef(entity), {
        comments,
        consent,
        response: Object.keys(responseSelections)
          .filter(id => responseSelections[id])
          .join(','),
      });
      onClose();
    } catch (e) {
      errorApi.post(e as ErrorApiError);
    }
  }, [
    comments,
    consent,
    entity,
    feedbackApi,
    enableValidation,
    onClose,
    responseSelections,
    showCommentsTextBox,
  ]);

  return (
    <Dialog open={open} onClose={() => !saving && onClose()}>
      {saving && <Progress />}
      <DialogTitle>{feedbackDialogTitle}</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <FormLabel component="legend">Choose all that applies</FormLabel>
          <FormGroup>
            {feedbackDialogResponses.map(response => (
              <FormControlLabel
                key={response.id}
                control={
                  <Checkbox
                    checked={responseSelections[response.id]}
                    disabled={saving}
                    name={response.id}
                    onChange={e =>
                      setResponseSelections({
                        ...responseSelections,
                        [e.target.name]: e.target.checked,
                      })
                    }
                  />
                }
                label={response.label}
              />
            ))}
          </FormGroup>
          {enableValidation &&
          Object.keys(responseSelections).every(key =>
            key !== 'other' ? !responseSelections[key] : true,
          ) ? (
            <FormHelperText error>
              *select the reason listed above
            </FormHelperText>
          ) : null}
        </FormControl>
        {showCommentsTextBox && responseSelections.other === true && (
          <FormControl fullWidth>
            <TextField
              data-testid="feedback-response-dialog-comments-input"
              disabled={saving}
              label="Additional comments"
              multiline
              minRows={2}
              onChange={e => setComments(e.target.value)}
              variant="outlined"
              value={comments}
            />
            {showCommentsTextBox && !comments && (
              <FormHelperText error>*add some comments</FormHelperText>
            )}
          </FormControl>
        )}
        <Typography className={classes.contactConsent}>
          Can we reach out to you for more info?
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>No</Grid>
            <Grid item>
              <Switch
                checked={consent}
                disabled={saving}
                onChange={e => setConsent(e.target.checked)}
              />
            </Grid>
            <Grid item>Yes</Grid>
          </Grid>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button color="primary" disabled={saving} onClick={onClose}>
          Close
        </Button>
        <Button
          color="primary"
          data-testid="feedback-response-dialog-submit-button"
          disabled={saving || errorMessage !== ''}
          onClick={saveResponse}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
