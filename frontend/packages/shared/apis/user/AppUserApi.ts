import { AppAuth } from 'core/app/auth';
import { UserApi, User, UserProfile } from './types';

export default class AppUserApi implements UserApi {
  private userPromise: Promise<User> | undefined;
  private profilePromise: Promise<UserProfile> | undefined;

  constructor(private readonly appAuth: AppAuth) {}

  async getUser(): Promise<User> {
    if (!this.userPromise) {
      this.userPromise = this.loadUser();
    }
    return this.userPromise;
  }

  async getProfile(): Promise<UserProfile> {
    if (!this.profilePromise) {
      this.profilePromise = this.loadProfile();
    }
    return this.profilePromise;
  }

  private async loadUser(): Promise<User> {
    const authInfo = await this.appAuth.auth();
    const { userInfo } = authInfo;

    return {
      id: userInfo.id,
      email: userInfo.email,
      groups: userInfo.groups,
      isMocked: false,
    };
  }

  private async loadProfile(): Promise<UserProfile> {
    const profilePromise = this.appAuth.profile();
    const user = await this.getUser();
    try {
      const profile = await profilePromise;

      let { fullName, givenName } = profile;

      if (!fullName) {
        fullName = user.email;
      }

      if (!givenName) {
        if (fullName) {
          const nameParts = fullName.split(/\s+/);
          if (nameParts.length === 2) {
            givenName = nameParts[0];
          } else {
            givenName = user.id;
          }
        } else {
          givenName = user.id;
        }
      }

      let avatarUrl: string | undefined;
      if (profile.avatarData) {
        avatarUrl = `data:image/jpeg;base64,${profile.avatarData.replace(/_/g, '/').replace(/-/g, '+')}`;
      }

      return {
        fullName,
        givenName,
        avatarUrl,
      };
    } catch (error) {
      console.error(`Failed to load user profile, ${error}`);

      return {
        fullName: user.email,
        givenName: user.id,
      };
    }
  }
}
