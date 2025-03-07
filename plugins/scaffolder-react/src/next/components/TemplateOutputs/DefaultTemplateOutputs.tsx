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
import { InfoCard, MarkdownContent } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import {
  ScaffolderOutputText,
  ScaffolderTaskOutput,
} from '@backstage/plugin-scaffolder-react';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React, { useEffect, useMemo, useState } from 'react';

import { scaffolderReactTranslationRef } from '../../../translation';
import { LinkOutputs } from './LinkOutputs';
import { TextOutputs } from './TextOutputs';

/**
 * The DefaultOutputs renderer for the scaffolder task output
 *
 * @alpha
 */
export const DefaultTemplateOutputs = (props: {
  output?: ScaffolderTaskOutput;
}) => {
  const { t } = useTranslationRef(scaffolderReactTranslationRef);
  const { output } = props;
  const [textOutputIndex, setTextOutputIndex] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    if (textOutputIndex === undefined && output?.text) {
      const defaultIndex = output.text.findIndex(
        (text: ScaffolderOutputText) => text.default,
      );
      setTextOutputIndex(defaultIndex >= 0 ? defaultIndex : 0);
    }
  }, [textOutputIndex, output]);

  const textOutput = useMemo(
    () =>
      textOutputIndex !== undefined ? output?.text?.[textOutputIndex] : null,
    [output, textOutputIndex],
  );

  if (!output) {
    return null;
  }

  const displayTextButtons = (output.text || []).length > 1;
  const emptyOutput = (output.links || []).length === 0 && !displayTextButtons;

  return (
    <>
      {!emptyOutput ? (
        <Box paddingBottom={2} data-testid="output-box">
          <Paper>
            <Box
              padding={2}
              justifyContent="center"
              display="flex"
              gridGap={16}
              flexWrap="wrap"
            >
              {displayTextButtons && (
                <TextOutputs
                  data-testid="text-outputs"
                  output={output}
                  index={textOutputIndex}
                  setIndex={setTextOutputIndex}
                />
              )}
              <LinkOutputs output={output} />
            </Box>
          </Paper>
        </Box>
      ) : null}
      {textOutput ? (
        <Box paddingBottom={2} data-testid="text-output-box">
          <InfoCard
            title={textOutput.title ?? t('templateOutputs.title')}
            noPadding
            titleTypographyProps={{ component: 'h2' }}
          >
            <Box padding={2} height="100%">
              <MarkdownContent content={textOutput.content ?? ''} />
            </Box>
          </InfoCard>
        </Box>
      ) : null}
    </>
  );
};
