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

import { stringifyEntityRef } from '@backstage/catalog-model';
import { Progress } from '@backstage/core-components';
import {
  ErrorApiError,
  errorApiRef,
  identityApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { useAsyncEntity } from '@backstage/plugin-catalog-react';
import { IconButton } from '@material-ui/core';
import StarOutlineIcon from '@material-ui/icons/StarOutline';
import StarIcon from '@material-ui/icons/Star';
import React, { ReactNode, useCallback, useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import useAsyncFn from 'react-use/lib/useAsyncFn';

import { entityFeedbackApiRef } from '../../api';
import {
  EntityFeedbackResponse,
  FeedbackResponseDialog,
} from '../FeedbackResponseDialog';

export enum FeedbackRatings {
  one = 1,
  two = 2,
  three = 3,
  four = 4,
  five = 5,
}

/**
 * @public
 */
export interface StarredRatingButtonsProps {
  feedbackDialogResponses?: EntityFeedbackResponse[];
  feedbackDialogTitle?: ReactNode;
  requestResponse?: boolean;
  requestResponseThreshold?: number;
}

export const StarredRatingButtons = (props: StarredRatingButtonsProps) => {
  const {
    feedbackDialogResponses,
    feedbackDialogTitle,
    requestResponse = true,
    requestResponseThreshold = FeedbackRatings.two,
  } = props;
  const errorApi = useApi(errorApiRef);
  const feedbackApi = useApi(entityFeedbackApiRef);
  const identityApi = useApi(identityApiRef);
  const [rating, setRating] = useState<FeedbackRatings>();
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const { entity, loading: loadingEntity } = useAsyncEntity();

  const { loading: loadingFeedback } = useAsync(async () => {
    // Wait until entity is loaded
    if (!entity) {
      return;
    }

    try {
      const identity = await identityApi.getBackstageIdentity();
      const prevFeedback = await feedbackApi.getRatings(
        stringifyEntityRef(entity),
      );

      const prevRating = prevFeedback.find(
        r => r.userRef === identity.userEntityRef,
      )?.rating;
      if (prevRating) {
        setRating(parseInt(prevRating, 10));
      }
    } catch (e) {
      errorApi.post(e as ErrorApiError);
    }
  }, [entity, feedbackApi, setRating]);

  const [{ loading: savingFeedback }, saveFeedback] = useAsyncFn(
    async (feedback: FeedbackRatings) => {
      try {
        await feedbackApi.recordRating(
          stringifyEntityRef(entity!),
          feedback.toString(),
        );
        setRating(feedback);
      } catch (e) {
        errorApi.post(e as ErrorApiError);
      }
    },
    [entity, feedbackApi, setRating],
  );

  const applyRating = useCallback(
    (feedback: FeedbackRatings) => {
      // Ignore rating if feedback is same as current
      if (feedback === rating) {
        return;
      }

      saveFeedback(feedback);
      if (feedback <= requestResponseThreshold && requestResponse) {
        setOpenFeedbackDialog(true);
      }
    },
    [
      rating,
      requestResponse,
      requestResponseThreshold,
      saveFeedback,
      setOpenFeedbackDialog,
    ],
  );

  if (loadingEntity || loadingFeedback || savingFeedback) {
    return <Progress />;
  }

  return (
    <>
      {Object.values(FeedbackRatings)
        .filter((o): o is number => typeof o === 'number')
        .map(starRating => (
          <IconButton
            key={starRating}
            data-testid={`entity-feedback-star-button-${starRating}`}
            onClick={() => applyRating(starRating as FeedbackRatings)}
          >
            {rating && rating >= starRating ? (
              <StarIcon fontSize="small" />
            ) : (
              <StarOutlineIcon fontSize="small" />
            )}
          </IconButton>
        ))}
      <FeedbackResponseDialog
        entity={entity!}
        open={openFeedbackDialog}
        onClose={() => setOpenFeedbackDialog(false)}
        feedbackDialogResponses={feedbackDialogResponses}
        feedbackDialogTitle={feedbackDialogTitle}
      />
    </>
  );
};
