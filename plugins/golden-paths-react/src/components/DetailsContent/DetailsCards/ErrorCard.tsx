/*
 * Copyright 2026 The Backstage Authors
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
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
} from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { useCarouselCardStyles } from './DetailsCards.styles';

export interface ErrorCardProps {
  message: string;
  description?: string;
  onRetry: () => void;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({
  message,
  description,
  onRetry,
}) => {
  const classes = useCarouselCardStyles();

  return (
    <Card className={classes.card}>
      <CardHeader
        classes={{ root: classes.errorHeader }}
        avatar={<ErrorOutlineIcon color="action" />}
        title={
          <Typography variant="h6" color="textPrimary">
            Error
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="textSecondary">
            {message}
          </Typography>
        }
      />
      <CardContent>
        {description && (
          <Typography variant="body2" color="textSecondary">
            {description}
          </Typography>
        )}
        <Box className={classes.buttonBox}>
          <Button variant="contained" color="primary" onClick={onRetry}>
            Retry
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ErrorCard;
