/*
 * Copyright 2021 The Backstage Authors
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

import React, { useEffect } from 'react';
import { Button, Dialog } from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { useForm, UseFormReset, UseFormGetValues } from 'react-hook-form';
import { bazaarApiRef } from '../../api';
import { InputField } from '../InputField/InputField';
import { InputSelector } from '../InputSelector/InputSelector';
import { FormValues } from '../../types';
import { DoubleDateSelector } from '../DoubleDateSelector/DoubleDateSelector';
import {
  CustomDialogTitle,
  DialogActions,
  DialogContent,
} from '../CustomDialogTitle';

type Props = {
  handleSave: (
    getValues: UseFormGetValues<FormValues>,
    reset: UseFormReset<FormValues>,
  ) => Promise<void>;
  isAddForm: boolean;
  title: string;
  defaultValues: FormValues;
  open: boolean;
  projectSelector?: JSX.Element;
  deleteButton?: JSX.Element;
  handleClose: () => void;
};

export const ProjectDialog = ({
  handleSave,
  isAddForm,
  title,
  defaultValues,
  open,
  projectSelector,
  deleteButton,
  handleClose,
}: Props) => {
  const {
    handleSubmit,
    reset,
    control,
    getValues,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues,
  });

  const bazaarApi = useApi(bazaarApiRef);
  const [bazaarProject, fetchBazaarProject] = useAsyncFn(async () => {
    const response = await bazaarApi.getProjects();
    return response;
  });

  const titleIsUnique = (name: string) => {
    if (
      name !== defaultValues.title &&
      bazaarProject.value.data.some(bazaarTitle => bazaarTitle.title === name)
    ) {
      return 'A Bazaar project with this title already exists';
    }
    return true;
  };

  const handleSaveForm = () => {
    handleSave(getValues, reset);
  };

  const handleCloseDialog = () => {
    handleClose();
    reset(defaultValues);
  };

  useEffect(() => {
    fetchBazaarProject();
  }, [fetchBazaarProject]);

  let helperText = 'Please enter a title for your project';
  if (errors.title) {
    if (errors.title.type === 'required') {
      helperText = 'Please enter a title for your project';
    } else {
      helperText = errors.title.message;
    }
  }

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="xs"
        onClose={handleCloseDialog}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <CustomDialogTitle
          id="customized-dialog-title"
          onClose={handleCloseDialog}
        >
          {title}
        </CustomDialogTitle>
        <DialogContent style={{ padding: '1rem', paddingTop: '0rem' }} dividers>
          <InputField
            error={errors.title}
            control={control}
            rules={{
              required: true,
              validate: titleIsUnique,
            }}
            inputType="title"
            helperText={helperText}
          />
          <InputField
            error={errors.description}
            control={control}
            rules={{
              required: true,
            }}
            inputType="description"
            helperText="Please enter a description"
          />

          <InputSelector
            control={control}
            name="status"
            options={['proposed', 'ongoing']}
          />

          <InputSelector
            control={control}
            name="size"
            options={['small', 'medium', 'large']}
          />

          <InputField
            error={errors.responsible}
            control={control}
            rules={{
              required: true,
            }}
            inputType="responsible"
            helperText="Please enter a contact person"
            placeholder="Contact person of the project"
          />

          {isAddForm && projectSelector}

          <InputField
            error={errors.community}
            control={control}
            rules={{
              required: false,
              pattern: RegExp('^(https?)://'),
            }}
            inputType="community"
            helperText="Please enter a link starting with http/https"
            placeholder="Community link to e.g. Teams or Discord"
          />

          <InputField
            error={errors.docs}
            control={control}
            rules={{
              required: false,
              pattern: RegExp('^(https?)://'),
            }}
            inputType="docs"
            helperText="Please enter a link starting with http/https"
            placeholder="Project docs link"
          />

          <DoubleDateSelector setValue={setValue} control={control} />
        </DialogContent>

        <DialogActions>
          {!isAddForm && deleteButton}
          <Button
            onClick={handleSubmit(handleSaveForm)}
            color="primary"
            type="submit"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
