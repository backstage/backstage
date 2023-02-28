/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const downloadJobLogsForWorkflowRun = `
2022-12-09T17:25:25.6542422Z Requested labels: ubuntu-latest
2022-12-09T17:25:25.6542470Z Job defined at: octo-org/octo-template/dynamic/pages/pages-build-deployment@refs/heads/main
2022-12-09T17:25:25.6542493Z Waiting for a runner to pick up this job...
2022-12-09T17:25:25.9157301Z Job is waiting for a hosted runner to come online.
2022-12-09T17:25:29.3998345Z Job is about to start running on the hosted runner: Hosted Agent (hosted)
2022-12-09T17:25:31.7099053Z Current runner version: '2.299.1'
2022-12-09T17:25:31.7123983Z ##[group]Operating System
2022-12-09T17:25:31.7124496Z Ubuntu
2022-12-09T17:25:31.7124859Z 22.04.1
2022-12-09T17:25:31.7125085Z LTS
2022-12-09T17:25:31.7125353Z ##[endgroup]
2022-12-09T17:25:31.7125657Z ##[group]Runner Image
2022-12-09T17:25:31.7125963Z Image: ubuntu-22.04
2022-12-09T17:25:31.7126295Z Version: 20221204.2
2022-12-09T17:25:31.7127048Z Included Software: https://github.com/actions/runner-images/blob/ubuntu22/20221204.2/images/linux/Ubuntu2204-Readme.md
2022-12-09T17:25:31.7127614Z Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu22%2F20221204.2
2022-12-09T17:25:31.7128026Z ##[endgroup]
2022-12-09T17:25:31.7128400Z ##[group]Runner Image Provisioner
2022-12-09T17:25:31.7128722Z 2.0.91.1
2022-12-09T17:25:31.7128945Z ##[endgroup]
2022-12-09T17:25:31.7129586Z ##[group]GITHUB_TOKEN Permissions
2022-12-09T17:25:31.7130130Z Contents: read
2022-12-09T17:25:31.7130387Z Metadata: read
2022-12-09T17:25:31.7130849Z Pages: write
2022-12-09T17:25:31.7131169Z ##[endgroup]
2022-12-09T17:25:31.7134756Z Secret source: Actions
2022-12-09T17:25:31.7135232Z Prepare workflow directory
2022-12-09T17:25:31.7951647Z Prepare all required actions
2022-12-09T17:25:31.8134091Z Getting action download info
2022-12-09T17:25:32.1190857Z Download action repository 'actions/checkout@v3' (SHA:93ea575cb5d8a053eaa0ac8fa3b40d7e05a33cc8)
2022-12-09T17:25:32.4403240Z Download action repository 'actions/jekyll-build-pages@v1' (SHA:9b882383c88a22eef81e9c1a5a232c2ff9a6672b)
2022-12-09T17:25:32.7457755Z Download action repository 'actions/upload-pages-artifact@v1' (SHA:c8641e80048cf33d329c39df3bcc53196178335a)
2022-12-09T17:25:33.0262452Z Getting action download info
2022-12-09T17:25:33.1786870Z Download action repository 'actions/upload-artifact@main' (SHA:83fd05a356d7e2593de66fc9913b3002723633cb)
2022-12-09T17:25:33.4537715Z ##[group]Pull down action image 'ghcr.io/actions/jekyll-build-pages:v1.0.4'
2022-12-09T17:25:33.4611360Z ##[command]/usr/bin/docker pull ghcr.io/actions/jekyll-build-pages:v1.0.4
2022-12-09T17:25:34.0231935Z v1.0.4: Pulling from actions/jekyll-build-pages
2022-12-09T17:25:34.0232298Z eff15d958d66: Pulling fs layer
2022-12-09T17:25:34.0232609Z 923e91ae3a1b: Pulling fs layer
2022-12-09T17:25:34.0232986Z 2aa5d3a4a151: Pulling fs layer
2022-12-09T17:25:34.0233248Z bc64adf2d0b2: Pulling fs layer
2022-12-09T17:25:34.0233543Z bfc5cca7d80e: Pulling fs layer
2022-12-09T17:25:34.0233827Z 61b6e3e25463: Pulling fs layer
2022-12-09T17:25:34.0234080Z 7c62fb63f605: Pulling fs layer
2022-12-09T17:25:34.0234380Z 0f68cc81f8f6: Pulling fs layer
2022-12-09T17:25:34.0234663Z 09f325326117: Pulling fs layer
2022-12-09T17:25:34.0234894Z a73a0a50c4db: Pulling fs layer
2022-12-09T17:25:34.0235171Z bc64adf2d0b2: Waiting
2022-12-09T17:25:34.0235470Z bfc5cca7d80e: Waiting
2022-12-09T17:25:34.0235840Z 61b6e3e25463: Waiting
2022-12-09T17:25:34.0236104Z 7c62fb63f605: Waiting
2022-12-09T17:25:34.0236314Z 0f68cc81f8f6: Waiting
2022-12-09T17:25:34.0236586Z 09f325326117: Waiting
2022-12-09T17:25:34.0236855Z a73a0a50c4db: Waiting
2022-12-09T17:25:34.1800756Z 2aa5d3a4a151: Verifying Checksum
2022-12-09T17:25:34.1801065Z 2aa5d3a4a151: Download complete
2022-12-09T17:25:34.4333121Z eff15d958d66: Verifying Checksum
2022-12-09T17:25:34.4335284Z eff15d958d66: Download complete
2022-12-09T17:25:34.5215161Z bc64adf2d0b2: Verifying Checksum
2022-12-09T17:25:34.5231169Z bc64adf2d0b2: Download complete
2022-12-09T17:25:34.5266358Z 923e91ae3a1b: Verifying Checksum
2022-12-09T17:25:34.5266637Z 923e91ae3a1b: Download complete
2022-12-09T17:25:34.6185999Z bfc5cca7d80e: Verifying Checksum
2022-12-09T17:25:34.6186341Z bfc5cca7d80e: Download complete
2022-12-09T17:25:34.6627434Z 7c62fb63f605: Verifying Checksum
2022-12-09T17:25:34.6629228Z 7c62fb63f605: Download complete
2022-12-09T17:25:34.8423112Z 09f325326117: Verifying Checksum
2022-12-09T17:25:34.8424383Z 09f325326117: Download complete
2022-12-09T17:25:35.0142784Z a73a0a50c4db: Verifying Checksum
2022-12-09T17:25:35.0143743Z a73a0a50c4db: Download complete
2022-12-09T17:25:35.2282893Z 0f68cc81f8f6: Verifying Checksum
2022-12-09T17:25:35.2283672Z 0f68cc81f8f6: Download complete
2022-12-09T17:25:35.8547685Z 61b6e3e25463: Verifying Checksum
2022-12-09T17:25:35.8547985Z 61b6e3e25463: Download complete
2022-12-09T17:25:36.3689873Z eff15d958d66: Pull complete
2022-12-09T17:25:38.9751393Z 923e91ae3a1b: Pull complete
2022-12-09T17:25:39.0574850Z 2aa5d3a4a151: Pull complete
2022-12-09T17:25:39.6785807Z bc64adf2d0b2: Pull complete
2022-12-09T17:25:39.7560781Z bfc5cca7d80e: Pull complete
2022-12-09T17:25:45.3145640Z 61b6e3e25463: Pull complete
2022-12-09T17:25:45.3626474Z 7c62fb63f605: Pull complete
2022-12-09T17:25:48.5182928Z 0f68cc81f8f6: Pull complete
2022-12-09T17:25:48.5924407Z 09f325326117: Pull complete
2022-12-09T17:25:48.6361139Z a73a0a50c4db: Pull complete
2022-12-09T17:25:48.6390662Z Digest: sha256:e56d7e4c5ac45aa2934b1d535f4c66769a442ef6538c7948f8b4e3b2950fd7b4
2022-12-09T17:25:48.6435854Z Status: Downloaded newer image for ghcr.io/actions/jekyll-build-pages:v1.0.4
2022-12-09T17:25:48.6436263Z ghcr.io/actions/jekyll-build-pages:v1.0.4
2022-12-09T17:25:48.6444026Z ##[endgroup]
2022-12-09T17:25:48.6814585Z ##[group]Run actions/checkout@v3
2022-12-09T17:25:48.6814842Z with:
2022-12-09T17:25:48.6815018Z   ref: main
2022-12-09T17:25:48.6815204Z   submodules: recursive
2022-12-09T17:25:48.6815442Z   repository: octo-org/octo-template
2022-12-09T17:25:48.6815884Z   token: ***
2022-12-09T17:25:48.6816068Z   ssh-strict: true
2022-12-09T17:25:48.6816284Z   persist-credentials: true
2022-12-09T17:25:48.6816500Z   clean: true
2022-12-09T17:25:48.6816685Z   fetch-depth: 1
2022-12-09T17:25:48.6816872Z   lfs: false
2022-12-09T17:25:48.6817076Z   set-safe-directory: true
2022-12-09T17:25:48.6817275Z ##[endgroup]
2022-12-09T17:25:48.9194010Z Syncing repository: octo-org/octo-template
2022-12-09T17:25:48.9195798Z ##[group]Getting Git version info
2022-12-09T17:25:48.9196263Z Working directory is '/home/runner/work/octo-template/octo-template'
2022-12-09T17:25:48.9196777Z [command]/usr/bin/git version
2022-12-09T17:25:48.9267188Z git version 2.38.1
2022-12-09T17:25:48.9293570Z ##[endgroup]
2022-12-09T17:25:48.9315385Z Temporarily overriding HOME='/home/runner/work/_temp/54730a3a-82b6-4069-a509-366e53e131cc' before making global git config changes
2022-12-09T17:25:48.9315845Z Adding repository directory to the temporary git global config as a safe directory
2022-12-09T17:25:48.9316365Z [command]/usr/bin/git config --global --add safe.directory /home/runner/work/octo-template/octo-template
2022-12-09T17:25:48.9362562Z Deleting the contents of '/home/runner/work/octo-template/octo-template'
2022-12-09T17:25:48.9366563Z ##[group]Initializing the repository
2022-12-09T17:25:48.9370913Z [command]/usr/bin/git init /home/runner/work/octo-template/octo-template
2022-12-09T17:25:48.9428579Z hint: Using 'master' as the name for the initial branch. This default branch name
2022-12-09T17:25:48.9429400Z hint: is subject to change. To configure the initial branch name to use in all
2022-12-09T17:25:48.9429828Z hint: of your new repositories, which will suppress this warning, call:
2022-12-09T17:25:48.9430089Z hint: 
2022-12-09T17:25:48.9430525Z hint: 	git config --global init.defaultBranch <name>
2022-12-09T17:25:48.9430769Z hint: 
2022-12-09T17:25:48.9431094Z hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and
2022-12-09T17:25:48.9431510Z hint: 'development'. The just-created branch can be renamed via this command:
2022-12-09T17:25:48.9431770Z hint: 
2022-12-09T17:25:48.9431994Z hint: 	git branch -m <name>
2022-12-09T17:25:48.9442316Z Initialized empty Git repository in /home/runner/work/octo-template/octo-template/.git/
2022-12-09T17:25:48.9454154Z [command]/usr/bin/git remote add origin https://github.com/octo-org/octo-template
2022-12-09T17:25:48.9490442Z ##[endgroup]
2022-12-09T17:25:48.9491112Z ##[group]Disabling automatic garbage collection
2022-12-09T17:25:48.9494676Z [command]/usr/bin/git config --local gc.auto 0
2022-12-09T17:25:48.9524540Z ##[endgroup]
2022-12-09T17:25:48.9525308Z ##[group]Setting up auth
2022-12-09T17:25:48.9532488Z [command]/usr/bin/git config --local --name-only --get-regexp core\.sshCommand
2022-12-09T17:25:48.9563906Z [command]/usr/bin/git submodule foreach --recursive git config --local --name-only --get-regexp 'core\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :
2022-12-09T17:25:48.9857748Z [command]/usr/bin/git config --local --name-only --get-regexp http\.https\:\/\/github\.com\/\.extraheader
2022-12-09T17:25:48.9892225Z [command]/usr/bin/git submodule foreach --recursive git config --local --name-only --get-regexp 'http\.https\:\/\/github\.com\/\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :
2022-12-09T17:25:49.0110192Z [command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***
2022-12-09T17:25:49.0146631Z ##[endgroup]
2022-12-09T17:25:49.0147330Z ##[group]Fetching the repository
2022-12-09T17:25:49.0156010Z [command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --progress --no-recurse-submodules --depth=1 origin +refs/heads/main*:refs/remotes/origin/main* +refs/tags/main*:refs/tags/main*
2022-12-09T17:25:49.2837218Z remote: Enumerating objects: 3, done.        
2022-12-09T17:25:49.2837524Z remote: Counting objects:  33% (1/3)        
2022-12-09T17:25:49.2837809Z remote: Counting objects:  66% (2/3)        
2022-12-09T17:25:49.2838044Z remote: Counting objects: 100% (3/3)        
2022-12-09T17:25:49.2839733Z remote: Counting objects: 100% (3/3), done.        
2022-12-09T17:25:49.2840661Z remote: Total 3 (delta 0), reused 0 (delta 0), pack-reused 0        
2022-12-09T17:25:49.2896737Z From https://github.com/octo-org/octo-template
2022-12-09T17:25:49.2897109Z  * [new branch]      main       -> origin/main
2022-12-09T17:25:49.2924446Z ##[endgroup]
2022-12-09T17:25:49.2925129Z ##[group]Determining the checkout info
2022-12-09T17:25:49.2931526Z [command]/usr/bin/git branch --list --remote origin/main
2022-12-09T17:25:49.2958361Z   origin/main
2022-12-09T17:25:49.2963283Z ##[endgroup]
2022-12-09T17:25:49.2964130Z ##[group]Checking out the ref
2022-12-09T17:25:49.2970560Z [command]/usr/bin/git checkout --progress --force -B main refs/remotes/origin/main
2022-12-09T17:25:49.3010381Z Switched to a new branch 'main'
2022-12-09T17:25:49.3014811Z branch 'main' set up to track 'origin/main'.
2022-12-09T17:25:49.3019861Z ##[endgroup]
2022-12-09T17:25:49.3022847Z ##[group]Setting up auth for fetching submodules
2022-12-09T17:25:49.3031486Z [command]/usr/bin/git config --global http.https://github.com/.extraheader AUTHORIZATION: basic ***
2022-12-09T17:25:49.3101009Z [command]/usr/bin/git config --global --unset-all url.https://github.com/.insteadOf
2022-12-09T17:25:49.3132496Z [command]/usr/bin/git config --global --add url.https://github.com/.insteadOf git@github.com:
2022-12-09T17:25:49.3159145Z ##[endgroup]
2022-12-09T17:25:49.3159671Z ##[group]Fetching submodules
2022-12-09T17:25:49.3163060Z [command]/usr/bin/git submodule sync --recursive
2022-12-09T17:25:49.3374628Z [command]/usr/bin/git -c protocol.version=2 submodule update --init --force --depth=1 --recursive
2022-12-09T17:25:49.3595435Z [command]/usr/bin/git submodule foreach --recursive git config --local gc.auto 0
2022-12-09T17:25:49.3838526Z ##[endgroup]
2022-12-09T17:25:49.3839209Z ##[group]Persisting credentials for submodules
2022-12-09T17:25:49.3844491Z [command]/usr/bin/git submodule foreach --recursive git config --local --name-only --get-regexp 'url\.https\:\/\/github\.com\/\.insteadOf' && git config --local --unset-all 'url.https://github.com/.insteadOf' || :
2022-12-09T17:25:49.4113780Z [command]/usr/bin/git submodule foreach --recursive git config --local 'http.https://github.com/.extraheader' 'AUTHORIZATION: basic ***' && git config --local --show-origin --name-only --get-regexp remote.origin.url
2022-12-09T17:25:49.4324497Z [command]/usr/bin/git submodule foreach --recursive git config --local --add 'url.https://github.com/.insteadOf' 'git@github.com:'
2022-12-09T17:25:49.4536981Z ##[endgroup]
2022-12-09T17:25:49.4565161Z [command]/usr/bin/git log -1 --format='%H'
2022-12-09T17:25:49.4592051Z 'c85af0e5e5798047462143a13c1b455ee1275a64'
2022-12-09T17:25:49.4851246Z ##[group]Run actions/jekyll-build-pages@v1
2022-12-09T17:25:49.4851491Z with:
2022-12-09T17:25:49.4851672Z   source: .
2022-12-09T17:25:49.4851856Z   destination: ./_site
2022-12-09T17:25:49.4852055Z   future: false
2022-12-09T17:25:49.4852300Z   build_revision: c85af0e5e5798047462143a13c1b455ee1275a64
2022-12-09T17:25:49.4852525Z   verbose: true
2022-12-09T17:25:49.4852887Z   token: ***
2022-12-09T17:25:49.4853073Z ##[endgroup]
2022-12-09T17:25:49.5094807Z ##[command]/usr/bin/docker run --name ghcrioactionsjekyllbuildpagesv104_e36266 --label 290506 --workdir /github/workspace --rm -e "INPUT_SOURCE" -e "INPUT_DESTINATION" -e "INPUT_FUTURE" -e "INPUT_BUILD_REVISION" -e "INPUT_VERBOSE" -e "INPUT_TOKEN" -e "HOME" -e "GITHUB_JOB" -e "GITHUB_REF" -e "GITHUB_SHA" -e "GITHUB_REPOSITORY" -e "GITHUB_REPOSITORY_OWNER" -e "GITHUB_RUN_ID" -e "GITHUB_RUN_NUMBER" -e "GITHUB_RETENTION_DAYS" -e "GITHUB_RUN_ATTEMPT" -e "GITHUB_ACTOR" -e "GITHUB_TRIGGERING_ACTOR" -e "GITHUB_WORKFLOW" -e "GITHUB_HEAD_REF" -e "GITHUB_BASE_REF" -e "GITHUB_EVENT_NAME" -e "GITHUB_SERVER_URL" -e "GITHUB_API_URL" -e "GITHUB_GRAPHQL_URL" -e "GITHUB_REF_NAME" -e "GITHUB_REF_PROTECTED" -e "GITHUB_REF_TYPE" -e "GITHUB_WORKSPACE" -e "GITHUB_ACTION" -e "GITHUB_EVENT_PATH" -e "GITHUB_ACTION_REPOSITORY" -e "GITHUB_ACTION_REF" -e "GITHUB_PATH" -e "GITHUB_ENV" -e "GITHUB_STEP_SUMMARY" -e "GITHUB_STATE" -e "GITHUB_OUTPUT" -e "RUNNER_OS" -e "RUNNER_ARCH" -e "RUNNER_NAME" -e "RUNNER_TOOL_CACHE" -e "RUNNER_TEMP" -e "RUNNER_WORKSPACE" -e "ACTIONS_RUNTIME_URL" -e "ACTIONS_RUNTIME_TOKEN" -e "ACTIONS_CACHE_URL" -e "ACTIONS_ID_TOKEN_REQUEST_URL" -e "ACTIONS_ID_TOKEN_REQUEST_TOKEN" -e GITHUB_ACTIONS=true -e CI=true -v "/var/run/docker.sock":"/var/run/docker.sock" -v "/home/runner/work/_temp/_github_home":"/github/home" -v "/home/runner/work/_temp/_github_workflow":"/github/workflow" -v "/home/runner/work/_temp/_runner_file_commands":"/github/file_commands" -v "/home/runner/work/octo-template/octo-template":"/github/workspace" ghcr.io/actions/jekyll-build-pages:v1.0.4
2022-12-09T17:25:50.5151506Z [33mConfiguration file: none[0m
2022-12-09T17:25:50.5313330Z   Logging at level: debug
2022-12-09T17:25:50.5313941Z       GitHub Pages: github-pages v227
2022-12-09T17:25:50.5314484Z       GitHub Pages: jekyll v3.9.2
2022-12-09T17:25:50.5315560Z              Theme: jekyll-theme-primer
2022-12-09T17:25:50.5316125Z       Theme source: /usr/local/bundle/gems/jekyll-theme-primer-0.6.0
2022-12-09T17:25:50.5316710Z          Requiring: jekyll-github-metadata
2022-12-09T17:25:50.6063961Z To use retry middleware with Faraday v2.0+, install faraday-retry gem
2022-12-09T17:25:52.4164334Z          Requiring: jekyll-seo-tag
2022-12-09T17:25:52.4165089Z          Requiring: jekyll-coffeescript
2022-12-09T17:25:52.4166139Z          Requiring: jekyll-commonmark-ghpages
2022-12-09T17:25:52.4166490Z          Requiring: jekyll-gist
2022-12-09T17:25:52.4167025Z          Requiring: jekyll-github-metadata
2022-12-09T17:25:52.4167363Z          Requiring: jekyll-paginate
2022-12-09T17:25:52.4167663Z          Requiring: jekyll-relative-links
2022-12-09T17:25:52.4167989Z          Requiring: jekyll-optional-front-matter
2022-12-09T17:25:52.4168298Z          Requiring: jekyll-readme-index
2022-12-09T17:25:52.4168589Z          Requiring: jekyll-default-layout
2022-12-09T17:25:52.4168888Z          Requiring: jekyll-titles-from-headings
2022-12-09T17:25:52.4169143Z    GitHub Metadata: Initializing...
2022-12-09T17:25:52.4169392Z             Source: /github/workspace/.
2022-12-09T17:25:52.4169651Z        Destination: /github/workspace/./_site
2022-12-09T17:25:52.4169981Z  Incremental build: disabled. Enable with --incremental
2022-12-09T17:25:52.4170230Z       Generating... 
2022-12-09T17:25:52.4183638Z         Generating: JekyllOptionalFrontMatter::Generator finished in 0.000150897 seconds.
2022-12-09T17:25:52.4184136Z         Generating: JekyllReadmeIndex::Generator finished in 0.00169567 seconds.
2022-12-09T17:25:52.4185038Z         Generating: Jekyll::Paginate::Pagination finished in 4.8e-06 seconds.
2022-12-09T17:25:52.4185483Z         Generating: JekyllRelativeLinks::Generator finished in 2.97e-05 seconds.
2022-12-09T17:25:52.4185914Z         Generating: JekyllDefaultLayout::Generator finished in 7.7999e-05 seconds.
2022-12-09T17:25:52.4186258Z          Requiring: kramdown-parser-gfm
2022-12-09T17:25:52.4186586Z         Generating: JekyllTitlesFromHeadings::Generator finished in 0.008350253 seconds.
2022-12-09T17:25:52.4186888Z          Rendering: assets/css/style.scss
2022-12-09T17:25:52.4187176Z   Pre-Render Hooks: assets/css/style.scss
2022-12-09T17:25:52.4187437Z   Rendering Markup: assets/css/style.scss
2022-12-09T17:25:52.4187672Z          Rendering: README.md
2022-12-09T17:25:52.4187920Z   Pre-Render Hooks: README.md
2022-12-09T17:25:52.4188141Z   Rendering Markup: README.md
2022-12-09T17:25:52.4188360Z   Rendering Layout: README.md
2022-12-09T17:25:52.4188568Z      Layout source: theme
2022-12-09T17:25:52.4188886Z    GitHub Metadata: Generating for octo-org/octo-template
2022-12-09T17:25:52.4189408Z    GitHub Metadata: Calling @client.repository("octo-org/octo-template", {:accept=>"application/vnd.github.drax-preview+json"})
2022-12-09T17:25:52.4189903Z    GitHub Metadata: Calling @client.pages("octo-org/octo-template", {})
2022-12-09T17:25:52.4190223Z            Writing: /github/workspace/_site/assets/css/style.css
2022-12-09T17:25:52.4190520Z            Writing: /github/workspace/_site/index.html
2022-12-09T17:25:52.4190772Z                     done in 1.524 seconds.
2022-12-09T17:25:52.4191074Z  Auto-regeneration: disabled. Use --watch to enable.
2022-12-09T17:25:52.5460546Z ##[group]Run actions/upload-pages-artifact@v1
2022-12-09T17:25:52.5460787Z with:
2022-12-09T17:25:52.5460968Z   path: ./_site
2022-12-09T17:25:52.5461168Z   name: github-pages
2022-12-09T17:25:52.5461361Z   retention-days: 1
2022-12-09T17:25:52.5461560Z ##[endgroup]
2022-12-09T17:25:52.5745795Z ##[group]Run chmod -c -R +rX . | while read line; do
2022-12-09T17:25:52.5746128Z [36;1mchmod -c -R +rX . | while read line; do[0m
2022-12-09T17:25:52.5746462Z [36;1m  echo "::warning title=Invalid file permissions automatically fixed::$line"[0m
2022-12-09T17:25:52.5746740Z [36;1mdone[0m
2022-12-09T17:25:52.5746920Z [36;1mtar \[0m
2022-12-09T17:25:52.5747146Z [36;1m  --dereference --hard-dereference \[0m
2022-12-09T17:25:52.5747410Z [36;1m  --directory "$INPUT_PATH" \[0m
2022-12-09T17:25:52.5747668Z [36;1m  -cvf "$RUNNER_TEMP/artifact.tar" \[0m
2022-12-09T17:25:52.5747896Z [36;1m  --exclude=.git \[0m
2022-12-09T17:25:52.5748110Z [36;1m  --exclude=.github \[0m
2022-12-09T17:25:52.5748352Z [36;1m  .[0m
2022-12-09T17:25:52.5805770Z shell: /usr/bin/sh -e {0}
2022-12-09T17:25:52.5805980Z env:
2022-12-09T17:25:52.5806170Z   INPUT_PATH: ./_site
2022-12-09T17:25:52.5806374Z ##[endgroup]
2022-12-09T17:25:52.5967973Z chmod: changing permissions of './_site': Operation not permitted
2022-12-09T17:25:52.5986749Z chmod: changing permissions of './_site/index.html': Operation not permitted
2022-12-09T17:25:52.5987217Z chmod: changing permissions of './_site/README.md': Operation not permitted
2022-12-09T17:25:52.5987625Z chmod: changing permissions of './_site/assets': Operation not permitted
2022-12-09T17:25:52.5988025Z chmod: changing permissions of './_site/assets/css': Operation not permitted
2022-12-09T17:25:52.5988455Z chmod: changing permissions of './_site/assets/css/style.css': Operation not permitted
2022-12-09T17:25:52.6003872Z ./
2022-12-09T17:25:52.6004035Z ./index.html
2022-12-09T17:25:52.6004213Z ./README.md
2022-12-09T17:25:52.6004387Z ./assets/
2022-12-09T17:25:52.6004556Z ./assets/css/
2022-12-09T17:25:52.6004743Z ./assets/css/style.css
2022-12-09T17:25:52.6089697Z ##[group]Run actions/upload-artifact@main
2022-12-09T17:25:52.6089918Z with:
2022-12-09T17:25:52.6090104Z   name: github-pages
2022-12-09T17:25:52.6090342Z   path: /home/runner/work/_temp/artifact.tar
2022-12-09T17:25:52.6090677Z   retention-days: 1
2022-12-09T17:25:52.6090884Z   if-no-files-found: warn
2022-12-09T17:25:52.6091085Z ##[endgroup]
2022-12-09T17:25:52.6745114Z With the provided path, there will be 1 file uploaded
2022-12-09T17:25:52.6748618Z Starting artifact upload
2022-12-09T17:25:52.6749367Z For more detailed logs during the artifact upload process, enable step-debugging: https://docs.github.com/actions/monitoring-and-troubleshooting-workflows/enabling-debug-logging#enabling-step-debug-logging
2022-12-09T17:25:52.6750012Z Artifact name is valid!
2022-12-09T17:25:52.7711407Z Container for artifact "github-pages" successfully created. Starting upload of file(s)
2022-12-09T17:25:52.8679144Z Total size of all the files uploaded is 12638 bytes
2022-12-09T17:25:52.8680162Z File upload process has finished. Finalizing the artifact upload
2022-12-09T17:25:52.8976033Z Artifact has been finalized. All files have been successfully uploaded!
2022-12-09T17:25:52.8976512Z 
2022-12-09T17:25:52.8976816Z The raw size of all the files that were specified for upload is 92160 bytes
2022-12-09T17:25:52.8977329Z The size of all the files that were uploaded is 12638 bytes. This takes into account any gzip compression used to reduce the upload size, time and storage
2022-12-09T17:25:52.8977612Z 
2022-12-09T17:25:52.8978179Z Note: The size of downloaded zips can differ significantly from the reported size. For more information see: https://github.com/actions/upload-artifact#zipped-artifact-downloads 
2022-12-09T17:25:52.8978524Z 
2022-12-09T17:25:52.8980509Z Artifact github-pages has been successfully uploaded!
2022-12-09T17:25:52.9084311Z Post job cleanup.
2022-12-09T17:25:53.0358449Z [command]/usr/bin/git version
2022-12-09T17:25:53.0407485Z git version 2.38.1
2022-12-09T17:25:53.0465462Z Temporarily overriding HOME='/home/runner/work/_temp/52bccf8b-8b44-45e0-a383-0833ced20023' before making global git config changes
2022-12-09T17:25:53.0470560Z Adding repository directory to the temporary git global config as a safe directory
2022-12-09T17:25:53.0478850Z [command]/usr/bin/git config --global --add safe.directory /home/runner/work/octo-template/octo-template
2022-12-09T17:25:53.0517249Z [command]/usr/bin/git config --local --name-only --get-regexp core\.sshCommand
2022-12-09T17:25:53.0550835Z [command]/usr/bin/git submodule foreach --recursive git config --local --name-only --get-regexp 'core\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :
2022-12-09T17:25:53.0769173Z [command]/usr/bin/git config --local --name-only --get-regexp http\.https\:\/\/github\.com\/\.extraheader
2022-12-09T17:25:53.0792441Z http.https://github.com/.extraheader
2022-12-09T17:25:53.0803756Z [command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader
2022-12-09T17:25:53.0838329Z [command]/usr/bin/git submodule foreach --recursive git config --local --name-only --get-regexp 'http\.https\:\/\/github\.com\/\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :
2022-12-09T17:25:53.1274888Z Cleaning up orphan processes
`;
