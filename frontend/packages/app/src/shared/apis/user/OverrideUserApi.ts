import { UserApi, User, UserProfile } from './types';
import { graphqlClient } from 'shared/apis/backstage/graphqlClient';
import gql from 'graphql-tag';

const query = gql`
  query($username: String!) {
    user(username: $username) {
      fullName
      email
      squads {
        id
      }
      ldapGroups
    }
  }
`;

type QueryResult = {
  user: {
    fullName: string;
    email: string;
    squads: { id: string }[];
    ldapGroups: string[];
  };
};

export default class OverrideUserApi implements UserApi {
  private graphqlPromise?: Promise<QueryResult>;

  constructor(private readonly userId: string) {}

  async getUser(): Promise<User> {
    if (!this.graphqlPromise) {
      this.graphqlPromise = this.loadGraphqlData();
    }

    const { user } = await this.graphqlPromise;

    return {
      id: this.userId,
      email: user.email,
      groups: [
        ...user.squads.map(({ id }: { id: string }) => ({ id, type: 'squad' })),
        ...user.ldapGroups.map((id: string) => ({ id, type: '' })),
      ],
      isMocked: true,
    };
  }

  async getProfile(): Promise<UserProfile> {
    if (!this.graphqlPromise) {
      this.graphqlPromise = this.loadGraphqlData();
    }

    const { user } = await this.graphqlPromise;

    return {
      fullName: user.fullName,
      givenName: this.userId,
    };
  }

  private async loadGraphqlData(): Promise<QueryResult> {
    const result = await graphqlClient.query<QueryResult>({ query, variables: { username: this.userId } });

    if (result.errors) {
      const [error, ...additionalErrors] = result.errors;
      if (additionalErrors.length) {
        for (const additionalError of additionalErrors) {
          console.error(`Additional error when loading override user data, ${additionalError.message}`);
        }
      }
      throw new Error(error.message);
    }

    return result.data;
  }
}
