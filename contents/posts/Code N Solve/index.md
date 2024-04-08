---
title: "🚀 GitHub Actions를 이용한 블로그 자동 배포 문제 해결 과정"
description: "GitHub Actions Workflow 설정 문제, Windows에서 SSH 키 대신 PAT 사용, 의존성 문제 해결, 그리고 Git 사용자 정보 설정 문제와 이들을 해결하는 방법"
date: 2024-04-01
update: 2024-04-04
tags:
  - GitHub Actions
  - Workflow
  - Deployment Automation
  - Personal Access Token
  - PAT
  - SSH Key
  - 의존성 관리
  - Code N Solve
series: "Code N Solve"
---

## Code N Solve 📘

## GitHub Actions[^1]를 이용한 문제 해결과 배포 자동화 🚀

GitHub Actions는 개발 프로세스를 자동화하여 빌드, 테스트, 배포 등을 수행할 수 있는 강력한 도구이다.
하지만 올바른 설정 없이는 원하는 대로 작동하지 않을 수 있다.
Deployment 자동화를 위해 GitHub Actions의 Workflow를 설정할 때 겪은 몇 가지 문제와 이를 해결하는 방법에 대해 이야기해보자.

## Blog Deployment 자동화

현재 블로그 테마는 [gatsby-starter-hoodie](https://github.com/devHudi/gatsby-starter-hoodie?tab=readme-ov-file)를 활용하고 있다.

여기에 CI (Continuous Integration)[^2] 코드는 이미 작성되어 있고, Netlify를 통한 배포 방식이 설명되어 있지만 Github Pages를 이용해 배포를 하고 있었다.
매번 `$ npm run deploy-gh` 명령을 하기 귀찮아져 자동화 Workflow를 만들기로 결심한다.

## GitHub Actions Workflow 설정

### 1. GitHub Pages 자동 배포[^3][^4]

- 시도:

  - GitHub Pages에 자동으로 배포하기.
    <details>
    <summary>접기/펼치기</summary>

        ```yaml
        name: Build and Deploy

        on:
          push:
            branches:
              - main

        jobs:
          deploy:
            runs-on: ubuntu-latest

            steps:
              - name: Checkout Repository
                uses: actions/checkout@v2

              - name: Setup Node.js
                uses: actions/setup-node@v2
                with:
                  node-version: "14"

              - name: Install Dependencies
                run: npm install

              - name: Build
                run: npm run build

              - name: Deploy to GitHub Pages
                uses: peaceiris/actions-gh-pages@v3
                with:
                  deploy_key: ${{ secrets.ACCESS_TOKEN }}
                  publish_dir: ./public
                  publish_branch: gh-pages
        ```

    </details>

- 문제:

- Workflow 설정 파일(deploy.yml)을 작성했지만 Node.js 버전이 낮아 Gatsby 빌드 중 오류가 발생했다.
  <details>
  <summary>접기/펼치기</summary>

      ```bash
      error Gatsby requires Node.js 18.0.0 or higher (you have v14.21.3).
      Upgrade Node to the latest stable release: https://gatsby.dev/upgrading-node-js
      npm ERR! code ELIFECYCLE
      ```

  </details>

### 2. Node.js 버전 충돌

- 문제:

  - Workflow 설정에서는 14.21.3 버전이 지정되어 있었는데 Node.js의 버전 18.0.0 이상을 빌요로 하여 Gatsby 빌드 중 오류가 발생했다.

- 시도:

  - Node.js 버전(node-version)을 20.3.1로 업데이트하였다.

    <details>
    <summary>접기/펼치기</summary>
    ```yaml
    name: Build and Deploy

            on:
            push:
            branches: - main

            jobs:
            deploy:
            runs-on: ubuntu-latest

                  steps:
                    - name: Checkout Repository
                      uses: actions/checkout@v2

                    - name: Setup Node.js
                      uses: actions/setup-node@v2
                      with:
                        node-version: 20.3.1

                    - name: Install Dependencies
                      run: npm install

                    - name: Build
                      run: npm run build

                    - name: Deploy to GitHub Pages
                      uses: peaceiris/actions-gh-pages@v3
                      with:
                        deploy_key: ${{ secrets.ACCESS_TOKEN }}
                        publish_dir: ./public
                        publish_branch: gh-pages
            ```

    </details>

- 해결:

  - Node.js 버전을 20.3.1로 업데이트하여 문제를 해결했지만 이후에 패키지 의존성 충돌 문제가 발생했다.
    <details>
    <summary>접기/펼치기</summary>

    ```bash
    Run npm install
    npm ERR! code ERESOLVE
    npm ERR! ERESOLVE could not resolve
    npm ERR!
    npm ERR! While resolving: gatsby-remark-katex@3.10.0
    npm ERR! Found: gatsby@5.13.3
    npm ERR! node_modules/gatsby
    npm ERR!   gatsby@"^5.11.0" from the root project
    npm ERR!   peer gatsby@"^5.0.0-next" from babel-plugin-remove-graphql-queries@5.13.1
    npm ERR!   node_modules/babel-plugin-remove-graphql-queries
    npm ERR!     babel-plugin-remove-graphql-queries@"^5.13.1" from gatsby@5.13.3
    npm ERR!     babel-plugin-remove-graphql-queries@"^5.13.1" from gatsby-plugin-typescript@5.13.1
    npm ERR!     node_modules/gatsby-plugin-typescript
    npm ERR!       gatsby-plugin-typescript@"^5.13.1" from gatsby@5.13.3
    npm ERR!   17 more (gatsby-plugin-catch-links, gatsby-plugin-feed, ...)
    npm ERR!
    npm ERR! Could not resolve dependency:
    npm ERR! peer gatsby@"^2.0.0" from gatsby-remark-katex@3.10.0
    npm ERR! node_modules/gatsby-remark-katex
    npm ERR!   gatsby-remark-katex@"^3.5.0" from the root project
    npm ERR!
    npm ERR! Conflicting peer dependency: gatsby@2.32.13
    npm ERR! node_modules/gatsby
    npm ERR!   peer gatsby@"^2.0.0" from gatsby-remark-katex@3.10.0
    npm ERR!   node_modules/gatsby-remark-katex
    npm ERR!     gatsby-remark-katex@"^3.5.0" from the root project
    npm ERR!
    npm ERR! Fix the upstream dependency conflict, or retry
    npm ERR! this command with --force or --legacy-peer-deps
    npm ERR! to accept an incorrect (and potentially broken) dependency resolution.
    ```

</details>

### 3. Node.js 패키지 의존성 충돌 및 GitHub 토큰 시크릿 등록

- 시도:

  - 패키지 의존성 충돌 문제를 --legacy-peer-deps 명령으로 해결하고 GitHub 토큰을 시크릿에 등록을 하기로 했다.
    <details>
    <summary>접기/펼치기</summary>

    ```yaml
    name: Build and Deploy

    on:
      push:
        branches:
          - main

    jobs:
      deploy:
        runs-on: ubuntu-latest

        steps:
          - name: Checkout Repository
            uses: actions/checkout@v2

          - name: Setup Node.js
            uses: actions/setup-node@v2
            with:
              node-version: 20.3.1

          - name: Install Dependencies
            run: npm install --legacy-peer-deps

          - name: Build
            run: npm run build

          - name: Deploy to GitHub Pages
            uses: peaceiris/actions-gh-pages@v3
            with:
              deploy_key: ${{ secrets.ACCESS_TOKEN }}
              publish_dir: ./public
              publish_branch: gh-pages
    ```

</details>

- 해결:

  - 프로필 - Settings - Developer Settings - Personal access tokens에서 생성한 토큰을 복사하여 저장소 secrets에 등록했다.
      <details>
      <summary>접기/펼치기</summary>
        ```bash
        Run peaceiris/actions-gh-pages@v3
          with:
            deploy_key: ***
            publish_dir: ./public
            publish_branch: gh-pages
            allow_empty_commit: false
            keep_files: false
            force_orphan: false
            enable_jekyll: false
            disable_nojekyll: false
            exclude_assets: .github
        [INFO] Usage https://github.com/peaceiris/actions-gh-pages#readme
        Dump inputs
          [INFO] DeployKey: true
          [INFO] PublishBranch: gh-pages
          [INFO] PublishDir: ./public
          [INFO] DestinationDir:
          [INFO] ExternalRepository:
          [INFO] AllowEmptyCommit: false
          [INFO] KeepFiles: false
          [INFO] ForceOrphan: false
          [INFO] UserName:
          [INFO] UserEmail:
          [INFO] CommitMessage:
          [INFO] FullCommitMessage:
          [INFO] TagName:
          [INFO] TagMessage:
          [INFO] EnableJekyll (DisableNoJekyll): false
          [INFO] CNAME:
          [INFO] ExcludeAssets .github

        Setup auth token
        [INFO] setup SSH deploy key
        /usr/bin/chmod 700 /home/runner/.ssh
        [INFO] wrote /home/runner/.ssh/known_hosts
        /usr/bin/chmod 600 /home/runner/.ssh/known_hosts
        [INFO] wrote /home/runner/.ssh/github
        /usr/bin/chmod 600 /home/runner/.ssh/github
        [INFO] wrote /home/runner/.ssh/config
        /usr/bin/chmod 600 /home/runner/.ssh/config
        /usr/bin/ssh-add /home/runner/.ssh/github
        Error loading key "/home/runner/.ssh/github": error in libcrypto
        Error: Action failed with "The process '/usr/bin/ssh-add' failed with exit code 1"

        ````

    </details>

### 4. User authenticate using git config

- 시도:
  - token을 secret에 등록하였지만 token 인증에 실패하여 git config 명령을 통해 사용자를 등록하였다.
- 문제:

  - SSH 인증은 Windows 환경에서는 적용되지 않는 것 같다.
      <details>
      <summary>접기/펼치기</summary>
        ```yaml
        name: Build and Deploy

        on:
          push:
            branches:
              - main

        jobs:
          deploy:
            runs-on: ubuntu-latest

            steps:
              - name: Checkout Repository
                uses: actions/checkout@v2

              - name: Setup Node.js
                uses: actions/setup-node@v2
                with:
                  node-version: 20.3.1

              - name: Install Dependencies
                run: npm install --legacy-peer-deps

              - name: Build
                run: npm run build

              - name: Deploy to GitHub Pages
                env:
                  ACCESS_TOKEN: ${{ secrets.PAT }}
                run: |
                  git config --global user.name "USER NAME"
                  git config --global user.email "USER@EMAIL.COM"
                  npx gh-pages -d ./public -b gh-pages -u $ACCESS_TOKEN
        ````

        </details>
        - 문제
          - git config 명령을 통해 사용자를 등록했지만 오류가 발생했다.
          <details>
          <summary>접기/펼치기</summary>
        ```bash
        Run git config --global user.name "USER NAME"
          git config --global user.name "USER NAME"
          git config --global user.email "USER@EMAIL.COM"
          npx gh-pages -d ./public -b gh-pages -u $ACCESS_TOKEN
          shell: /usr/bin/bash -e {0}
          env:
            ACCESS_TOKEN: ***
        Could not parse name and email from user option "***" (format should be "Your Name <email@example.com>")
        Error: Process completed with exit code 1.
        ```

    </details>

### 5. User authenticate using token

- 시도:

  - token으로 사용자 인증을 시도하였다.
    <details>
    <summary>접기/펼치기</summary>

    ```yaml
    name: Build and Deploy

    on:
      push:
        branches:
          - main

    jobs:
      deploy:
        runs-on: ubuntu-latest

        steps:
          - name: Checkout Repository
            uses: actions/checkout@v2

          - name: Setup Node.js
            uses: actions/setup-node@v2
            with:
              node-version: 20.3.1

          - name: Install Dependencies
            run: npm install --legacy-peer-deps

          - name: Build
            run: npm run build

          - name: Deploy to GitHub Pages
            env:
              ACCESS_TOKEN: ${{ secrets.PAT }}
            run: |
              npx gh-pages -d ./public -b gh-pages -u $ACCESS_TOKEN
    ```

</details>
- 문제:
  - 같은 문제가 반복되었다.
  <details>
  <summary>접기/펼치기</summary>
    ```bash
    Run npx gh-pages -d ./public -b gh-pages -u $ACCESS_TOKEN
      npx gh-pages -d ./public -b gh-pages -u $ACCESS_TOKEN
      shell: /usr/bin/bash -e {0}
      env:
        ACCESS_TOKEN: ***
    Could not parse name and email from user option "***" (format should be "Your Name <email@example.com>")
    Error: Process completed with exit code 1.
    ```
</details>

### 6. User authenticate using token 2

- 시도:

  - 토큰을 이용해 사용자 인증을 시도할때 옵션을 -u에서 -t로 변경해 토큰을 인식하도록 해주었다.
    <details>
    <summary>접기/펼치기</summary>

    ```yaml
    name: Build and Deploy

    on:
      push:
        branches:
          - main

    jobs:
      deploy:
        runs-on: ubuntu-latest

        steps:
          - name: Checkout Repository
            uses: actions/checkout@v2

          - name: Setup Node.js
            uses: actions/setup-node@v2
            with:
              node-version: 20.3.1

          - name: Install Dependencies
            run: npm install --legacy-peer-deps

          - name: Build
            run: npm run build

          - name: Deploy to GitHub Pages
            env:
              ACCESS_TOKEN: ${{ secrets.PAT }}
            run: |
              npx gh-pages -d ./public -b gh-pages -t $ACCESS_TOKEN
    ```

</details>
- 문제:

- git config 명령을 이용해 사용자의 신원을 설정하라는 오류(Author identity unknown)로 변경되었다.
  <details>
  <summary>접기/펼치기</summary>

      ```bash
      Run npx gh-pages -d ./public -b gh-pages -t $ACCESS_TOKEN
        npx gh-pages -d ./public -b gh-pages -t $ACCESS_TOKEN
        shell: /usr/bin/bash -e {0}
        env:
          ACCESS_TOKEN: ***
      Author identity unknown

      *** Please tell me who you are.

      Run

        git config --global user.email "you@example.com"
        git config --global user.name "Your Name"

      to set your account's default identity.
      Omit --global to set the identity only in this repository.

      fatal: unable to auto-detect email address (got 'runner@fv-az1535-535.(none)')

      Error: Process completed with exit code 1.
      ```

</details>

### 7. User authenticate using git config 2

- 시도:

  - git config 명령을 사용해 사용자 정보를 인식할 수 있도록 해주었다.
    <details>
    <summary>접기/펼치기</summary>

    ```yaml
    name: Build and Deploy

    on:
      push:
        branches:
          - main

    jobs:
      deploy:
        runs-on: ubuntu-latest

        steps:
          - name: Checkout Repository
            uses: actions/checkout@v2

          - name: Setup Node.js
            uses: actions/setup-node@v2
            with:
              node-version: 20.3.1

          - name: Install Dependencies
            run: npm install --legacy-peer-deps

          - name: Build
            run: npm run build

          - name: Deploy to GitHub Pages
            env:
              ACCESS_TOKEN: ${{ secrets.PAT }}
            run: |
              git config --global user.email "USER@EMAIL.COM"
              git config --global user.name "USER NAME"
              npx gh-pages -d ./public -b gh-pages -t $ACCESS_TOKEN
    ```

</details>

- 문제:

  - Author identity unknown 오류는 배포 시 Git 사용자 정보를 설정해두지 않아 발생하는 오류로 Git이 커밋을 생성할 때 사용자의 정보를 필요로 하기 때문에 발생하는데 문제가 반복되었다.
      <details>
      <summary>접기/펼치기</summary>
        ```bash
        Run git config --global user.email "USER@EMAIL.COM"
          git config --global user.email "USER@EMAIL.COM"
          git config --global user.name "USER NAME"
          npx gh-pages -d ./public -b gh-pages -t $ACCESS_TOKEN
          shell: /usr/bin/bash -e {0}
          env:
            ACCESS_TOKEN: ***
        fatal: could not read Username for 'https://github.com': No such device or address

        Error: Process completed with exit code 1.

        ```

    </details>

### 8. User authenticate using git config 3

- 시도:

  - HTTPS URL에 토큰을 추가하여 사용자를 인식할 수 있게 시도하였다.[^5]
    <details>
    <summary>접기/펼치기</summary>
      ```yaml
      name: Build and Deploy

    on:
    push:
    branches: - main

    jobs:
    deploy:
    runs-on: ubuntu-latest

          steps:
            - name: Checkout Repository
              uses: actions/checkout@v2

            - name: Setup Node.js
              uses: actions/setup-node@v2
              with:
                node-version: 20.3.1

            - name: Install Dependencies
              run: npm install --legacy-peer-deps

            - name: Build
              run: npm run build

            - name: Deploy to GitHub Pages
              env:
                ACCESS_TOKEN: ${{ secrets.PAT }}
              run: |
                git config --global url.https://${{ secrets.PAT }}@github.com/.insteadOf https://github.com/
                npx gh-pages -d ./public -b gh-pages -t $ACCESS_TOKEN

    ```

    ```

</details>

- 문제:

  - 여전히 Author identity unknown 상태이다.
      <details>
      <summary>접기/펼치기</summary>
        ```bash
        Run git config --global url.https://***@github.com/.insteadOf https://github.com/
          git config --global url.https://***@github.com/.insteadOf https://github.com/
          npx gh-pages -d ./public -b gh-pages -t $ACCESS_TOKEN
          shell: /usr/bin/bash -e {0}
          env:
            ACCESS_TOKEN: ***
        Author identity unknown

        \*\*\* Please tell me who you are.

        Run

        git config --global user.email "you@example.com"
        git config --global user.name "Your Name"

        to set your account's default identity.
        Omit --global to set the identity only in this repository.

        fatal: empty ident name (for <runner@fv-az1118-461.jboa14ee0bjuvjv5ua334yvpdd.cx.internal.cloudapp.net>) not allowed

        Error: Process completed with exit code 1.

        ````

    </details>

### 9. User authenticate using git config 4

- 시도:

  - 다시 git config 명령을 사용해 사용자 정보를 추가하였다.
      <details>
      <summary>접기/펼치기</summary>
        ```yaml
        name: Build and Deploy

        on:
          push:
            branches:
              - main

        jobs:
          deploy:
            runs-on: ubuntu-latest

            steps:
              - name: Checkout Repository
                uses: actions/checkout@v2

              - name: Setup Node.js
                uses: actions/setup-node@v2
                with:
                  node-version: 20.3.1

              - name: Install Dependencies
                run: npm install --legacy-peer-deps

              - name: Build
                run: npm run build

              - name: Deploy to GitHub Pages
                env:
                  ACCESS_TOKEN: ${{ secrets.PAT }}
                run: |
                  git config --global user.name "USER NAME"
                  git config --global user.email "USER@EMAIL.COM"
                  npx gh-pages -d ./public -b gh-pages -t $ACCESS_TOKEN
        ````

        </details>
        - 문제:
          - 이전에 나타났던 문제가 계속 나타나 눈물이 날 뻔 했다.
          <details>
          <summary>접기/펼치기</summary>
        ```bash
        Run git config --global user.name "USER NAME"
          git config --global user.name "USER NAME"
          git config --global user.email "USER@EMAIL.COM"
          npx gh-pages -d ./public -b gh-pages -t $ACCESS_TOKEN
          shell: /usr/bin/bash -e {0}
          env:
            ACCESS_TOKEN: ***
        fatal: could not read Username for 'https://github.com': No such device or address
        ```

    </details>

### 10. User authenticate using git config 5

- 시도:

  - 혹시 토큰이 인식이 안되고 있나 의심스러워서 순서를 변경하여 다시 시도하였다.
    <details>
    <summary>접기/펼치기</summary>

    ```yaml
    name: Build and Deploy

    on:
      push:
        branches:
          - main

    jobs:
      deploy:
        runs-on: ubuntu-latest
        env:
          PAT: ${{ secrets.PAT }}

        steps:
          - name: Checkout Repository
            uses: actions/checkout@v2

          - name: Setup Node.js
            uses: actions/setup-node@v2
            with:
              node-version: 20.3.1

          - name: Install Dependencies
            run: npm install --legacy-peer-deps

          - name: Build
            run: npm run build

          - name: Deploy to GitHub Pages
            run: |
              git config --global url.https://$PAT@github.com/.insteadOf https://github.com/
              npx gh-pages -d ./public -b gh-pages -t $PAT
    ```

</details>

- 문제:

  - 달라지지 않은 오류 메시지가 나와 눈물이 났다.
      <details>
      <summary>접기/펼치기</summary>
        ```bash
        Run git config --global user.name "USER NAME"
          git config --global user.name "USER NAME"
          git config --global user.email "USER@EMAIL.COM"
          npx gh-pages -d ./public -b gh-pages -t $ACCESS_TOKEN
          shell: /usr/bin/bash -e {0}
          env:
            ACCESS_TOKEN: ***
        fatal: could not read Username for 'https://github.com': No such device or address

        Error: Process completed with exit code 1.
        ```

    </details>

### 11. User authenticate using git config 6

- 시도:

  - git config 명령을 빌드 과정에서 미리 해주면 될까 싶어 시도하였다.
    <details>
    <summary>접기/펼치기</summary>
      ```yaml
      name: Build and Deploy

    on:
    push:
    branches: - main

    jobs:
    deploy:
    runs-on: ubuntu-latest
    env:
    PAT: ${{ secrets.PAT }}

          steps:
            - name: Checkout Repository
              uses: actions/checkout@v2

            - name: Setup Node.js
              uses: actions/setup-node@v2
              with:
                node-version: 20.3.1

            - name: Install Dependencies
              run: npm install --legacy-peer-deps

            - name: Build
              run: |
                git config --global url.https://$PAT@github.com/.insteadOf https://github.com/
                npm run build

            - name: Deploy to GitHub Pages
              run: |
                npx gh-pages -d ./public -b gh-pages -t $PAT

    ```

    ```

</details>

- 해결:
  - git config 명령을 deploy 과정 이전에 진행해야 한다는 결론을 얻었다.
- 문제:

  - 여전히 Author identity unknow 문제가 있다.
    <details>
    <summary>접기/펼치기</summary>
      ```bash
      Run npx gh-pages -d ./public -b gh-pages -t $PAT
        npx gh-pages -d ./public -b gh-pages -t $PAT
        shell: /usr/bin/bash -e {0}
        env:
          PAT: ***
      Author identity unknown

    \*\*\* Please tell me who you are.

    Run

    git config --global user.email "you@example.com"
    git config --global user.name "Your Name"

    to set your account's default identity.
    Omit --global to set the identity only in this repository.

    fatal: unable to auto-detect email address (got 'runner@fv-az1385-401.(none)')

    Error: Process completed with exit code 1.

    ```

    ```

</details>

### 12. User authenticate using git config 7

- 시도:

  - git config 명령을 통한 사용자 정보 설정 단계를 별도로 만들어 주었다.
    <details>
    <summary>접기/펼치기</summary>
      ```yaml
      name: Build and Deploy

    on:
    push:
    branches: - main

    jobs:
    deploy:
    runs-on: ubuntu-latest
    env:
    PAT: ${{ secrets.PAT }}

          steps:
            - name: Checkout Repository
              uses: actions/checkout@v2

            - name: Setup Node.js
              uses: actions/setup-node@v2
              with:
                node-version: 20.3.1

            - name: Install Dependencies
              run: npm install --legacy-peer-deps

            - name: Build
              run: npm run build

            - name: Set Git user information
              run: git config --global url.https://$PAT@github.com/.insteadOf https://github.com/

            - name: Deploy to GitHub Pages
              run: |
                npx gh-pages -d ./public -b gh-pages -t $PAT

    ```

    ```

</details>

- 문제:

  - 다시 눈물이 났다.
      <details>
      <summary>접기/펼치기</summary>
        ```bash
        Run npx gh-pages -d ./public -b gh-pages -t $PAT
          npx gh-pages -d ./public -b gh-pages -t $PAT
          shell: /usr/bin/bash -e {0}
          env:
            PAT: ***
        Author identity unknown

        \*\*\* Please tell me who you are.

        Run

        git config --global user.email "you@example.com"
        git config --global user.name "Your Name"

        to set your account's default identity.
        Omit --global to set the identity only in this repository.

        fatal: empty ident name (for <runner@fv-az914-157.2e4pmxhwlzfuhnev11cd0y0noa.phxx.internal.cloudapp.net>) not allowed

        Error: Process completed with exit code 1.

        ```

    </details>

### 13. User authenticate using git config 8

- 시도:

  - 사용자 정보 단계에서 가진 모든 정보를 알려주었다.
    <details>
    <summary>접기/펼치기</summary>
      ```yaml
      name: Build and Deploy

    on:
    push:
    branches: - main

    jobs:
    deploy:
    runs-on: ubuntu-latest
    env:
    PAT: ${{ secrets.PAT }}

          steps:
            - name: Checkout Repository
              uses: actions/checkout@v2

            - name: Setup Node.js
              uses: actions/setup-node@v2
              with:
                node-version: 20.3.1

            - name: Install Dependencies
              run: npm install --legacy-peer-deps

            - name: Build
              run: npm run build

            - name: Set Git user information
              run: |
                git config --global user.email "amysun125@gmail.com"
                git config --global user.name "leekh8"

            - name: Deploy to GitHub Pages
              run: |
                git config --global url.https://$PAT@github.com/.insteadOf https://github.com/
                npx gh-pages -d ./public -b gh-pages -t $PAT

    ```

    ```

</details>

- 성공!

```bash
Published
```

[^1]: https://docs.github.com/ko/enterprise-server@3.10/actions/learn-github-actions
[^2]: https://docs.github.com/ko/enterprise-server@3.10/actions/automating-builds-and-tests/about-continuous-integration
[^3]: https://docs.github.com/ko/enterprise-server@3.10/actions/examples/using-scripts-to-test-your-code-on-a-runner
[^4]: https://docs.github.com/ko/enterprise-server@3.10/actions/using-workflows/workflow-syntax-for-github-actions
[^5]: https://github.com/orgs/community/discussions/26580
