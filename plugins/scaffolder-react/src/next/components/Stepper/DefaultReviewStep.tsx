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
import { ReviewStepProps } from '@backstage/plugin-scaffolder-react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import { ReviewState, type ReviewStateProps } from '../ReviewState';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderReactTranslationRef } from '../../../translation';
import { ReactNode } from 'react';

const useStyles = makeStyles(
  theme => ({
    backButton: {
      marginRight: theme.spacing(1),
    },
    footer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'right',
      marginTop: theme.spacing(2),
    },
  }),
  { name: 'BackstageTemplateStepper' },
);

/**
 * Default review step component used when no custom ReviewStepComponent is provided
 * @alpha
 */
export const DefaultReviewStep = (
  props: ReviewStepProps & {
    ReviewStateComponent?: (props: ReviewStateProps) => JSX.Element;
    backButtonLabel?: ReactNode;
    createButtonLabel?: ReactNode;
  },
) => {
  const styles = useStyles();
  const { t } = useTranslationRef(scaffolderReactTranslationRef);

  const {
    steps,
    ReviewStateComponent = ReviewState,
    formData,
    handleBack,
    disableButtons,
    handleCreate,
    backButtonLabel = t('stepper.backButtonText'),
    createButtonLabel = t('stepper.createButtonText'),
  } = props;

  return (
    <>
      <ReviewStateComponent formState={formData} schemas={steps} />
      <div className={styles.footer}>
        <Button
          onClick={handleBack}
          className={styles.backButton}
          disabled={disableButtons}
        >
          {backButtonLabel}
        </Button>
        <Button
          disabled={disableButtons}
          variant="contained"
          color="primary"
          onClick={handleCreate}
        >
          {createButtonLabel}
        </Button>
      </div>
    </>
  );
};
