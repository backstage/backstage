---
id: configuration
title: 시작하기, Backstage 구성
description: 초기 Backstage 구성 시작하기
---

이 문서는 "시작하기"의 두 번째 문서입니다. 이 튜토리얼의 단계에서는 [시작 가이드](./index.md)와 
같이 npm 저장소에서 Backstage 앱을 설치했고 Backstage를 구성한다고 가정합니다.

이 튜토리얼이 끝나면 다음을 기대할 수 있습니다:

- PostgreSQL 데이터베이스를 사용하기 위한 Backstage
- 인증 공급자를 이용한 인증
- Backstage Github 통합 구성
- 소프트웨어 템플릿 사용

### 요구사항

- Linux, MacOS 또는 [Windows Sybsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/)와 
  같은 Linux 기반 운영체제에서 작동합니다.
- 운영 체제에 필수 구성 요소를 설치할 수 있는 높은 권한이 있는 계정이 필요합니다.
- 데이터베이스가 Backstage 앱과 동일한 서버에서 호스팅되지 않는 경우 PostgreSQL 포트에 액세스할 수 
  있어야합니다.(기본적으로 5432 또는 5433 포트)

### PstgreSQL 설치 및 설정

PostgreSQL 서버가 이미 설치되어 있고 스키마와 사용자를 생성한 경우 이 지침을 건너뛸 수 있습니다. 아래 예시는 Linux용이며 
기타 다른 환경 설치를 위해선 [PostgreSQL 설치](https://www.postgresql.org/download/) 을 참조하세요

```shell
sudo apt-get install postgresql
```

데이터베이스가 작동하는지 확인합니다:

```shell
sudo -u postgres psql
```

정상적으로 작동중이라면 다음과 같은 메시지를 확인할 수 있습니다:

```shell
psql (12.9 (Ubuntu 12.9-0ubuntu0.20.04.1))
Type "help" for help.

postgres=#
```

이 튜토리얼에서는 기존 postres 사용자를 사용합니다. 다음 단계는 이 사용자의 비밀번호를 설정합니다:

```shell
postgres=# ALTER USER postgres PASSWORD 'secret';
```

시작하기 충분한 데이터베이스 상태입니다. '\q'를 입력한 후 Enter 키를 누르세요. 그런 다음 다시 `exit`를 
입력하고 Enter를 누르세요. 다음으로 클라이언트를 설치하고 구성해야 합니다.

Backstage를 중지하고 새로 설치된 Backstage 앱의 루트 디렉터리로 이동합니다. PostgreSQL 클라이언트 
설치를 시작하려면 다음 명령을 사용하십시오:

```bash
# From your Backstage root directory
yarn add --cwd packages/backend pg
```

선호하는 편집기를 사용하여 `app-config.yaml`을 열고 이전 단계의 자격 증명을 사용하여 Backstage 앱의 
루트 디렉터리에 PostgreSQL 구성을 추가합니다.

```yaml title="app-config.yaml"
backend:
  database:
    # highlight-remove-start
    client: better-sqlite3
    connection: ':memory:'
    # highlight-remove-end
    # highlight-add-start
    # config options: https://node-postgres.com/apis/client
    client: pg
    connection:
      host: ${POSTGRES_HOST}
      port: ${POSTGRES_PORT}
      user: ${POSTGRES_USER}
      password: ${POSTGRES_PASSWORD}
      # https://node-postgres.com/features/ssl
      # ssl:
      #   host is only needed if the connection name differs from the certificate name.
      #   This is for example the case with CloudSQL.
      #   host: servername in the certificate
      #   ca:
      #     $file: <file-path>/server.pem
      #   key:
      #     $file: <file-path>/client.key
      #   cert:
      #     $file: <file-path>/client-cert.pem
      # highlight-add-end
```

이전 단계의 연결 세부정보를 사용합니다. Backstage를 시작하기 전에 `POSTGRES_` 환경 변수를 설정하거나 `${...}` 
값을 제거하고 이 구성 파일에서 실제 값을 설정할 수 있습니다.

PostgreSQL의 기본 포트는 '5432' 또는 '5433'이며, 로컬에 설치된 경우 호스트 이름은 '127.0.0.1'이 될 수 있습니다. 
주의 사항할 점은 일반적으로 구성 파일의 연결 세부 정보를 사용하는 것은 권장되지 않습니다.

Backstage 앱을 시작합니다:

```shell
yarn dev
```

Backstage가 실행된 후 카탈로그가 구성 파일의 정보로 채워져 있는것을 볼 수 있습니다. 새 구성 요소를 추가하거나 
기존 구성 요소를 등록하면 데이터베이스에 저장됩니다. 이 튜토리얼의 뒷부분에서 서비스를 추가하고 해당 서비스가 
지속되는지 테스트할 수 있습니다.
데이터베이스 구성에 대해 자세히 알아보려면 다음 링크를 참조하세요:

- [데이터베이스 플러그인 설정하기](../tutorials/configuring-plugin-databases.md#privileges)
- [Knex에 관하여 더 보기](http://knexjs.org/), 우리가 사용하는 데이터 베이스입니다.

### 인증 설정

Backstage는 사용할 수 있는 여러가지 인증 공급자가 있습니다. 다음을 참고하세요.
[인증 추가 지침](../auth/index.md).

이 튜토리얼에서는 많은 사용자가 익숙한 Github를 사용합니다. 다른 옵션에 대해서는 다음 문서를 참조하세요.
[인증 공급자에 관하여](../auth/github/provider.md#create-an-oauth-app-on-github).

OAuth 앱을 생성하기하려면 [https://github.com/settings/applications/new](https://github.com/settings/applications/new)
로 이동하세요. `Homepage URL`은 Backstage의 프런트엔드를 가리켜야 하며, 튜토리얼에서는 `http://localhost:3000`을 사용합니다.
`Authorization callback URL`은 인증 백엔드를 가리키며, 이는 `http://localhost:7007/api/auth/github/handler/frame`를 사용합니다.

![OAuth 생성 페이지 스크린샷](../assets/getting-started/gh-oauth.png)

`Client ID`와 `Client Secret`를 기록해 두세요. `app-config.yaml`을 열고,
당신의 `clientId` and `clientSecret`를 이 파일에 추가하세요. 결과는 다음과 같습니다:

```yaml title="app-config.yaml"
auth:
  # see https://backstage.io/docs/auth/ to learn about auth providers
  environment: development
  providers:
    github:
      development:
        clientId: YOUR CLIENT ID
        clientSecret: YOUR CLIENT SECRET
```

### 프론트엔드에 로그인 옵션 추가

Backstage는 설정을 다시 읽습니다. 오류가 없다면 구성의 마지막 부분을 계속 진행할 수 있습니다. 로그인 페이지를 변경하려면 
다음 단계가 필요합니다. 이를 실제 소스 코드에 추가해야합니다.

`packages/app/src/App.tsx`를 열고 마지막 `import` 줄에 다음을 추가하세요:

```typescript title="packages/app/src/App.tsx"
import { githubAuthApiRef } from '@backstage/core-plugin-api';
import { SignInPage } from '@backstage/core-components';
```

그 다음 동일한 파일 내에서 `const app = createApp({`를 검색하고, `apis,`아래에 다음 내용을 추가하세요:

```tsx title="packages/app/src/App.tsx"
components: {
  SignInPage: props => (
    <SignInPage
      {...props}
      auto
      provider={{
        id: 'github-auth-provider',
        title: 'GitHub',
        message: 'Sign in using GitHub',
        apiRef: githubAuthApiRef,
      }}
    />
  ),
},
```

> 

> Note: The default Backstage app comes with a guest Sign In Resolver. This resolver makes all users share a single "guest" identity and is only intended as a minimum requirement to quickly get up and running. You can read more about how [Sign In Resolvers](../auth/identity-resolver.md#sign-in-resolvers) play a role in creating a [Backstage User Identity](../auth/identity-resolver.md#backstage-user-identity) for logged in users.

Backstage 를 재시작하기위해 터미널에서 `Control-C`로 중지하고 `yarn dev`를 입력합니다. 로그인 프롬프트가 나타나면 정상 동작중입니다.

> 주의 사항 : 프론트엔드가 백엔드보다 먼저 시작되어 로그인 페이지에 오류가 발생하는 경우가 있습니다. 백엔드가 시작될 때까지 기다린 후 Backstage를 다시 로드하여 계속 진행하세요.

Backstage의 인증에 대해 더 자세히 알고싶다면 다음 문서를 참고하세요:

- [Authentication in Backstage](../auth/index.md)
- [Using organizational data from GitHub](../integrations/github/org.md)

### GitHub 통합 설정

GitHub 통합은 GitHub 또는 GitHub Enterprise에서 카탈로그 엔티티 로드를 지원합니다. 엔티티를 정적 카탈로그 구성에 추가하거나, 
카탈로그 가져오기 플러그인에 등록하거나, GitHub 조직에서 검색할 수 있습니다. 조직에서 사용자 및 그룹을 로드할 수도 있습니다. 
[GitHub Apps](../integrations/github/github-apps.md)를 사용하는 것이 통합을 설정하는 가장 좋은 방법일 수 있습니다. 
이 튜토리얼에서는 개인 액세스 토큰을 사용합니다.

[GitHub 토큰 생성 페이지](https://github.com/settings/tokens/new) 를 열어 개인 접속 토큰을 생성합니다.
이름을 사용하여 이 토큰을 식별하고 노트 필드에 넣습니다. 만료 날짜를 선택하세요. 번호를 선택하는 데 어려움이 있다면 7일 동안 사용하는 것이 좋습니다.

![GitHub 개인 액세스 토큰 생성 페이지 스크린샷](../assets/getting-started/gh-pat.png)

Set the scope to your likings. 이 튜토리얼의 경우 새로 생성된 프로젝트에대한 Github 작업 워크플로우를 스캐폴딩 작업에서 구성하므로 `repo`와 `workflow`를 선택해야합니다.

이 튜토리얼에서는 토큰을 `app-config.local.yaml`에 작성합니다. 이 파일은 당신을 위해 존재하지 않을 수도 있으므로, 만약 그것이 진행되지 않는다면 프로젝트의 루트에 있는 `app-config.yaml`과 함께 생성됩니다.
이 파일의 실수로 인한 커밋을 방지하기 위해 `.gitignore`에서도 이 파일을 제외해야합니다.

`app-config.local.yaml`에서 다음을 추가합니다:

```yaml title="app-config.local.yaml"
integrations:
  github:
    - host: github.com
      token: ghp_urtokendeinfewinfiwebfweb # this should be the token from GitHub
```

That's settled. This information will be leveraged by other plugins.

이 기밀을 관리할 수 있는 좀 더 생산적인 방법을 찾고 있다면 토큰을 `GITHUB_TOKEN`이라는 환경 변수에 저장하고 다음 작업을 수행할 수 있습니다.

```yaml title="app-config.local.yaml"
integrations:
  github:
    - host: github.com
      token: ${GITHUB_TOKEN} # this will use the environment variable GITHUB_TOKEN
```

> 주의사항: 통합 설정을 업데이트한 경우 변경 사항을 적용하기위해 백엔드를 다시 시작해야 할 가능성이 높습니다. 터미널에서 `Control-C`를 입력하여 실행 중인 인스턴스를 중지한 후,  `yarn dev`를 입력해 백엔드를 재실행하세요. 백엔드가 다시 시작되면 작업을 다시 시도하세요.

자세한 사항은 다음 링크를 확인하세요:

- [Other available integrations](../integrations/index.md)
- [Using GitHub Apps instead of a Personal Access Token](../integrations/github/github-apps.md#docsNav)

### Explore what we've done so far

## Backstage에 로그인하여 프로필을 확인하세요.

Backstage 프론트엔드를 엽니다. 아직 로그인하지 않은 경우 로그인 화면이 표시됩니다. 로그인이 되면
설정으로 이동하면 프로필이 표시됩니다. 화면에서 프로필 사진과 이름을 확인할 수 없다면 무엇인가 잘 못된 경우입니다.

## 기존 컴포넌트 등록

- `create`으로 이동하여 `Register existing component`을 선택하여 새 컴포넌트를 등록합니다.

  <!-- todo: Needs zoomable plugin -->

  ![Software template main screen, with a blue button to add an existing component](../assets/getting-started/b-existing-1.png)

- URL은 `https://github.com/backstage/demo/blob/master/catalog-info.yaml`. 
  이 주소는 우리의 [demo site](https://demo.backstage.io)에서 사용됩니다.]

  ![Register a new component wizard, asking for an URL to the existing component YAML file](../assets/getting-started/b-existing-2.png)

- `Analyze`를 누르고 변경사항을 검토하세요. 변경사항이 맞다면 적용하세요.

  ![Register a new component wizard, showing the metadata for the component YAML we use in this tutorial](../assets/getting-started/b-existing-3.png)

- 변경된 엔티티가 추가되었다는 메시지를 수신해야합니다.
- `Home`으로 돌아가면 `demo`를 찾을 수 있고, `demo`를 클릭해서 자세히 확인해 볼 수 있습니다.

## 소프트웨어 템플릿을 사용하여 새 컴포넌트 생성

> 주의사항: Node 20 이상에서 Backstage를 실행하는 경우 템플릿 기능을 사용하려면 `--no-node-snapshot` 플래그를 Node에 전달해야합니다.
> 한 가지 방법은 Backstage를 시작하기 전에 `NODE_OPTIONS`환경 변수를 지정하는 것입니다:
> `export NODE_OPTIONS=--no-node-snapshot`

- `create`로 이동하여 `Example Node.js Template`을 사용하여 웹사이트 만들기를 시작하세요.
- 이름을 입력하고 `tutorial` 를 사용한 후 `Next Step`을 클릭하세요.

![Software template deployment input screen asking for a name](../assets/getting-started/b-scaffold-1.png)

- 다음 화면이 표시 될 것입니다:

![Software template deployment input screen asking for the GitHub username, and name of the new repo to create](../assets/getting-started/b-scaffold-2.png)

- host의 경우 기본값은 github.com어이ㅑ합니다.
- 소유자로서 GitHub 사용자 이름을 입력하세요
- 저장소 이름은 `tutorial`를 입력한 후 다음 단계로 이동하세요.

- 이 새로운 서비스의 세부 사항을 검토하고, 이와 같이 배포하려면 `Create`를 누르세요.
- 진행 상황을 확인할 수 있으며, 모든 단계가 완료되자마자 새로운 서비스를 살펴볼 수 있습니다.

튜토리얼을 완료했습니다. Backstage 앱 설치를 구성하고 이를 실행하였으며, 소프트웨어 템플릿을 사요할 수 있도록 구성했습니다.

귀하의 경험을 알려주세요: [on discord](https://discord.gg/backstage-687207715902193673)
그리고 파일에 문제가 있다면
[feature](https://github.com/backstage/backstage/issues/new?labels=help+wanted&template=feature_template.md)
또는
[plugin suggestions](https://github.com/backstage/backstage/issues/new?labels=plugin&template=plugin_template.md&title=%5BPlugin%5D+THE+PLUGIN+NAME),
또는
[bugs](https://github.com/backstage/backstage/issues/new?labels=bug&template=bug_template.md)
에서 적극적으로 기여해주세요
[contribute](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md)!
