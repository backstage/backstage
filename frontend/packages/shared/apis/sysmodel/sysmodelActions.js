import axios from 'axios';
import { urls } from 'shared/apis/baseUrls';

const baseUrl = urls.sysmodel;
const refreshURL = componentId => `${baseUrl}/api/v1/components/${encodeURIComponent(componentId)}/refresh`;

// TODO: please move this to the SysmodelClient
const refreshAction = componentId => {
  return axios.post(refreshURL(componentId)).then(data => data.data);
};

export { refreshAction };
