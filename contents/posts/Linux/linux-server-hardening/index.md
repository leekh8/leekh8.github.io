---
title: "Linux 서버 보안 강화 가이드: 실무 하드닝 체크리스트 완전 정리"
description: "SSH 키 인증, sudo 최소 권한, PAM 패스워드 정책, fail2ban, 방화벽 설정까지 Linux 서버를 운영할 때 반드시 적용해야 할 보안 강화(하드닝) 방법을 실무 명령어 중심으로 정리합니다."
date: 2026-05-06
update: 2026-05-06
tags:
  - Linux
  - Security
  - 서버보안
  - 하드닝
  - SSH
category: Security
series: "Linux 시스템 기초"
---

> 이 글은 [Linux 파일 권한 완전 정복](/linux-file-permissions/) 편에서 이어지는 시리즈 2편입니다.
> 파일 권한(chmod, chown, SUID/SGID)은 1편을 먼저 읽어보세요.

---

## 왜 Linux 하드닝인가

서버를 구성하고 나면 대부분 애플리케이션 배포에 집중합니다. 그런데 기본 설치 상태(Default Configuration)의 Linux는 편의성을 위해 보안을 일부 타협한 상태입니다.

```bash
# 방치된 서버에 흔히 존재하는 위험 요소들
$ netstat -tlnp            # 열려있는 포트 확인 — 불필요한 서비스가 많음
$ cat /etc/passwd | grep -v nologin  # 로그인 가능한 시스템 계정 존재
$ find / -perm -4000 2>/dev/null     # SUID 바이너리 목록 — 권한 상승 경로
$ last | head -20          # 이상한 로그인 기록이 있을 수 있음
```

하드닝(Hardening)은 **공격 표면(Attack Surface)을 줄이는 과정**입니다. 완벽한 방어는 없지만, 공격자가 포기하게 만드는 것이 목표입니다.

---

## 1. 사용자·계정 관리 보안

### 불필요한 계정 비활성화

```bash
# 현재 시스템에 존재하는 모든 사용자 확인
cat /etc/passwd

# 로그인 가능한 계정만 필터링 (nologin, false 제외)
grep -v "/sbin/nologin\|/bin/false" /etc/passwd

# 사용하지 않는 시스템 계정 로그인 차단
sudo usermod -s /sbin/nologin <계정명>

# 계정 완전 잠금 (비밀번호 비활성화)
sudo passwd -l <계정명>

# 잠긴 계정 확인
sudo passwd -S <계정명>
```

### 패스워드 정책 강화 (PAM)

PAM(Pluggable Authentication Modules)으로 시스템 전체 패스워드 정책을 설정합니다.

```bash
# pam_pwquality 설치 (Ubuntu/Debian)
sudo apt install libpam-pwquality

# 패스워드 정책 설정
sudo vi /etc/security/pwquality.conf
```

```ini
# /etc/security/pwquality.conf
minlen = 12           # 최소 12자
minclass = 3          # 대문자·소문자·숫자·특수문자 중 3종류 이상
maxrepeat = 3         # 동일 문자 3회 이상 반복 금지
dcredit = -1          # 숫자 최소 1개
ucredit = -1          # 대문자 최소 1개
lcredit = -1          # 소문자 최소 1개
ocredit = -1          # 특수문자 최소 1개
```

```bash
# 패스워드 만료 정책 설정
sudo vi /etc/login.defs
```

```ini
# /etc/login.defs
PASS_MAX_DAYS   90    # 90일마다 비밀번호 변경
PASS_MIN_DAYS   7     # 변경 후 7일간 재변경 불가
PASS_WARN_AGE   14    # 만료 14일 전 경고
```

```bash
# 기존 계정에 만료 정책 적용
sudo chage -M 90 -m 7 -W 14 <계정명>

# 만료 정책 확인
sudo chage -l <계정명>
```

### 로그인 실패 잠금 (pam_tally2 / faillock)

```bash
# Ubuntu 22.04+ (faillock)
sudo vi /etc/security/faillock.conf
```

```ini
# /etc/security/faillock.conf
deny = 5             # 5회 실패 시 잠금
unlock_time = 300    # 5분 후 자동 해제
fail_interval = 900  # 15분 이내 실패 누적
```

```bash
# 잠긴 계정 확인
faillock --user <계정명>

# 수동으로 잠금 해제
faillock --user <계정명> --reset
```

---

## 2. SSH 보안 강화

SSH는 서버의 관문입니다. 기본 설정은 편의성 중심이므로 반드시 강화해야 합니다.

### 키 기반 인증으로 전환

```bash
# 로컬 PC에서 SSH 키 쌍 생성
ssh-keygen -t ed25519 -C "서버용 키" -f ~/.ssh/my_server_key

# 공개키를 서버에 복사
ssh-copy-id -i ~/.ssh/my_server_key.pub user@server_ip

# 또는 수동으로 추가
cat ~/.ssh/my_server_key.pub >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### sshd_config 보안 설정

```bash
sudo vi /etc/ssh/sshd_config
```

```bash
# /etc/ssh/sshd_config 핵심 보안 설정

# 포트 변경 (기본 22 → 비표준 포트로)
Port 2222

# root 직접 로그인 금지
PermitRootLogin no

# 패스워드 인증 비활성화 (키 인증만 허용)
PasswordAuthentication no
ChallengeResponseAuthentication no

# 빈 패스워드 계정 로그인 금지
PermitEmptyPasswords no

# 로그인 허용 사용자 제한 (allowlist)
AllowUsers deploy admin

# 로그인 시도 시간 제한
LoginGraceTime 30

# 최대 인증 시도 횟수
MaxAuthTries 3

# X11 포워딩 비활성화 (불필요하면)
X11Forwarding no

# TCP 포워딩 비활성화 (불필요하면)
AllowTcpForwarding no

# 유휴 세션 타임아웃 (5분)
ClientAliveInterval 300
ClientAliveCountMax 2

# SSH 프로토콜 버전 제한 (기본값이지만 명시)
Protocol 2

# 접속 가능 IP 제한 (가능하다면)
# ListenAddress 10.0.0.1
```

```bash
# 설정 문법 검사
sudo sshd -t

# 서비스 재시작
sudo systemctl restart sshd

# 접속 테스트 (현재 세션 유지하면서 새 창에서 테스트)
ssh -i ~/.ssh/my_server_key -p 2222 user@server_ip
```

> ⚠️ **주의**: 설정 변경 후 반드시 **기존 세션을 열어둔 채로** 새 창에서 접속 테스트하세요. 실수로 모든 접속이 차단될 수 있습니다.

### SSH 접속 로그 모니터링

```bash
# 실패한 로그인 시도 확인
grep "Failed password" /var/log/auth.log | tail -20
grep "Invalid user" /var/log/auth.log | tail -20

# 성공한 로그인 확인
grep "Accepted" /var/log/auth.log | tail -20

# 접속 시도 IP 통계
grep "Failed password" /var/log/auth.log | \
  awk '{print $11}' | sort | uniq -c | sort -rn | head -10
```

---

## 3. sudo 보안 설정

### 최소 권한 원칙 적용

```bash
# sudoers 파일 편집 (visudo로만 편집할 것)
sudo visudo
```

```bash
# /etc/sudoers 설정 예시

# 기본값: wheel 그룹에 sudo 전체 권한
%wheel ALL=(ALL:ALL) ALL

# 특정 사용자에게 특정 명령만 허용
deploy ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx
deploy ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart app

# 위험한 설정 — 절대 하지 말 것
# deploy ALL=(ALL) NOPASSWD: ALL  ← 사실상 root 권한

# sudo 로그 강화 (기본 /var/log/auth.log에 기록됨)
Defaults logfile="/var/log/sudo.log"
Defaults log_input, log_output  # 입출력 내용까지 로깅
```

### NOPASSWD 오용 사례

```bash
# 위험: 쉘을 실행할 수 있는 명령어에 NOPASSWD를 주면 권한 상승 가능
# 예를 들어 vim에 NOPASSWD를 주면:
sudo vim /etc/passwd
# vim 안에서 :!/bin/bash 실행 → root 쉘 획득 가능

# GTFOBins(https://gtfobins.github.io)에서
# sudo 권한 상승 가능한 바이너리 목록 확인 가능
```

### sudo 사용 내역 감사

```bash
# sudo 실행 내역 확인
sudo cat /var/log/auth.log | grep sudo | tail -20

# 또는 journalctl 사용
sudo journalctl -u sudo | tail -20
```

---

## 4. SUID/SGID 바이너리 점검

SUID가 설정된 파일은 실행 시 파일 소유자(보통 root)의 권한으로 실행됩니다. 불필요한 SUID 바이너리는 권한 상승 경로가 됩니다.

```bash
# 시스템 전체 SUID 바이너리 찾기
find / -perm -4000 -type f 2>/dev/null | sort

# SGID 바이너리 찾기
find / -perm -2000 -type f 2>/dev/null | sort

# 일반적으로 허용되는 SUID 바이너리 목록 (배포판별로 다름)
# /usr/bin/passwd
# /usr/bin/sudo
# /usr/bin/su
# /usr/bin/ping
# /usr/bin/newgrp
```

```bash
# 불필요한 SUID 제거
sudo chmod u-s /usr/bin/불필요한바이너리

# 예: ping은 최근 Linux에서 capabilities로 대체됨
# SUID 제거 후 capabilities로 대체
sudo chmod u-s /usr/bin/ping
sudo setcap cap_net_raw+ep /usr/bin/ping
```

### World-writable 파일 찾기

```bash
# 누구나 쓸 수 있는 파일/디렉토리 찾기 (보안 위험)
find / -perm -0002 -type f 2>/dev/null | grep -v proc | grep -v sys

# /tmp를 제외한 world-writable 디렉토리
find / -perm -0002 -type d 2>/dev/null | grep -v "^/proc\|^/sys\|^/tmp\|^/run"
```

---

## 5. 네트워크 보안 — 방화벽 설정

### UFW (Ubuntu)

```bash
# UFW 활성화
sudo apt install ufw -y

# 기본 정책: 모든 인바운드 차단, 아웃바운드 허용
sudo ufw default deny incoming
sudo ufw default allow outgoing

# 필요한 포트만 허용
sudo ufw allow 2222/tcp   # 변경한 SSH 포트
sudo ufw allow 80/tcp     # HTTP
sudo ufw allow 443/tcp    # HTTPS

# 특정 IP만 허용 (사무실 IP 등)
sudo ufw allow from 203.0.113.0/24 to any port 2222

# 활성화
sudo ufw enable

# 상태 확인
sudo ufw status verbose
```

### firewalld (RHEL/CentOS/Rocky)

```bash
# 활성화 및 시작
sudo systemctl enable --now firewalld

# 현재 zone 확인
sudo firewall-cmd --get-active-zones

# 서비스 허용
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=http

# 포트 직접 허용
sudo firewall-cmd --permanent --add-port=2222/tcp

# 적용
sudo firewall-cmd --reload

# 열린 포트/서비스 확인
sudo firewall-cmd --list-all
```

### 불필요한 서비스 비활성화

```bash
# 실행 중인 서비스 목록
sudo systemctl list-units --type=service --state=running

# 불필요한 서비스 비활성화 예시
sudo systemctl disable --now avahi-daemon    # Zeroconf (내부 네트워크만 사용 시)
sudo systemctl disable --now cups            # 프린터 서비스 (서버라면 불필요)
sudo systemctl disable --now bluetooth       # 블루투스

# 열린 포트 확인
sudo ss -tlnp          # TCP
sudo ss -ulnp          # UDP
```

---

## 6. fail2ban — 자동 침입 차단

fail2ban은 로그 파일을 모니터링하다가 비정상적인 접속 시도를 자동으로 차단합니다.

```bash
# 설치
sudo apt install fail2ban -y          # Ubuntu/Debian
sudo dnf install fail2ban -y          # RHEL/Rocky

# 설정 파일 복사 (원본 보존)
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo vi /etc/fail2ban/jail.local
```

```ini
# /etc/fail2ban/jail.local

[DEFAULT]
# 차단 시간 (초): 3600 = 1시간
bantime = 3600

# 이 시간(초) 안에 maxretry 횟수 초과 시 차단
findtime = 600

# 최대 시도 횟수
maxretry = 5

# 차단 방법 (iptables-multiport 권장)
banaction = iptables-multiport

# 이메일 알림 (설정된 경우)
# destemail = admin@example.com
# action = %(action_mwl)s

[sshd]
enabled = true
port    = 2222           # 변경한 SSH 포트
logpath = %(sshd_log)s
maxretry = 3             # SSH는 더 엄격하게

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
```

```bash
# 서비스 시작
sudo systemctl enable --now fail2ban

# 상태 확인
sudo fail2ban-client status
sudo fail2ban-client status sshd

# 차단된 IP 확인
sudo fail2ban-client status sshd | grep "Banned IP"

# 특정 IP 차단 해제
sudo fail2ban-client set sshd unbanip 1.2.3.4
```

---

## 7. 로그 및 감사 설정

### 중요 로그 파일 위치

```bash
/var/log/auth.log       # 인증 관련 (SSH, sudo, su) — Ubuntu/Debian
/var/log/secure         # 동일 — RHEL/CentOS
/var/log/syslog         # 시스템 일반 로그
/var/log/kern.log       # 커널 로그
/var/log/fail2ban.log   # fail2ban 차단 기록
/var/log/nginx/         # 웹 서버 로그
/var/log/audit/audit.log  # auditd 감사 로그
```

### 로그 실시간 모니터링

```bash
# SSH 로그인 시도 실시간 모니터링
sudo tail -f /var/log/auth.log | grep -E "Failed|Invalid|Accepted"

# 전체 시스템 로그 (systemd)
sudo journalctl -f

# 특정 서비스 로그
sudo journalctl -u sshd -f
sudo journalctl -u nginx -f

# 오늘 발생한 오류만
sudo journalctl --since today -p err
```

### auditd — 시스템 감사

auditd는 파일 접근, 시스템 콜, 사용자 행위를 기록하는 Linux 감사 서비스입니다.

```bash
# 설치
sudo apt install auditd -y

# 주요 감사 규칙 추가
sudo vi /etc/audit/rules.d/hardening.rules
```

```bash
# /etc/audit/rules.d/hardening.rules

# /etc/passwd, /etc/shadow 접근 감사
-w /etc/passwd -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/group -p wa -k identity
-w /etc/sudoers -p wa -k sudoers

# sudo 실행 감사
-w /usr/bin/sudo -p x -k sudo_exec

# 네트워크 설정 변경 감사
-w /etc/hosts -p wa -k network
-w /etc/network/ -p wa -k network

# 중요 바이너리 실행 감사
-w /usr/bin/passwd -p x -k passwd_exec
-w /bin/su -p x -k su_exec
```

```bash
# 규칙 적용
sudo augenrules --load
sudo systemctl restart auditd

# 감사 로그 조회
sudo ausearch -k identity | tail -20   # /etc/passwd 접근
sudo ausearch -k sudo_exec | tail -20  # sudo 실행
sudo aureport --auth --summary          # 인증 요약 보고서
```

---

## 8. 커널 및 시스템 보안 설정

### sysctl 보안 설정

```bash
sudo vi /etc/sysctl.d/99-hardening.conf
```

```ini
# /etc/sysctl.d/99-hardening.conf

# IP 스푸핑 방지
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# ICMP 리다이렉트 무시 (라우팅 조작 방지)
net.ipv4.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0

# IP 포워딩 비활성화 (라우터가 아닌 경우)
net.ipv4.ip_forward = 0

# SYN flood 방어 (SYN Cookies)
net.ipv4.tcp_syncookies = 1

# 브로드캐스트 ICMP 무시 (Smurf 공격 방지)
net.ipv4.icmp_echo_ignore_broadcasts = 1

# 가짜 오류 응답 무시
net.ipv4.icmp_ignore_bogus_error_responses = 1

# dmesg 제한 (일반 사용자가 커널 메시지 못 보도록)
kernel.dmesg_restrict = 1

# ptrace 제한 (프로세스 디버깅 제한)
kernel.yama.ptrace_scope = 1

# 코어 덤프 비활성화
fs.suid_dumpable = 0
```

```bash
# 설정 적용
sudo sysctl -p /etc/sysctl.d/99-hardening.conf

# 현재 설정 확인
sudo sysctl -a | grep rp_filter
```

---

## 9. 보안 점검 자동화 — Lynis

Lynis는 Linux 시스템 보안 수준을 자동으로 점검하고 개선 항목을 알려주는 오픈소스 도구입니다.

```bash
# 설치
sudo apt install lynis -y          # Ubuntu/Debian
sudo dnf install lynis -y          # RHEL/Rocky

# 전체 보안 감사 실행
sudo lynis audit system

# 결과 요약 확인 (Hardening Index)
# Lynis 2.x → Hardening Index: 0-100점으로 표시
# 50 미만: 즉시 개선 필요
# 50-70: 평균 수준
# 70 이상: 양호

# 특정 카테고리만 점검
sudo lynis audit system --tests-from-group ssh
sudo lynis audit system --tests-from-group users

# 마지막 감사 결과 확인
sudo cat /var/log/lynis.log | grep "Suggestion\|Warning" | head -30
```

**Lynis 출력 예시**:
```
[+] SSH
------------------------------------
  - Checking running SSH daemon [ FOUND ]
  - Checking SSH protocol versions [ WARNING ] (Protocol 1 enabled)
  - Checking SSH PermitRootLogin [ OK ]
  - Checking SSH PasswordAuthentication [ WARNING ] (enabled)

Suggestions:
* Configure minimum password length to meet policy requirements [AUTH-9286]
* Default umask in /etc/login.defs could be more strict [AUTH-9328]
* Harden SSH daemon [SSH-7408]
```

---

## 전체 하드닝 체크리스트

### 계정 보안
- [ ] 불필요한 사용자 계정 비활성화 (`usermod -s /sbin/nologin`)
- [ ] 패스워드 복잡도 정책 설정 (`/etc/security/pwquality.conf`)
- [ ] 패스워드 만료 정책 설정 (`/etc/login.defs`)
- [ ] 로그인 실패 잠금 설정 (`faillock.conf`)

### SSH 보안
- [ ] 키 기반 인증으로 전환, 패스워드 인증 비활성화
- [ ] root 직접 로그인 금지 (`PermitRootLogin no`)
- [ ] SSH 기본 포트(22) 변경
- [ ] `AllowUsers`로 접속 허용 계정 제한
- [ ] 유휴 세션 타임아웃 설정 (`ClientAliveInterval`)

### 권한 관리
- [ ] sudo 최소 권한 원칙 적용 (특정 명령만 허용)
- [ ] `NOPASSWD: ALL` 설정 금지
- [ ] SUID/SGID 바이너리 목록 점검 및 불필요한 것 제거
- [ ] World-writable 파일 점검

### 네트워크
- [ ] 방화벽 활성화 (UFW / firewalld)
- [ ] 기본 인바운드 차단, 필요한 포트만 허용
- [ ] 불필요한 서비스 비활성화
- [ ] fail2ban 설치 및 설정

### 감사·모니터링
- [ ] auditd 설치 및 핵심 감사 규칙 설정
- [ ] sysctl 보안 설정 적용
- [ ] 로그 정기 검토 프로세스 수립
- [ ] Lynis 정기 감사 실행

---

## 마치며

Linux 하드닝은 한 번 하고 끝나는 작업이 아닙니다. 시스템이 변경될 때마다, 새로운 취약점이 발견될 때마다 반복해야 합니다.

현실적인 우선순위는 이렇습니다:

1. **SSH 강화** — 즉시 적용, 가장 많이 노출되는 공격 벡터
2. **방화벽 + fail2ban** — 브루트포스 공격 자동 차단
3. **sudo 권한 검토** — 권한 상승 경로 차단
4. **Lynis 감사** — 현재 수준 파악 후 우선순위 결정

완벽한 보안보다 **지속적인 개선**이 더 중요합니다.

---

## 관련 글

- [Linux 파일 권한 완전 정복 — chmod, chown, SUID/SGID/Sticky bit까지](/linux-file-permissions/)
- [OWASP Top 10:2025 완전 가이드](/owasp-top10-2025/)
- [SOAR란 무엇인가? 보안 자동화가 필요한 이유](/what-is-soar/)
