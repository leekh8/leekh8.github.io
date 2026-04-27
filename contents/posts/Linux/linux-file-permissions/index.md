---
title: "🔐 Linux 파일 권한 완전 정복 — chmod, chown, SUID/SGID/Sticky bit까지"
description: "chmod, chown, SUID, SGID, Sticky bit까지 Linux 파일 권한을 완전히 정리합니다. ls -l 출력 해석, 숫자/기호 표기법, 특수 권한 비트 설정까지 실제 명령어 예시로 설명합니다."
date: 2026-04-03
update: 2026-04-03
tags:
  - Linux
  - Security
  - 시스템관리
series: "Linux 시스템 기초"
---

처음 Linux를 접하면 `ls -l` 출력이 이렇게 생겼다.

```
-rwxr-xr-- 1 alice devteam 4096 Apr  3 10:00 deploy.sh
drwxr-s--- 2 root  devteam 4096 Apr  3 10:00 secrets/
-rwsr-xr-x 1 root  root    8192 Apr  3 10:00 /usr/bin/passwd
```

`rwx`는 대충 알겠는데, `s`는 뭐고 `-r--`이 왜 나오는지, 숫자로 `755`라고 쓰면 뭔지 — 이게 한 번에 정리가 안 되는 분들이 많다. 이 글에서 처음부터 끝까지 다 정리한다.

---

## Linux 권한이 왜 중요한가

Linux는 **다중 사용자(multi-user) 시스템**이다. 서버 한 대에 여러 사람이 접속하고, 여러 프로세스가 동시에 돌아간다. 파일 권한이 없으면 누군가 실수로 — 혹은 악의적으로 — `/etc/passwd`를 덮어쓰거나 다른 사용자의 개인정보를 읽을 수 있다.

보안 관점에서도 마찬가지다. **최소 권한 원칙(Principle of Least Privilege)**은 "꼭 필요한 권한만 줘야 한다"는 개념인데, 이걸 실제로 구현하는 수단이 파일 권한이다.

---

## 기본 구조: ls -l 읽기

```
-rwxr-xr-- 1 alice devteam 4096 Apr  3 10:00 deploy.sh
│││││││││
│││││││││└─ other: r--
││││││└────  group: r-x
│││└───────  owner: rwx
││└────────  파일 타입
│└─────────  (없음)
```

첫 번째 문자는 **파일 타입**이다.

| 문자 | 의미 |
|------|------|
| `-`  | 일반 파일 |
| `d`  | 디렉토리 |
| `l`  | 심볼릭 링크 |
| `c`  | 문자 장치 파일 (character device) |
| `b`  | 블록 장치 파일 (block device) |
| `p`  | 파이프 |
| `s`  | 소켓 |

그 뒤는 **owner / group / other** 순으로 3자씩 `rwx` 조합이다.

| 문자 | 파일에서 의미 | 디렉토리에서 의미 |
|------|-------------|-----------------|
| `r`  | 읽기 (내용 보기) | 목록 조회 (`ls`) |
| `w`  | 쓰기 (수정/삭제) | 파일 생성/삭제 |
| `x`  | 실행 | 접근 (`cd`) |
| `-`  | 권한 없음 | 권한 없음 |

> **디렉토리에서 `x`(execute) 권한**이 없으면 `cd`도 못 하고 그 안에 있는 파일 경로도 접근 불가다. `r`만 있어도 목록은 보이지만 파일은 못 읽는다. 이 차이가 헷갈리는 포인트다.

---

## 숫자 표기법 (Octal)

각 권한은 비트로 표현된다.

```
r = 4 (100)
w = 2 (010)
x = 1 (001)
- = 0 (000)
```

`rwx` = 4+2+1 = **7**
`r-x` = 4+0+1 = **5**
`r--` = 4+0+0 = **4**

`-rwxr-xr--` → owner=7, group=5, other=4 → **`754`**

자주 쓰는 조합:

| 숫자 | 기호 | 주로 쓰는 곳 |
|------|------|------------|
| `755` | `rwxr-xr-x` | 실행 파일, 공개 디렉토리 |
| `644` | `rw-r--r--` | 일반 파일, 설정 파일 |
| `600` | `rw-------` | 개인 키 파일 (`~/.ssh/id_rsa`) |
| `700` | `rwx------` | 개인 스크립트 |
| `777` | `rwxrwxrwx` | 임시 디렉토리 (보안 주의) |

---

## chmod — 권한 변경

### 숫자 방식

```bash
chmod 755 deploy.sh     # -rwxr-xr-x
chmod 600 ~/.ssh/id_rsa # -rw-------
chmod -R 644 ./logs/    # 디렉토리 하위 전체 재귀 적용
```

### 기호 방식

`[대상][연산자][권한]` 형태다.

- 대상: `u`(owner), `g`(group), `o`(other), `a`(all)
- 연산자: `+`(추가), `-`(제거), `=`(지정)

```bash
chmod u+x script.sh       # owner에 실행 권한 추가
chmod go-w sensitive.txt  # group, other에서 쓰기 제거
chmod a=r readme.txt      # 모두 읽기 전용으로 지정
chmod u=rwx,go=r-x app    # owner는 rwx, group/other는 r-x
```

---

## chown / chgrp — 소유자 변경

```bash
chown alice deploy.sh           # owner를 alice로
chown alice:devteam deploy.sh   # owner + group 동시 변경
chown :devteam deploy.sh        # group만 변경
chgrp devteam deploy.sh         # group만 변경 (chgrp)

chown -R www-data:www-data /var/www/html  # 재귀 적용
```

> `chown`은 보통 **root 권한**이 필요하다. 일반 사용자는 자기 파일을 다른 사용자에게 넘기지 못한다 (보안상 의도된 설계).

---

## umask — 기본 권한의 비밀

파일을 새로 만들면 권한이 자동으로 결정된다. 그 기준이 **umask**다.

기본 최대 권한에서 umask를 "빼는" 방식이다.

```
파일 기본 최대: 666 (rw-rw-rw-)
디렉토리 기본 최대: 777 (rwxrwxrwx)

umask = 022

파일:      666 - 022 = 644 (rw-r--r--)
디렉토리:  777 - 022 = 755 (rwxr-xr-x)
```

현재 umask 확인:
```bash
umask        # 0022
umask -S     # u=rwx,g=rx,o=rx (기호 방식)
```

변경:
```bash
umask 027    # 새 파일은 640, 디렉토리는 750
```

---

## 특수 권한 비트: SUID, SGID, Sticky bit

일반 `rwx` 외에 3가지 특수 비트가 있다. 처음 보면 당황스러운데, 각각 목적이 명확하다.

### SUID (Set User ID) — 실행 시 소유자 권한

```
-rwsr-xr-x 1 root root /usr/bin/passwd
     ^
     s = SUID
```

`passwd` 명령어는 `/etc/shadow`를 수정해야 한다. 이 파일은 root만 쓸 수 있다. 그런데 일반 사용자도 `passwd`로 자기 비밀번호를 바꿀 수 있다.

비결은 SUID다. **SUID가 설정된 실행 파일은 실행하는 동안 파일 소유자(root)의 권한으로 동작한다.** 실행자가 누구든 상관없이.

```bash
chmod u+s /path/to/file   # SUID 설정
chmod 4755 /path/to/file  # 숫자 방식 (앞에 4)
```

> **보안 주의**: SUID root 파일이 취약하면 권한 상승(privilege escalation) 공격의 대상이 된다. CTF 문제에서 SUID 파일 찾기(`find / -perm -4000`)는 단골 문제다.

### SGID (Set Group ID) — 그룹 권한 상속

파일에 설정 시 SUID와 유사하게 동작하지만, **그룹 기준**이다.

```
drwxr-sr-x 2 root devteam secrets/
        ^
        s = SGID (디렉토리에 설정)
```

**디렉토리에 SGID가 설정되면**, 그 안에 새로 만드는 파일/디렉토리가 자동으로 **해당 디렉토리의 그룹을 상속**한다.

팀 공유 폴더에 자주 쓴다. `devteam` 그룹 멤버라면 누가 파일을 만들어도 자동으로 `devteam` 그룹 소유가 된다.

```bash
chmod g+s /shared/project   # SGID 설정
chmod 2755 /shared/project  # 숫자 방식 (앞에 2)
```

### Sticky bit — 삭제 보호

```
drwxrwxrwt 1 root root /tmp
          ^
          t = sticky bit
```

`/tmp`는 모든 사용자가 파일을 만들 수 있다. 그런데 `w` 권한이 있다는 건 다른 사람 파일도 지울 수 있다는 뜻이다.

**Sticky bit가 설정된 디렉토리에서는 파일 소유자 또는 root만 그 파일을 삭제할 수 있다.** 남이 만든 파일은 지우지 못한다.

```bash
chmod +t /shared/uploads    # sticky bit 설정
chmod 1777 /shared/uploads  # 숫자 방식 (앞에 1)
```

### 특수 비트 한눈에 보기

| 비트 | 기호 | 숫자 | 파일에서 | 디렉토리에서 |
|------|------|------|---------|------------|
| SUID | `s` (u 자리) | 4000 | 소유자 권한으로 실행 | 의미 없음 |
| SGID | `s` (g 자리) | 2000 | 그룹 권한으로 실행 | 새 파일이 그룹 상속 |
| Sticky | `t` (o 자리) | 1000 | 의미 없음 | 소유자만 삭제 가능 |

---

## 실전 예제

### SSH 개인 키 권한 설정

SSH 접속 시 개인 키 권한이 너무 넓으면 경고가 뜨고 접속이 안 된다.

```bash
# 잘못된 예
-rw-rw-r-- 1 alice alice ~/.ssh/id_rsa
# WARNING: UNPROTECTED PRIVATE KEY FILE!

# 올바른 설정
chmod 600 ~/.ssh/id_rsa    # -rw-------
chmod 700 ~/.ssh/          # drwx------
chmod 644 ~/.ssh/id_rsa.pub
chmod 600 ~/.ssh/authorized_keys
```

### 웹 서버 파일 권한

```bash
# Nginx/Apache 기준
chown -R www-data:www-data /var/www/html

# 정적 파일
find /var/www/html -type f -exec chmod 644 {} \;

# 디렉토리
find /var/www/html -type d -exec chmod 755 {} \;

# 업로드 디렉토리 (쓰기 허용, 실행 금지)
chmod 775 /var/www/html/uploads
chmod -R a-x /var/www/html/uploads  # 업로드된 파일에 실행 권한 없애기
```

### SUID 파일 찾기 (보안 감사)

```bash
# 시스템 전체 SUID 파일 목록
find / -perm -4000 -type f 2>/dev/null

# 일반적으로 있어야 하는 것들:
# /usr/bin/passwd
# /usr/bin/sudo
# /usr/bin/su

# 이외 의심스러운 SUID 파일이 있다면 확인 필요
```

### 팀 공유 디렉토리 설정

```bash
# 1. 그룹 생성 및 멤버 추가
groupadd devteam
usermod -aG devteam alice
usermod -aG devteam bob

# 2. 공유 디렉토리 생성
mkdir /shared/project
chown root:devteam /shared/project

# 3. 그룹 쓰기 + SGID + sticky bit
chmod 2775 /shared/project  # rwxrwsr-x
chmod +t /shared/project    # 삭제 보호 추가 → rwxrws--t (3775)

# 결과: devteam 멤버는 파일 생성/수정 가능,
#       자기가 만든 파일만 삭제 가능,
#       새 파일은 자동으로 devteam 그룹 소유
```

---

## 자주 하는 실수

**실수 1: `chmod 777` 남발**

개발 중 권한 오류가 나면 `chmod 777`로 해결하려는 경우가 많다. 일단 돌아가지만 누구나 읽고 쓰고 실행할 수 있는 파일이 된다. 서버에서는 절대 금물이다.

**실수 2: 재귀 chmod에서 파일/디렉토리 구분 안 함**

```bash
# 잘못된 예 - 파일에도 실행 권한이 붙는다
chmod -R 755 /var/www/html

# 올바른 예
find /var/www/html -type d -exec chmod 755 {} \;
find /var/www/html -type f -exec chmod 644 {} \;
```

**실수 3: 디렉토리 x 권한 제거**

```bash
chmod -x /some/dir  # 이러면 cd도 못 하고 안에 있는 파일도 못 읽는다
```

---

## 정리

Linux 파일 권한은 처음엔 복잡해 보이지만 구조가 명확하다.

1. **기본 구조**: 파일 타입 1자 + owner/group/other 각 3자 (`rwx`)
2. **숫자 표기**: r=4, w=2, x=1 합산 (755, 644, 600)
3. **umask**: 새 파일 기본 권한을 정하는 마스크 (보통 022)
4. **특수 비트**: SUID(4000) / SGID(2000) / Sticky(1000) — 목적이 각각 다름

보안 관점에서는 **최소 권한 원칙**을 항상 기억하자. 필요한 것만 열고, SUID 파일 목록은 주기적으로 감사하고, `chmod 777`은 임시도 지양하는 것이 습관이 되어야 한다.

---

## 참고

- [Linux man pages: chmod(1)](https://man7.org/linux/man-pages/man1/chmod.1.html)
- [Linux man pages: chown(1)](https://man7.org/linux/man-pages/man1/chown.1.html)
- [The Linux Documentation Project: File Permissions](https://tldp.org/LDP/intro-linux/html/sect_03_04.html)
- [OWASP: Least Privilege](https://owasp.org/www-community/vulnerabilities/Insecure_Direct_Object_Reference)
- Red Hat Enterprise Linux 9 Security Hardening Guide
