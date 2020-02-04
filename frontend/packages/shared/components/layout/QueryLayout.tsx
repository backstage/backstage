import React, { ReactNode } from 'react';
import { Query } from '@apollo/react-components';
import Button from '@material-ui/core/Button';
import { EmptyState, Error, Link, Progress } from 'shared/components';
import { Query as BackstageQuery, Component as SysmodelComponent } from 'generated/graphql/backstage';

export interface LayoutProps {
  pollInterval?: number;
  variables?: object;
  handleEmptyCheck?: (data: BackstageQuery) => boolean;
  emptyTitleText?: string;
  emptyHelperText?: string;
  emptyImage?: ReactNode;
  emptyBottomText?: string;
  emptyLink?: string;
  emptyLinkText?: string;
}

export interface ComponentLayoutProps extends LayoutProps {
  children: JSX.Element | ((data: SysmodelComponent) => JSX.Element);
  fragment?: any;
  id: string;
}

export interface QueryLayoutProps extends LayoutProps {
  children: (data: BackstageQuery) => JSX.Element;
  query: any;
}

function QueryLayoutEmptyState({
  emptyTitleText,
  emptyHelperText,
  emptyLink,
  emptyLinkText,
  emptyBottomText,
  emptyImage,
}: LayoutProps) {
  return (
    <EmptyState
      info={{
        title: emptyTitleText,
        helperText: emptyHelperText,
        bottomText: emptyBottomText,
        image: emptyImage,
        button: (
          <Link to={emptyLink || '/'}>
            <Button variant="contained" color="primary">
              {emptyLinkText || 'Backstage Home'}
            </Button>
          </Link>
        ),
      }}
    />
  );
}

QueryLayoutEmptyState.defaultProps = {
  emptyTitleText: 'Not found',
  emptyHelperText: "Sorry, we didn't find anything here.",
  emptyBottomText: '',
};

export default function QueryLayout(props: QueryLayoutProps) {
  const { query, pollInterval, variables, handleEmptyCheck, children } = props;

  return (
    <Query query={query} pollInterval={pollInterval} variables={variables}>
      {({ loading, error, data }: { loading: boolean; error?: Error; data?: BackstageQuery }): JSX.Element => {
        if (loading) {
          return <Progress />;
        }

        if (error && error.message && error.message.includes('Not found')) {
          return <QueryLayoutEmptyState {...props} />;
        }

        if (error) {
          return <Error error={error} />;
        }

        if (!data || (handleEmptyCheck && handleEmptyCheck(data))) {
          return <QueryLayoutEmptyState {...props} />;
        }

        return children(data);
      }}
    </Query>
  );
}

const defaultProps: Partial<LayoutProps> = {
  pollInterval: 0,
};

QueryLayout.defaultProps = defaultProps;
