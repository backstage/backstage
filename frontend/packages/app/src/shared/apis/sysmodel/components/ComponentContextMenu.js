import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import MoveIcon from '@material-ui/icons/SwapHoriz';
import { DeleteIcon } from 'shared/icons';
import FormHelperErrorText from 'shared/components/form/FormHelperErrorText';
import SysmodelClient from 'shared/apis/sysmodel/SysmodelClient';
import { evictGraphqlCacheEntity } from 'shared/apis/backstage/graphqlClient';
import ConfirmPrompt from 'shared/components/ConfirmPrompt';
import ComponentResourceChecker from './ComponentResourceChecker';
import HeaderActionMenu from 'shared/components/layout/HeaderActionMenu';

const UnregisterPrompt = ({ componentId, componentType, componentLocation, roles, children }) => {
  const history = useHistory();

  const handleConfirm = async () => {
    await SysmodelClient.unregisterComponent(componentId, componentLocation);
    history.push('/');
  };
  return (
    <ConfirmPrompt
      title="Are you sure you want to unregister this component?"
      confirmButtonText="Unregister"
      content={
        <Fragment>
          This action will unregister <strong>{componentId}</strong>. To undo, just re-register the component in
          Backstage.
          <ComponentResourceChecker {...{ roles, componentId, componentType }} />
        </Fragment>
      }
      successMessage={`Unregistered ${componentId}`}
      failureMessage={`Failed to unregister ${componentId}`}
      onConfirm={handleConfirm}
    >
      {children}
    </ConfirmPrompt>
  );
};

const MovePrompt = ({ componentId, componentLocation, children }) => {
  const [newLocation, setNewLocation] = React.useState('');
  const [newLocationError, setNewLocationError] = React.useState('');

  const handleNewLocationInput = event => {
    const { value } = event.target;
    const regex = new RegExp('^(https?:\\/\\/)?ghe\\.spotify\\.net\\/.*\\.yaml$');

    setNewLocation(value);
    setNewLocationError(regex.test(value) ? '' : 'Must be a valid ghe.spotify.net url.');
  };

  const handleConfirm = async () => {
    await SysmodelClient.moveComponentLocation(componentLocation, SysmodelClient.generateSysmodelUri(newLocation));
    await evictGraphqlCacheEntity('components');
  };

  return (
    <ConfirmPrompt
      title="Move component"
      confirmButtonText="Move"
      confirmButtonDisabled={!!newLocationError}
      content={
        <Fragment>
          Move <strong>{componentId}</strong> from <em>{componentLocation}</em> to:{' '}
          <TextField
            label="Service-info YAML file URL"
            margin="normal"
            placeholder="https://ghe.spotify.net/user/some-service/blob/master/service-info.yaml"
            fullWidth={true}
            error={!!newLocationError}
            style={{ width: '100%' }}
            onChange={handleNewLocationInput}
            value={newLocation}
          />
          {newLocationError && <FormHelperErrorText error>{newLocationError}</FormHelperErrorText>}
        </Fragment>
      }
      successMessage={`Moved ${componentId} to ${newLocation}`}
      failureMessage={`Failed to move ${componentId}`}
      onConfirm={handleConfirm}
    >
      {children}
    </ConfirmPrompt>
  );
};

const ComponentContextMenu = ({ componentId, componentType, componentLocation, roles }) => {
  return (
    <HeaderActionMenu
      actionItems={[
        {
          label: 'Unregister component',
          icon: <DeleteIcon />,
          WrapperComponent: ({ children }) => (
            <UnregisterPrompt
              componentId={componentId}
              componentType={componentType}
              componentLocation={componentLocation}
              roles={roles}
              children={children}
            />
          ),
        },
        {
          label: 'Move repository',
          icon: <MoveIcon />,
          WrapperComponent: ({ children }) => (
            <MovePrompt componentId={componentId} componentLocation={componentLocation} children={children} />
          ),
        },
      ]}
    />
  );
};

ComponentContextMenu.propTypes = {
  componentType: PropTypes.string.isRequired,
  componentId: PropTypes.string.isRequired,
  componentLocation: PropTypes.string.isRequired,
  roles: PropTypes.arrayOf(PropTypes.object),
};

export default ComponentContextMenu;
