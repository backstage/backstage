import { ValidatorBase } from 'shared/components/form/validators';
import SysmodelClient from 'shared/apis/sysmodel/SysmodelClient';

export default class ValidatorSysmodelComponent extends ValidatorBase {
  validate(value /* , element */) {
    return new Promise(result => {
      if (!/^[a-z][a-z0-9-]{2,253}[a-z0-9]$/i.test(value)) {
        return result(
          'Must be 4 to 255 lowercase letters, digits, or hyphens. It must start with a letter. Trailing hyphens are prohibited.',
        );
      }

      SysmodelClient.getComponent(value)
        .then((/* response */) => {
          result(`The component '${value}' already exists`);
        })
        .catch(error => {
          if (error.response.status === 404) {
            return result(true);
          }
          result(`Error response (${error.response.status}) from sysmodel preventing validation`);
        });
    });
  }
}
