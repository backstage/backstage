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
import type { PropsWithChildren } from 'react';
import { Button } from '@material-ui/core';
import {
  GoldenPathParameterSchema,
  StartButton,
  useGoldenPathContext,
} from '@backstage/plugin-golden-paths-react';
import { Form, ReviewState } from '@backstage/plugin-scaffolder-react/alpha';
import { customizeValidator } from '@rjsf/validator-ajv8';
import ajvErrors from 'ajv-errors';

import {
  ButtonsContainer,
  ReviewContainer,
  StyledInfoCard,
} from './ContentCard.styles';
import { useContentCard } from './ContentCard.utils';

const validator = customizeValidator();
ajvErrors(validator.ajv);

type Props = PropsWithChildren & {
  manifest: GoldenPathParameterSchema;
};

export const ContentCard = ({ manifest }: Props) => {
  const {
    formState,
    reviewSchemas,
    formSchema,
    formUiSchema,
    isFilled,
    goBack,
    handleSubmit,
    handleChange,
    fields,
  } = useContentCard(manifest);
  const { defaultParams } = useGoldenPathContext();

  const formData = defaultParams || formState;

  return (
    <StyledInfoCard title="Provide the following information to start">
      {isFilled ? (
        <ReviewContainer>
          <ReviewState formState={formState} schemas={reviewSchemas} />
          <ButtonsContainer>
            <Button onClick={goBack}>Back</Button>
            <StartButton initialParams={formState} />
          </ButtonsContainer>
        </ReviewContainer>
      ) : (
        <Form
          validator={validator}
          formData={formData}
          formContext={{ formData }}
          onChange={handleChange}
          schema={formSchema}
          uiSchema={formUiSchema}
          onSubmit={handleSubmit}
          fields={fields}
        >
          <ButtonsContainer>
            <Button disabled>Back</Button>
            <Button variant="contained" color="primary" type="submit">
              Review
            </Button>
          </ButtonsContainer>
        </Form>
      )}
    </StyledInfoCard>
  );
};
