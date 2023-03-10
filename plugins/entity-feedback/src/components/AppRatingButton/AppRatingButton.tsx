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

import { useApi } from '@backstage/core-plugin-api';
import { Box, Typography } from '@material-ui/core';
import { Rating, RatingProps } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { entityFeedbackApiRef } from '../../api';

/**
 * @public
 */
export type AppRatingButtonProps = RatingProps & {
  thankContent?: JSX.Element;
  thanksTimeout?: number;
  title?: string;
};

/**
 * @public
 */
export const AppRatingButton = (props: AppRatingButtonProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [thanksVisible, setThanksVisible] = React.useState(false);
  const ratingApi = useApi(entityFeedbackApiRef);
  const handleChange = (_: any, newRating: number | null) => {
    setRating(newRating);
    setThanksVisible(true);
    setTimeout(() => {
      setThanksVisible(false);
    }, props.thanksTimeout ?? 3000);
  };

  useEffect(() => {
    if (rating) {
      ratingApi.recordAppRating(rating);
    }
  }, [ratingApi, rating]);

  if (!rating) {
    return (
      <Box component="fieldset" borderColor="transparent">
        {props.title && (
          <Typography component="legend">{props.title}</Typography>
        )}
        <Rating onChange={handleChange} {...props} />
      </Box>
    );
  }

  if (!thanksVisible) {
    return null;
  }

  if (props.thankContent) {
    return props.thankContent;
  }

  return <Typography>Thanks for rating!</Typography>;
};
