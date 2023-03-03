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
import { createSlice, createAsyncThunk, Slice } from '@reduxjs/toolkit';
import { ResponseError } from '@backstage/errors';

import { ToolkitApi } from '../../api';
import { IToolkit, IToolkitState } from '../../interfaces/interface';

export const getMyToolkits = createAsyncThunk(
  'toolkit/myToolkits',
  async (toolkitApi: ToolkitApi) => {
    const response = await toolkitApi.getMyToolkits();
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return response.json() as IToolkit[];
  },
);

export const getToolkits = createAsyncThunk(
  'toolkit/getToolkits',
  async (toolkitApi: ToolkitApi) => {
    const response = await toolkitApi.getToolkits();

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return response.json() as IToolkit[];
  },
);

type ICreateData = {
  body: IToolkit;
  id?: number;
  toolkitApi: ToolkitApi;
};
export const createTool = createAsyncThunk(
  'toolkit/create',
  async (data: ICreateData, api) => {
    const response = await data.toolkitApi.createToolkit(data.body);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    api.dispatch(getMyToolkits(data.toolkitApi));

    return response.text();
  },
);
export const updateTool = createAsyncThunk(
  'toolkit/update',
  async (data: ICreateData, api) => {
    const response = await data.toolkitApi.updateToolkit(
      data.body,
      data.id || 0,
    );
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    api.dispatch(getMyToolkits(data.toolkitApi));

    return response.text();
  },
);
type IDeleteTool = {
  id: number;
  toolkitApi: ToolkitApi;
};
export const deleteTool = createAsyncThunk(
  'toolkit/delete',
  async ({ toolkitApi, id }: IDeleteTool, api) => {
    const response = await toolkitApi.deleteOwnToolkit(id);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    api.dispatch(getMyToolkits(toolkitApi));
    return response.text();
  },
);

type IAddTool = {
  toolkits: number[];
  toolkitApi: ToolkitApi;
};

export const addTool = createAsyncThunk(
  'toolkit/add',
  async ({ toolkitApi, toolkits }: IAddTool, api) => {
    const response = await toolkitApi.addToolkits({ toolkits });
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    api.dispatch(getMyToolkits(toolkitApi));
    api.dispatch(getToolkits(toolkitApi));
    return response.text();
  },
);

type IRemoveTool = {
  toolkit: number;
  toolkitApi: ToolkitApi;
};
export const removeTool = createAsyncThunk(
  'toolkit/remove',
  async ({ toolkit, toolkitApi }: IRemoveTool, api) => {
    const response = await toolkitApi.removeToolkit(toolkit);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    api.dispatch(getMyToolkits(toolkitApi));
    api.dispatch(getToolkits(toolkitApi));
    return response.text();
  },
);

const initialState: IToolkitState = {
  showModal: false,
  myToolkits: {
    list: [],
    error: '',
    message: '',
    showAlert: false,
    loading: false,
  },
  toolkits: {
    list: [],
    error: '',
    message: '',
    showAlert: false,
    loading: false,
  },
  create: {
    error: '',
    message: '',
    showAlert: false,
    loading: false,
    success: false,
  },
  add: {
    error: '',
    message: '',
    showAlert: false,
    loading: false,
    success: false,
  },
  delete: {
    error: '',
    message: '',
    showAlert: false,
    loading: false,
    success: false,
  },
  toolkit: {},
};

export const toolkitSlice: Slice<IToolkitState> = createSlice({
  name: 'Toolkit',
  initialState,
  reducers: {
    toggleModal: state => {
      state.showModal = !state.showModal;
    },
    toggleCreateAlert: state => {
      state.create.showAlert = !state.create.showAlert;
    },
    toggleYourToolkitAlert: state => {
      state.toolkits.showAlert = !state.toolkits.showAlert;
    },
    resetCreateSuccess: state => {
      state.create.success = false;
    },
  },
  extraReducers: {
    [getMyToolkits.pending.type]: state => {
      state.myToolkits.loading = true;
      state.myToolkits.error = '';
    },
    [getMyToolkits.rejected.type]: (state, action) => {
      state.myToolkits.loading = false;
      state.myToolkits.error = action.error.message;
    },
    [getMyToolkits.fulfilled.type]: (state, action) => {
      state.myToolkits.loading = false;
      state.myToolkits.error = '';
      state.myToolkits.list = action?.payload || [];
    },
    [getToolkits.pending.type]: state => {
      state.toolkits.loading = true;
      state.toolkits.error = '';
    },
    [getToolkits.rejected.type]: (state, action) => {
      state.toolkits.loading = false;
      state.toolkits.error = action.error.message;
    },
    [getToolkits.fulfilled.type]: (state, action) => {
      state.toolkits.loading = false;
      state.toolkits.error = '';
      state.toolkits.list = action?.payload || [];
    },
    [createTool.pending.type || updateTool.pending.type]: state => {
      state.create.loading = true;
      state.create.error = '';
      state.create.success = false;
    },
    [createTool.rejected.type || updateTool.rejected.type]: (state, action) => {
      state.create.loading = false;
      state.create.error = action.error.message;
      state.create.success = false;
    },
    [createTool.fulfilled.type || updateTool.fulfilled.type]: (
      state,
      action,
    ) => {
      state.create.loading = false;
      state.create.error = '';
      state.create.success = true;
      state.create.message = action?.payload || '';
    },
    [addTool.pending.type]: state => {
      state.create.loading = true;
      state.create.error = '';
      state.create.success = false;
    },
    [addTool.rejected.type]: (state, action) => {
      state.create.loading = false;
      state.create.error = action.error.message;
      state.create.success = false;
    },
    [addTool.fulfilled.type]: (state, action) => {
      state.create.loading = false;
      state.create.error = '';
      state.create.success = true;
      state.create.message = action?.payload || '';
    },
    [deleteTool.pending.type]: state => {
      state.delete.loading = true;
      state.delete.error = '';
      state.delete.success = false;
    },
    [deleteTool.rejected.type]: (state, action) => {
      state.delete.loading = false;
      state.delete.error = action.error.message;
      state.delete.success = false;
    },
    [deleteTool.fulfilled.type]: (state, action) => {
      state.delete.loading = false;
      state.delete.error = '';
      state.delete.success = true;
      state.delete.message = action?.payload || '';
    },
    [removeTool.pending.type]: state => {
      state.delete.loading = true;
      state.delete.error = '';
      state.delete.success = false;
    },
    [removeTool.rejected.type]: (state, action) => {
      state.delete.loading = false;
      state.delete.error = action.error.message;
      state.delete.success = false;
    },
    [removeTool.fulfilled.type]: (state, action) => {
      state.delete.loading = false;
      state.delete.error = '';
      state.delete.success = true;
      state.delete.message = action?.payload || '';
    },
  },
});
export const {
  toggleModal,
  toggleCreateAlert,
  toggleYourToolkitAlert,
  resetCreateSuccess,
} = toolkitSlice.actions;
export default toolkitSlice.reducer;
