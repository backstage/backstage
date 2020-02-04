import { REGISTER_FEATURE_FLAG } from 'shared/apis/featureFlags/featureFlagsConstants';

const featureFlagsReducer = (state = [], action) => {
  switch (action.type) {
    case REGISTER_FEATURE_FLAG:
      return [...state, action.payload];
    default:
      return state;
  }
};

export default featureFlagsReducer;
