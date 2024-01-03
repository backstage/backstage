---
id: index
title: 시작하기
description: Backstage를 시작하는 방법에 대한 문서
---

대부분의 Backstage 설치의 경우 독립형 앱을 설치하면 가장 효율적인 환경을 얻을 수 있습니다. 이 가이드에서는 다음을 수행합니다:

- npm 패키지를 사용하여 Backstage 독립 실행형 배포
- SQLite 인메모리 데이터베이스 및 데모 콘텐츠를 사용하여 Backstage Standalone 실행

이 가이드에서는 apt-get, npm, Yarn, Curl과 같은 도구를 사용하여 Linux 기반 운영 체제에서 작업하는 방법에 대한 기본적인 이해가 있다고 가정합니다. 
또한 Docker 지식은 Backstage 설치를 최대한 활용하는 데도 도움이 됩니다.

플러그인이나 프로젝트 전반에 기여할 계획이라면 [Contributors](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md) 가이드를 사용하여 저장소 기반 설치를 수행하는 것이 좋습니다.

### 전제조건

- Linux, MacOS 또는 [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/)과 같은 Unix 기반 운영 체제에 액세스합니다.
- 명령줄에서 사용할 수 있는 GNU와 유사한 빌드 환경입니다.
  예를 들어 Debian/Ubuntu에서는 'make' 및 'build-essential' 패키지를 설치해야 합니다.
  MacOS에서는 `xcode-select --install`을 실행하여 XCode 명령줄 빌드 도구를 설치하는 것이 좋습니다.
- 종속성을 설치할 수 있는 높은 권한이 있는 계정이 필요합니다.
- `curl` 또는 `wget` 가 설치되어 있어야합니다.
- 다음 방법 중 하나를 사용하여 Node.js [Active LTS Release](https://nodejs.org/en/blog/release/)가 설치되어있어야합니다.
   - `nvm` 사용(권장)
     - [nvm 설치](https://github.com/nvm-sh/nvm#install--update-script)
     - [nvm으로 Node 버전 설치 및 변경](https://nodejs.org/en/download/package-manager/#nvm)
   - [바이너리 다운로드](https://nodejs.org/en/download/)
   - [패키지 관리자](https://nodejs.org/en/download/package-manager/)
   - [NodeSource 패키지 사용](https://github.com/nodesource/distributions/blob/master/README.md)


- Node.js [Active LTS Release](https://nodejs.org/en/blog/release/) installed using one of these
  methods:
  - Using `nvm` (recommended)
    - [nvm설치](https://github.com/nvm-sh/nvm#install--update-script)
    - [nvm을 사용하여 Node 버전 설치 및 변경](https://nodejs.org/en/download/package-manager/#nvm)
  - [바이너리 다운로드](https://nodejs.org/en/download/)
  - [패키지 매니저](https://nodejs.org/en/download/package-manager/)
  - [NodeSource 패키지 사용](https://github.com/nodesource/distributions/blob/master/README.md)
- `yarn` [설치](https://classic.yarnpkg.com/en/docs/install)
   - 새 프로젝트를 생성하려면 Yarn 클래식을 사용해야 하지만 그런 다음 [Yarn 3으로 마이그레이션](../tutorials/yarn-migration.md)할 수 있습니다.
- `docker` [설치](https://docs.docker.com/engine/install/)
- `git` [설치](https://github.com/git-guides/install-git)
- 네트워크를 통해 시스템에 직접 액세스할 수 없는 경우 다음 포트를 열어야 합니다:3000,7007. 이것은 컨테이너, VM 또는 원격 시스템에 설치하는 경우가 아니면 이는 매우 드문 일입니다.

### Backstage 앱(App) 만들기

Backstage Standalone 앱을 설치하기 위해 레지스트리에서 직접 Node 실행 파일을 실행하는 도구인 'npx'를 사용합니다. 이 도구는 Node.js 설치의 일부입니다. 
아래 명령을 실행하면 Backstage가 설치됩니다. 마법사는 현재 작업 디렉터리 내에 하위 디렉터리를 생성합니다.

```bash
npx @backstage/create-app@latest
```

> 주의사항: `yarn install`단계에서 실패한다면, `isolated-vm`을 구성하는 데 사용되는 몇 가지 종속성을 설치해야 할 가능성이 높습니다. [요구 사항 섹션](https://github.com/laverdet/isolation-vm#requirements)에서 자세한 내용을 확인할 수 있으며 해당 단계를 완료한 후 `yarn install`을 수동으로 다시 실행할 수 있습니다.

설치 마법사(Wizard) 는 앱 이름을 물을것입니다. 이 이름은 디렉터리 이름이기도합니다.

![Screenshot of the wizard asking for a name for the app.](../assets/getting-started/wizard.png)

### Backstage 앱 실행하기

설치가 완료되면 애플리케이션 디렉토리로 이동하여 앱을 시작할 수 있습니다. `yarn dev` 명령은 프런트엔드와 백엔드를 모두 동일한 창에서 별도의 프로세스(`[0]` 과 `[1]`로 명명)로 실행합니다.

```bash
cd my-backstage-app
yarn dev
```

![Screenshot of the command output, with the message web pack compiled successfully](../assets/getting-started/startup.png)

시간이 조금 걸릴 수 있지만 '[0] webpack 컴파일 성공' 메시지가 표시되자마자 브라우저를 열고 새로 설치된 Backstage 포털인 'http://localhost:3000'으로 직접 이동할 수 있습니다.
즉시 데모 탐색을 시작할 수 있습니다. 앱을 다시 시작하면 메모리 내 데이터베이스가 지워지므로 데이터베이스 단계를 계속 진행하는 것이 좋습니다.

![Screenshot of the Backstage portal.](../assets/getting-started/portal.png)

이 튜토리얼의 다음 부분에서는 영구 데이터베이스로 변경하고, 인증을 구성하고, 첫 번째 통합을 추가하는 방법을 알아봅니다. [시작하기: Backstage 구성](configuration.md)을 계속 진행하세요.

귀하의 경험을 알려주세요: [on discord](https://discord.gg/backstage-687207715902193673)
그리고 파일에 문제가 있다면
[feature](https://github.com/backstage/backstage/issues/new?labels=help+wanted&template=feature_template.md)
또는
[plugin suggestions](https://github.com/backstage/backstage/issues/new?labels=plugin&template=plugin_template.md&title=%5BPlugin%5D+THE+PLUGIN+NAME),
또는
[bugs](https://github.com/backstage/backstage/issues/new?labels=bug&template=bug_template.md)
에서 적극적으로 기여해주세요
[contribute](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md)!

