import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import { User, QueryUserArgs, Maybe } from 'generated/graphql/backstage';

export const THANK_YOU_MESSAGE_QUERY = gql`
  query($username: String!) {
    user(username: $username) {
      components {
        id
      }
      dataEndpoints {
        id
      }
      workflows {
        id
      }
      googleCloudPlatformProjects {
        id
      }
    }
  }
`;

type QueryResponse = {
  user?: Maybe<User>;
};

const LOADING_MESSAGE = 'Thanks for ...';
const FALLBACK_MESSAGE = 'Thanks for being awesome';

/**
 * Formulates a personal "thank you" message based on a user's ownership of things.
 *
 * @param username An LDAP username
 */
export const useThankYouMessage = (username: string) => {
  const { data, loading } = useQuery<QueryResponse, QueryUserArgs>(THANK_YOU_MESSAGE_QUERY, {
    variables: { username },
  });

  if (loading) {
    return LOADING_MESSAGE;
  } else if (!data || !data.user) {
    return FALLBACK_MESSAGE;
  }

  const componentCount =
    (data.user.components || []).length + (data.user.workflows || []).length + (data.user.dataEndpoints || []).length;
  const projectCount = (data.user.googleCloudPlatformProjects || []).length;

  if (componentCount == 0 && projectCount == 0) {
    return FALLBACK_MESSAGE;
  }

  let counts = '';
  if (componentCount > 0) {
    counts += `${componentCount} component`;
    if (componentCount > 1) {
      counts += 's';
    }
    counts += projectCount > 0 ? ' and ' : '';
  }
  if (projectCount > 0) {
    counts += `${projectCount} project`;
    if (projectCount > 1) {
      counts += 's';
    }
  }

  return `Thanks for taking care of ${counts}`;
};
