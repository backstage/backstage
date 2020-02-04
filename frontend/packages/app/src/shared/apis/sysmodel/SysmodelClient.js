import axios from 'axios';
import { googleAuth } from 'shared/apis/googleAuthV2';
import { evictGraphqlCacheEntity } from 'shared/apis/backstage/graphqlClient';
import { urls } from 'shared/apis/baseUrls';

const SYSMODEL_URL = urls.sysmodel;

async function authHeaderForScopes(scopes) {
  const token = await googleAuth.getAccessToken(scopes);
  return {
    Authorization: `Bearer ${token}`,
  };
}

class SysmodelClient {
  static SYSMODEL_ENDPOINTS = {
    components: `${SYSMODEL_URL}/v1/components`,
    locations: `${SYSMODEL_URL}/v1/locations`,
    projects: `${SYSMODEL_URL}/v2-alpha/projects`,
    rolesV2: `${SYSMODEL_URL}/v2-alpha/roles`,
  };

  /**
   * Get all V2 roles
   */
  static async getRolesV2() {
    return await axios.get(`${this.SYSMODEL_ENDPOINTS.rolesV2}`).then(res => res.data);
  }

  /**
   * Get all V2 projects
   */
  static async getProjectsV2() {
    return await axios.get(`${this.SYSMODEL_ENDPOINTS.projects}`).then(res => res.data);
  }

  /**
   * Get a component.
   * @param {String} componentId - The ID of the component
   */
  static async getComponent(componentId) {
    return await axios.get(`${this.SYSMODEL_ENDPOINTS.components}/${componentId}`).then(res => res.data);
  }

  /**
   * Register a component in Sysmodel.
   * @param {String} location - The location key, e.g. ghe:/orgname/reponame/service-info.yaml
   */
  static async registerComponentFromGheUrl(gheUrl, componentFile) {
    const location = SysmodelClient.generateSysmodelUri(gheUrl, componentFile);
    return axios
      .post(this.SYSMODEL_ENDPOINTS.locations, JSON.stringify({ location: location }), {
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
      })
      .catch(error => {
        let message = '';
        if (error.response && error.response.data && error.response.data.reason && error.response.data.error) {
          message = `${error.response.data.reason}: ${error.response.data.error}`;
        } else if (error.response) {
          message = `Request failed with status code ${error.response.status}: ${error.response.statusText}`;
        } else {
          message = error.message;
        }

        throw Error(message);
      });
  }

  static generateSysmodelUri(gheUrl, componentFile) {
    const yamlFileSuffix = componentFile || 'service-info.yaml';
    const ghePattern = /^(https?:\/\/)?ghe\.spotify\.net\//;
    const yamFullPathPattern = /([^/]+\/[^/]+\/blob\/master\/.+\.yaml)$/;

    if (!gheUrl.match(ghePattern)) {
      throw new Error('Malformed GHE URL passed to SysmodelClient.registerComponentFromGheUrl', gheUrl);
    }

    gheUrl = gheUrl.replace(ghePattern, '');

    if (gheUrl.match(yamFullPathPattern)) {
      gheUrl = gheUrl.replace('blob/master/', '');
    } else {
      gheUrl = `${gheUrl}/${yamlFileSuffix}`;
    }

    // there might be double slashes due to user input
    gheUrl = gheUrl.replace(/\/\//g, '/');

    return `ghe:/${gheUrl}`;
  }

  /**
   * Unregister a component from Sysmodel.
   * @param {String} componentId - The ID of the component
   * @param {String} location - The location key, e.g. ghe:/orgname/reponame/service-info.yaml
   */
  static async unregisterComponent(componentId, location) {
    await axios.delete(`${this.SYSMODEL_ENDPOINTS.components}/${componentId}`);
    await axios.delete(`${this.SYSMODEL_ENDPOINTS.locations}/${location}`);
  }

  /**
   * Move a components location.
   * @param {String} oldLocation - The location of the component to move
   * @param {String} newLocation - The new location of the component
   */
  static async moveComponentLocation(oldLocation, newLocation) {
    try {
      return await axios.put(
        `${this.SYSMODEL_ENDPOINTS.locations}/${oldLocation}`,
        { location: newLocation },
        {
          errorHandle: false,
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors',
        },
      );
    } catch (e) {
      throw new Error(`Request failed with status code ${e.response.status}: ${e.response.statusText}`);
    }
  }

  /**
   * Link a role to a GCP project.
   * @param {String} roleId - The ID of the role, e.g. "tantrum"
   * @param {String} gcpProjectId - The ID of the GCP project, e.g. "golden-path-tutorial-6522"
   */
  static async linkRoleToGcpProject(roleId, gcpProjectId) {
    const sysmodelProjectId = await SysmodelClient.gcpProjectIdToSysmodelProjectId(gcpProjectId);
    const headers = await authHeaderForScopes('cloudplatformprojects.readonly');
    await axios.put(`${this.SYSMODEL_ENDPOINTS.projects}/${sysmodelProjectId}/roles/${roleId}`, null, { headers });
    await evictGraphqlCacheEntity('roles');
  }

  /**
   * Unlinks a role from a GCP project.
   * @param {String} roleId - The ID of the role, e.g. "tantrum"
   * @param {String} gcpProjectId - The ID of the GCP project, e.g. "golden-path-tutorial-6522"
   */
  static async unlinkRoleFromGcpProject(roleId, gcpProjectId) {
    const sysmodelProjectId = await SysmodelClient.gcpProjectIdToSysmodelProjectId(gcpProjectId);
    const headers = await authHeaderForScopes('cloudplatformprojects.readonly');
    await axios.delete(`${this.SYSMODEL_ENDPOINTS.projects}/${sysmodelProjectId}/roles/${roleId}`, { headers });
    await evictGraphqlCacheEntity('roles');
  }

  /**
   * Given an actual GCP project ID, returns the ID of the corresponding Sysmodel project, or
   * creates one if it did not exist.
   * @param gcpProjectId The GCP project ID
   * @returns {Promise<*>} The sysmodel project ID
   */
  static async gcpProjectIdToSysmodelProjectId(gcpProjectId) {
    // First, list all projects that are registered in sysmodel, and find the right one
    const sysmodelProjects = await axios.get(this.SYSMODEL_ENDPOINTS.projects);
    const matchingSysmodelProjects = sysmodelProjects.data.filter(p => p.gcpProjectId === gcpProjectId);

    // If the project has not yet been registered, do so automatically first
    if (!matchingSysmodelProjects.length) {
      const requestBody = { id: gcpProjectId, gcpProjectId: gcpProjectId };
      await axios.post(this.SYSMODEL_ENDPOINTS.projects, requestBody);
      return gcpProjectId;
    } else {
      return matchingSysmodelProjects[0].id;
    }
  }
}

export default SysmodelClient;
