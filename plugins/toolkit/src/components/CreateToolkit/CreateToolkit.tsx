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
import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';

import { toolkitApiRef } from '../../api';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  createTool,
  resetCreateSuccess,
  updateTool,
} from '../../redux/slices/toolkit.slice';
import { IToolkit } from '../../interfaces/interface';
import { RootState } from '../../redux/store';

const useStyles: any = makeStyles(theme => ({
  inputField: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  errorField: {
    marginLeft: theme.spacing(1),
  },
  radioButton: {
    marginTop: theme.spacing(1),
  },
  formControlLabel: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
}));

type TCreateToolkit = {
  show: boolean;
  id?: number;
  onClose: () => void;
};

const defaultFormData: IToolkit = {
  logo: '',
  title: '',
  url: '',
  type: 'public',
};

export const FieldError = ({ message, className }: any) => {
  return (
    <Typography className={className} color="error" variant="caption">
      {message}
    </Typography>
  );
};

export const CreateToolkit: React.FC<TCreateToolkit> = ({
  id,
  show,
  onClose,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const toolkitApi = useApi(toolkitApiRef);
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(show);
  const { create } = useAppSelector((state: RootState) => state.toolkit);
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState({ ...defaultFormData });
  const [formErr, setFormErr] = useState({ ...defaultFormData });

  const validate = (key: string, value: string) => {
    const imageUrlRegex = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/;
    const urlRegex =
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    const titleRegex = /^[a-z A-Z]*$/;

    const validateTitle = () => {
      if (value?.length) {
        if (titleRegex?.test(value)) {
          return '';
        }
        return 'Special character or numbers are not allowed';
      }
      return `Title can't be empty`;
    };

    if (key === 'logo') {
      formErr[key] =
        imageUrlRegex.test(value) || !value ? '' : `Logo url is invalid `;
    } else if (key === 'url') {
      formErr[key] = value.match(urlRegex) ? '' : `URL is invalid or empty`;
    } else if (key === 'title') {
      formErr[key] = validateTitle();
    }

    setFormErr({ ...formErr });
  };
  const getToolkit = async (toolId: number) => {
    const res = await toolkitApi.getToolkitById(toolId);
    if (res.ok) {
      const data = await res.json();
      setFormData({ ...data });
    }
  };

  useEffect(() => {
    if (id) {
      getToolkit(id);
    }
    setShowModal(show);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, show]);

  useEffect(() => {
    if (create.success) {
      onClose();
      dispatch(resetCreateSuccess(!showModal));
    }
  }, [create, dispatch, onClose, showModal]);

  const handleChange = (e: any) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
    validate(e.target.name, e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!formErr.logo && !formErr.title && !formErr.url) {
      if (formData.title && formData.url) {
        if (id) {
          dispatch(
            updateTool({
              body: {
                logo: formData.logo,
                title: formData.title,
                url: formData.url,
                type: formData.type,
              },
              id,
              toolkitApi,
            }),
          );
        } else {
          dispatch(createTool({ body: formData, toolkitApi }));
        }
        onClose();
      } else {
        formErr.title = formData.title ? '' : `Title can't be empty`;
        formErr.url = formData.url ? '' : `URL can't be empty`;
        setFormErr({ ...formErr });
      }
    }
  };
  return (
    <Dialog
      maxWidth="sm"
      fullWidth={!fullScreen}
      onClose={onClose}
      aria-labelledby="simple-dialog-title"
      open={showModal}
    >
      <DialogTitle id="simple-dialog-title">Create a toolkit</DialogTitle>
      <DialogContent>
        <form noValidate className={classes.form}>
          <TextField
            id="logo"
            label="Logo URL"
            type="text"
            className={classes.inputField}
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            variant="outlined"
            required
          />
          <FieldError className={classes.errorField} message={formErr.logo} />
          <TextField
            id="Title"
            label="Title"
            maxRows={4}
            minRows={3}
            value={formData.title}
            onChange={handleChange}
            className={classes.inputField}
            name="title"
            variant="outlined"
            required
          />
          <FieldError className={classes.errorField} message={formErr.title} />
          <TextField
            id="url"
            label="Url"
            maxRows={4}
            minRows={3}
            value={formData.url}
            onChange={handleChange}
            className={classes.inputField}
            name="url"
            type="url"
            variant="outlined"
            required
          />
          <FieldError className={classes.errorField} message={formErr.url} />
          <FormControl className={classes.formControlLabel}>
            <FormLabel id="demo-form-control-label-placement">Type</FormLabel>
            <RadioGroup
              row
              name="type"
              defaultValue="public"
              value={formData.type}
              onChange={handleChange}
              color="primary"
              className={classes.radioButton}
            >
              <FormControlLabel
                value="public"
                name="type"
                control={<Radio color="primary" />}
                label="Public"
              />
              <FormControlLabel
                value="private"
                name="type"
                control={<Radio color="primary" />}
                label="Private"
              />
            </RadioGroup>
          </FormControl>
          <Button color="primary" variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
