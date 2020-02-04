import React from 'react';
import { branch, compose, renderComponent } from 'recompose';

import Error from 'shared/components/Error';
import Progress from 'shared/components/Progress';
import DataNotFound from 'shared/components/DataNotFound';

/**
 * A higher-order-component, suitable for use with recompose on graphql enabled components, that
 * draws a spinner or an error screen, where appropriate, instead of the target component.
 *
 * @param [propSelector] A function that takes the component props, and returns the prop that
 *                     represents the data being loaded. If no parameter is given, assumes that
 *                     there is a prop named "data".
 * @returns A
 */

export default function errorOrLoading(propSelector) {
  const prop = propSelector || (props => props.data);

  // If we are currently loading data, show a spinner
  const loading = branch(
    props => prop(props).loading,
    renderComponent(() => <Progress />),
  );

  // If the data failed to load, show an error screen
  const error = branch(
    props => prop(props).error,
    renderComponent(props => {
      const error = prop(props).error;
      const { graphQLErrors } = error;
      if (
        Array.isArray(graphQLErrors) &&
        graphQLErrors.length > 0 &&
        graphQLErrors[0].message &&
        graphQLErrors[0].message.includes('Not found')
      ) {
        return <DataNotFound error={graphQLErrors[0].message} path={props.location.pathname} />;
      }
      return <Error error={error} />;
    }),
  );

  return compose(loading, error);
}
