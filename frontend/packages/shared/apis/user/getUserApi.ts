import { UserApi } from './types';
import { getOverrideUser } from './overrideUtils';
import OverrideUserApi from './OverrideUserApi';
import AppUserApi from './AppUserApi';
import MockUserApi from './MockUserApi';
import appAuth from 'core/app/auth';

// TODO(freben): Exposed like this temporarily; should be supplied via some API provider instead
let instance: UserApi;
export default function getUserApi() {
  if (!instance) {
    if (process.env.NODE_ENV === 'test') {
      instance = new MockUserApi();
    } else {
      const overrideUser = getOverrideUser();
      if (overrideUser) {
        instance = new OverrideUserApi(overrideUser);
      } else {
        instance = new AppUserApi(appAuth);
      }
    }
  }

  return instance;
}
