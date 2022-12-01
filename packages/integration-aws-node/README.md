# @backstage/integration-aws-node

This package providers helpers for fetching AWS account credentials
to be used by AWS SDK clients in backend packages and plugins.

## Backstage app configuration

Users of plugins and packages that use this library
will configure their AWS account information and credentials in their
Backstage app config.
Users can configure IAM user credentials, IAM roles, and profile names
for their AWS accounts in their Backstage config.

If the AWS integration configuration is missing, the credentials manager
from this package will fall back to the AWS SDK default credentials chain for
resources in the main AWS account.
The default credentials chain for Node resolves credentials in the
following order of precedence:

1. Environment variables
2. SSO credentials from token cache
3. Web identity token credentials
4. Shared credentials files
5. The EC2/ECS Instance Metadata Service

See more about the AWS SDK default credentials chain in the
[AWS SDK for Javascript Developer Guide](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials-node.html).

Configuration examples:

```yaml
aws:
  # The main account is used as the source of credentials for calling
  # the STS AssumeRole API to assume IAM roles in other AWS accounts.
  # This section can be omitted to fall back to the AWS SDK's default creds chain.
  mainAccount:
    accessKeyId: ${MY_ACCESS_KEY_ID}
    secretAccessKey: ${MY_SECRET_ACCESS_KEY}

  # Account credentials can be configured individually per account
  accounts:
    # Credentials can come from a role in the account
    - accountId: '111111111111'
      roleName: 'my-iam-role-name'
      externalId: 'my-external-id'

    # Credentials can come from other AWS partitions
    - accountId: '222222222222'
      partition: 'aws-other'
      roleName: 'my-iam-role-name'
      # The STS region to use for the AssumeRole call
      region: 'not-us-east-1'
      # The creds to use when calling AssumeRole
      accessKeyId: ${MY_ACCESS_KEY_ID_FOR_ANOTHER_PARTITION}
      secretAccessKey: ${MY_SECRET_ACCESS_KEY_FOR_ANOTHER_PARTITION}

    # Credentials can come from static credentials
    - accountId: '333333333333'
      accessKeyId: ${MY_OTHER_ACCESS_KEY_ID}
      secretAccessKey: ${MY_OTHER_SECRET_ACCESS_KEY}

    # Credentials can come from a profile in a shared config file on disk
    - accountId: '444444444444'
      profile: my-profile-name

    # Credentials can come from the AWS SDK's default creds chain
    - accountId: '555555555555'

  # Credentials for accounts can fall back to a common role name.
  # This is useful for account discovery use cases where the account
  # IDs may not be known when writing the static config.
  # If all accounts have a role with the same name, then the "accounts"
  # section can be omitted entirely.
  accountDefaults:
    roleName: 'my-backstage-role'
    externalId: 'my-id'
```

## Integrate new plugins

Backend plugins can provide an AWS ARN or account ID to this library in order to
retrieve a credential provider for the relevant account that can be fed directly
to an AWS SDK client.
The AWS SDK for Javascript V3 must be used.

```typescript
const awsCredentialsManager = DefaultAwsCredentialsManager.fromConfig(config);

// provide the account ID explicitly
const credProvider = await awsCredentialsManager.getCredentialProvider({
  accountId,
});
// OR extract the account ID from the ARN
const credProvider = await awsCredentialsManager.getCredentialProvider({ arn });
// OR provide neither to get main account's credentials
const credProvider = await awsCredentialsManager.getCredentialProvider({});

// Example constructing an AWS Proton client with the returned credential provider
const client = new ProtonClient({
  region,
  credentialDefaultProvider: () => credProvider.sdkCredentialProvider,
});
```

Depending on the nature of your plugin, you may either have the user specify the
relevant ARN or account ID in a catalog entity annotation or in the static Backstage
app configuration for your plugin.

For example, you can create a new catalog entity annotation for your plugin containing
either an AWS account ID or ARN:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  annotations:
    # Plugin annotation to specify an AWS account ID
    my-plugin.io/aws-account-id: '123456789012'
    # Plugin annotation to specify the AWS ARN of a specific resource
    my-other-plugin.io/aws-dynamodb-table: 'arn:aws:dynamodb:us-east-2:123456789012:table/example-table'
```

In your plugin, read the annotation value so that you can retrieve the credential provider:

```typescript
const MY_AWS_ACCOUNT_ID_ANNOTATION = 'my-plugin.io/aws-account-id';

const getAwsAccountId = (entity: Entity) =>
  entity.metadata.annotations?.[MY_AWS_ACCOUNT_ID_ANNOTATION]);
```

Alternatively, you can create a new Backstage app configuration field for your plugin:

```yaml
# app-config.yaml
my-plugin:
  # Statically configure the AWS account ID to use
  awsAccountId: '123456789012'
my-other-plugin:
  # Statically configure the AWS ARN of a specific resource
  awsDynamoDbTable: 'arn:aws:dynamodb:us-east-2:123456789012:table/example-table'
```

In your plugin, read the configuration value so that you can retrieve the credential provider:

```typescript
// Read an account ID from your plugin's configuration
const awsCredentialsManager = DefaultAwsCredentialsManager.fromConfig(config);
const accountId = config.getOptionalString('my-plugin.awsAccountId');
const credProvider = await awsCredentialsManager.getCredentialProvider({
  accountId,
});

// Or, read an AWS ARN from your plugin's configuration
const awsCredentialsManager = DefaultAwsCredentialsManager.fromConfig(config);
const arn = config.getString('my-other-plugin.awsDynamoDbTable');
const credProvider = await awsCredentialsManager.getCredentialProvider({ arn });
```

## Links

- [The Backstage homepage](https://backstage.io)
