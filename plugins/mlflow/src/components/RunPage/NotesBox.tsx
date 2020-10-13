/*
 * Copyright 2020 Spotify AB
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
import React, { useState } from 'react';
import { InfoCard } from '@backstage/core';
import { Button, TextField, Typography } from '@material-ui/core';
import mlFlowClient from '../../index';

type NotesBoxProps = {
  runId?: string;
  noteText?: string;
};

const NotesBox = ({ noteText }: NotesBoxProps) => {
  return (
    <InfoCard
      title="Run Notes"
      subheader="Apparently the MLFlow API doesn't support adding notes."
    >
      {noteText ||
        "No notes on this run. For now you'll have to add them in the native MLFlow web UI"}
    </InfoCard>
  );
};

export default NotesBox;
