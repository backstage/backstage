import React from 'react';
import { Tooltip, withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { useFavorite } from 'shared/apis/storage/favorites';
import IconButton from 'shared/components/IconButton';
import { FavoriteIcon, AddFavoriteIcon } from 'shared/icons';

const styles = {
  button: {
    width: 48,
    height: 48,
    padding: 0,
    marginTop: -10,
  },
};

function formatTitle(title) {
  // Remove the "Backstage" part at the end and reverse order, configured by Helmet.
  let parts = title.split(' | ');
  if (parts.length > 1) {
    parts.pop();
  }
  return parts.join(' - ');
}

const FavoriteButton = ({ path, title, classes, className, location: { pathname } }) => {
  // path and title props can be used to override info that will otherwise be read from the page
  let usedPath = path || pathname;

  // Transform favorite object into boolean to avoid rerenders when the object reference changes.
  let [favorite, saveFavorite, clearFavorite] = useFavorite(usedPath);

  const handleClick = () => {
    if (favorite) {
      clearFavorite();
    } else {
      // Important to grab title at this point in case document changed since render.
      saveFavorite(formatTitle(title || document.title));
    }
  };

  return (
    <Tooltip
      title={favorite ? 'Remove page from the list of your favorites' : 'Add page to the list of your favorites'}
    >
      <IconButton
        alt={favorite ? 'Unfavourited' : 'Favourited'}
        data-testid="favorite-button"
        classes={{ root: classes.button }}
        className={className}
        onClick={handleClick}
      >
        {favorite ? <FavoriteIcon /> : <AddFavoriteIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default compose(withRouter, withStyles(styles))(FavoriteButton);
