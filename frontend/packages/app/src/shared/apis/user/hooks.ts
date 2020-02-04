import { useAsync } from 'react-use';
import { getUserApi } from '.';
import { UserProfile } from './types';

export const useProfile = (): UserProfile | undefined => {
  const state = useAsync<UserProfile>(() => getUserApi().getProfile());

  return state.value;
};
