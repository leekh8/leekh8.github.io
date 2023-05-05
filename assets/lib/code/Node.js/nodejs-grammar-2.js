// ---------------- npm 사용 ----------------
// npm init
/*
$ npm init
package name: (first-project)
version: (1.0.0)
description:
entry point: (index.js)
test command:
git repository:
keywords:
author:
license: (ISC)
About to write to ~/package.json:
{
  "name": "first-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {},
  "author": "",
  "license": "ISC"
}

Is this OK? (yes)
*/

// ---------------- npm install ----------------
/*
$ npm install [package-name]
필요한 패키지 프로젝트에 추가
package.json의 dependencies에 추가, node_modules 디렉토리에 저장
*/

/*
$npm install [package-name] --save-dev
개발용 의존성을 분리하여 관리
개발용 의존성?
배포 전까지만 사용하는 의존성
(예. 유닛 테스트 라이브러리)
--save-dev 옵션을 이용해 개발용 의존성 추가 가능
package.json의 devDependencies에 추가
*/

/*
$npm install
기본적으로 node_modules 디렉토리는 코드 관리나 배포 시 업로드 하지 않음
용량이 커지는 것과 운영체제별 실행되는 코드가 다른 경우가 존재하는 문제 때문

npm install 명령어를 아무 옵션 없이 사용하면
package.json에 정의된 dependencies와 devDependencies의 의전송을 node_modules 디렉토리에 다운로드
*/

/*
$npm install --production
프로젝트를 배포할 때 개발용 의존성을 포함시키지 않고 package.json의 dependencies만 node_modules 디렉토리에 다운로드
*/

/*
의존성 버전 표기법
npm install [package-name]@[version]

예.
npm install [package-name]@[~1.13.0]
1.13.x 버전 설치

npm install [package-name]@[^1.13.0]
1.x.x 버전 설치, 가장 왼쪽의 0이 아닌 버전을 고정

npm install [package-name]@[0.12.0]
0.12.0 버전만 설치
*/

// 전역 패키지 추가
/*
$npm install [package-name] --global
패키지를 전역 패키지 디렉토리에 다운로드
커맨드라인 도구들을 주로 전역 패키지로 추가해 사용
예.
express-generator, pm2
*/

// ---------------- 스크립트 실행하기 ----------------
/*
{
  ...
  "scripts": {
    "say-hi": "echo \'hi'\"
  },
  ...
}
*/
/*
실행 결과
$npm install say-hi
'hi'
*/

// ----------------
// 스크립트 내에서 의존성 패키지 사용하기
/*
"scripts": {'test': "node_modules/.bin/tap test/\*.js"}
->
"scripts": {"test": "tap test/\*.js"}
*/
