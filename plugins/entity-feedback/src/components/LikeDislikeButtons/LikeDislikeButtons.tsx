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
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import React, { ReactNode, useCallback, useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import useAsyncFn from 'react-use/lib/useAsyncFn';

import { entityFeedbackApiRef } from '../../api';
import {
  EntityFeedbackResponse,
  FeedbackResponseDialog,
} from '../FeedbackResponseDialog';

export enum FeedbackRatings {
  like = 'LIKE',
  dislike = 'DISLIKE',
  neutral = 'NEUTRAL',
}

/**
 * @public
 */
export interface LikeDislikeButtonsProps {
  feedbackDialogResponses?: EntityFeedbackResponse[];
  feedbackDialogTitle?: ReactNode;
  requestResponse?: boolean;
}

export const LikeDislikeButtons = (props: LikeDislikeButtonsProps) => {
  const {
    feedbackDialogResponses,
    feedbackDialogTitle,
    requestResponse = true,
  } = props;
  const errorApi = useApi(errorApiRef);
  const feedbackApi = useApi(entityFeedbackApiRef);
  const identityApi = useApi(identityApiRef);
  const [rating, setRating] = useState<FeedbackRatings>(
    FeedbackRatings.neutral,
  );
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
      setRating(
        (prevFeedback.find(r => r.userRef === identity.userEntityRef)?.rating ??
          rating) as FeedbackRatings,
      );
    } catch (e) {
      errorApi.post(e as ErrorApiError);
    }
  }, [entity, feedbackApi, setRating]);

  const [{ loading: savingFeedback }, saveFeedback] = useAsyncFn(
    async (feedback: FeedbackRatings) => {
      try {
        await feedbackApi.recordRating(stringifyEntityRef(entity!), feedback);
        setRating(feedback);
      } catch (e) {
        errorApi.post(e as ErrorApiError);
      }
    },
    [entity, feedbackApi, setRating],
  );

  const applyRating = useCallback(
    (feedback: FeedbackRatings) => {
      // Clear rating if feedback is same as current
      if (feedback === rating) {
        saveFeedback(FeedbackRatings.neutral);
        return;
      }

      saveFeedback(feedback);
      if (feedback === FeedbackRatings.dislike && requestResponse) {
        setOpenFeedbackDialog(true);
      }
    },
    [rating, requestResponse, saveFeedback, setOpenFeedbackDialog],
  );

  if (loadingEntity || loadingFeedback || savingFeedback) {
    return <Progress />;
  }

  return (
    <>
      <IconButton
        data-testid="entity-feedback-like-button"
        onClick={() => applyRating(FeedbackRatings.like)}
      >
        {rating === FeedbackRatings.like ? (
          <ThumbUpIcon fontSize="small" />
        ) : (
          <ThumbUpOutlinedIcon fontSize="small" />
        )}
      </IconButton>
      <IconButton
        data-testid="entity-feedback-dislike-button"
        onClick={() => applyRating(FeedbackRatings.dislike)}
      >
        {rating === FeedbackRatings.dislike ? (
          <ThumbDownIcon fontSize="small" />
        ) : (
          <ThumbDownOutlinedIcon fontSize="small" />
        )}
      </IconButton>
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
