import React from 'react';
import { branch, renderComponent } from 'recompose';

import EmptyState from 'shared/components/EmptyState';

/**
 * A higher-order-component, suitable for use with recompose on graphql enabled components, displays
 * EmptyState if the property returned by the propSelector is null or has no entries.
 *
 * Examples:
 * @see {@link src/shared/components/EmptyState/EmptyState.js}
 *
 * @param info The info object to be passed to EmptyState
 * @param propSelector A function that takes the component props, and returns the prop that
 *                     represents the data.
 *                     there is a prop named "data".
 * @returns A higher order component suitable for recompose
 */
export default function isEmpty(info, propSelector) {
  return branch(
    props => {
      const value = propSelector(props);
      if (value) {
        if (Array.isArray(value)) {
          return value.length === 0;
        }
        return false;
      }
      return true;
    },
    renderComponent(() => <EmptyState info={info} />),
  );
}
