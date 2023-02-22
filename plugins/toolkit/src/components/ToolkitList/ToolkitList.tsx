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
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Alert from '@material-ui/lab/Alert';
import Checkbox from '@material-ui/core/Checkbox';
import { IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Progress, Table, TableColumn } from '@backstage/core-components';
import { identityApiRef, useApi } from '@backstage/core-plugin-api';

import { IToolkit, TActionButton } from '../../interfaces/interface';
import { toolkitApiRef } from '../../api';
import {
  deleteTool,
  getToolkits,
  toggleYourToolkitAlert,
  removeTool,
} from '../../redux/slices/toolkit.slice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { CreateToolkit } from '../CreateToolkit';
import logo from '../../assets/images/backstage_icon-1.jpg';

const useStyles = makeStyles({
  avatar: {
    height: 40,
    width: 40,
    borderRadius: '50%',
  },
});

type DenseTableProps = {
  checkable: boolean;
  onCheck?: (id: number) => void;
  selectedTools?: number[];
};
interface IListData {
  list: IToolkit[];
  error: string;
  message: string;
  loading: boolean;
  showAlert: boolean;
}
type TCheckBox = {
  onCheck: () => void;
  isChecked: boolean;
};

export const CheckBox = ({ onCheck, isChecked }: TCheckBox) => {
  return <Checkbox onClick={onCheck} checked={isChecked} />;
};

export const ActionButton: React.FC<TActionButton> = ({
  onDeleteClick,
  onEdit,
  owner,
  currentUser,
  onRemove,
}) => {
  return (
    <>
      <IconButton
        color="primary"
        disabled={owner !== currentUser}
        onClick={() => owner === currentUser && onEdit()}
      >
        <EditIcon />
      </IconButton>
      <Tooltip title={owner !== currentUser ? 'Remove' : 'Delete'}>
        <IconButton
          color="secondary"
          onClick={() => (owner !== currentUser ? onRemove() : onDeleteClick())}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

type TLogoImage = {
  src: string;
};

export const LogoImage = React.memo(function LogoImage({ src }: TLogoImage) {
  const classes = useStyles();
  return <img loading="lazy" className={classes.avatar} src={src} alt={src} />;
});

export const DenseTable = ({
  onCheck,
  selectedTools,
  checkable,
}: DenseTableProps) => {
  const toolkitApi = useApi(toolkitApiRef);
  const identity = useApi(identityApiRef);

  const dispatch = useAppDispatch();
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [editId, setEditId] = useState<number>(0);
  const [user, setUser] = useState('');
  const { toolkits, myToolkits } = useAppSelector(
    (state: RootState) => state.toolkit,
  );
  const { delete: deleted } = useAppSelector(
    (state: RootState) => state.toolkit,
  );
  const [{ list, error, loading, message, showAlert }, setListData] =
    useState<IListData>({
      list: [],
      error: '',
      loading: false,
      message: '',
      showAlert: false,
    });
  const [columns, setColumns] = React.useState<TableColumn[]>([
    { title: 'Logo', field: 'logo' },
    { title: 'Title', field: 'title' },
    { title: 'URL', field: 'url' },
    { title: 'Type', field: 'type' },
    { title: 'Owner', field: 'owner' },
  ]);
  const [data, setData] = useState<IToolkit[]>([]);

  useEffect(() => {
    const getUser = async () => {
      const useData = await identity.getBackstageIdentity();
      setUser(useData?.userEntityRef);
    };
    getUser();
  }, [identity]);

  useEffect(() => {
    if (!checkable) {
      setListData({ ...myToolkits });
    } else {
      setListData({ ...toolkits });
    }
  }, [myToolkits, toolkits, checkable]);

  useEffect(() => {
    const findSelectCol = columns.find(col => col.field === 'select');
    const findActionCol = columns.find(col => col.field === 'action');

    if (checkable && !findSelectCol) {
      setColumns([{ title: '', field: 'select' }, ...columns]);
      dispatch(getToolkits(toolkitApi));
    } else if (!checkable && !findActionCol) {
      setColumns([...columns, { title: 'Actions', field: 'action' }]);
    }
    // }
  }, [checkable, columns, dispatch, toolkitApi]);

  useEffect(() => {
    const onDelete = (id: number) => {
      dispatch(deleteTool({ toolkitApi, id }));
    };

    const onEdit = (id: number) => {
      setShowEdit(true);
      setEditId(id);
    };

    const onRemove = (toolkit: number) => {
      dispatch(removeTool({ toolkit, toolkitApi }));
    };

    const res = list?.map((toolkit, index) => {
      const isChecked =
        checkable && toolkit?.toolkit
          ? selectedTools?.includes(toolkit?.toolkit)
          : false;
      return {
        select: (
          <>
            {checkable && onCheck && (
              <CheckBox
                onCheck={() => onCheck(Number(toolkit?.toolkit))}
                isChecked={isChecked || false}
              />
            )}
          </>
        ),
        logo: <LogoImage key={index} src={toolkit.logo || logo} />,
        title: `${toolkit.title}`,
        url: toolkit.url,
        type: toolkit.type,
        owner: toolkit.owner,
        action: (
          <ActionButton
            owner={toolkit.owner || ''}
            currentUser={user}
            onRemove={() => onRemove(toolkit.id as number)}
            onEdit={() => onEdit(toolkit.id as number)}
            onDeleteClick={() => onDelete(toolkit.id as number)}
          />
        ),
      } as any;
    });

    setData([...res]);
  }, [list, selectedTools, checkable, dispatch, toolkitApi, onCheck, user]);

  const onEditClose = () => {
    setShowEdit(false);
    setEditId(0);
  };
  const closeAlert = () => {
    dispatch(toggleYourToolkitAlert(!showEdit));
  };

  if (loading) {
    return <Progress />;
  } else if (error && showAlert) {
    return (
      <Alert severity="error" onClose={closeAlert}>
        {message}
      </Alert>
    );
  }
  return (
    <>
      {deleted.error && deleted.showAlert ? (
        <Alert severity="error" onClose={closeAlert}>
          {deleted.error}
        </Alert>
      ) : (
        ''
      )}
      {deleted.message && deleted.showAlert ? (
        <Alert severity="success" onClose={closeAlert}>
          {deleted.message}
        </Alert>
      ) : (
        ''
      )}
      {showEdit ? (
        <CreateToolkit id={editId} show={showEdit} onClose={onEditClose} />
      ) : (
        ''
      )}
      <Table
        options={{ search: false, paging: false, toolbar: false }}
        columns={columns}
        data={data || []}
      />
    </>
  );
};

export const ToolkitList = ({
  checkable,
  selectedTools,
  onCheck,
}: {
  checkable: boolean;
  selectedTools?: number[];
  onCheck?: (id: number) => void;
}) => {
  return (
    <DenseTable
      checkable={checkable}
      selectedTools={selectedTools}
      onCheck={onCheck}
    />
  );
};
