#!/usr/bin/env python3
"""
자동 블로그 포스트 생성 스크립트

주 1회 실행, 4개 주제 순환:
  1주: 보안 / SOAR / FortiSOAR
  2주: 웹 개발
  3주: 네트워크 (헷갈리는 개념 정리)
  4주+: Python 실습 → Linux/시스템 → Cloud/DevOps → 보안 개념 → (반복)
"""

import os
import json
import datetime
import subprocess
import re
import anthropic

# ── 경로 설정 ────────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT   = os.path.dirname(SCRIPT_DIR)
POSTS_DIR   = os.path.join(REPO_ROOT, "contents", "posts")
STATE_FILE  = os.path.join(SCRIPT_DIR, "post_state.json")

# ── 주제 정의 ────────────────────────────────────────────────
WEEK_TOPICS = {
    1: {"category": "Security", "name": "보안/SOAR/FortiSOAR",   "series": "보안 자동화 입문"},
    2: {"category": "Web",      "name": "웹 개발",               "series": None},
    3: {"category": "Network",  "name": "네트워크 기초",          "series": "네트워크 기초"},
}

# 4주차 이상: 순환
WEEK4_ROTATION = [
    {"category": "Python",   "name": "Python 실습",     "series": "Python 보안 자동화"},
    {"category": "Linux",    "name": "Linux/시스템",    "series": "Linux 기초"},
    {"category": "Cloud",    "name": "Cloud/DevOps",   "series": "Cloud/DevOps 기초"},
    {"category": "Security", "name": "보안 개념 심화",  "series": "보안 개념 정리"},
]

# ── 상태 관리 ────────────────────────────────────────────────

def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"week4_rotation_index": 0}


def save_state(state):
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)

# ── 주차 계산 ─────────────────────────────────────────────────

def get_week_of_month(date):
    """월 내 주차 (1일~7일=1주, 8~14일=2주, …)"""
    return (date.day - 1) // 7 + 1


def get_topic(state):
    week = get_week_of_month(datetime.date.today())
    if week <= 3:
        return WEEK_TOPICS[week], state
    # 4주차 이상: 순환 인덱스 사용
    idx = state.get("week4_rotation_index", 0)
    topic = WEEK4_ROTATION[idx % len(WEEK4_ROTATION)]
    state["week4_rotation_index"] = (idx + 1) % len(WEEK4_ROTATION)
    return topic, state

# ── 기존 포스트 목록 조회 ────────────────────────────────────

def get_existing_posts(category):
    cat_dir = os.path.join(POSTS_DIR, category)
    if not os.path.exists(cat_dir):
        return []
    posts = []
    for slug in os.listdir(cat_dir):
        path = os.path.join(cat_dir, slug, "index.md")
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            m = re.search(r'^title:\s*"(.+)"', content, re.MULTILINE)
            posts.append({"slug": slug, "title": m.group(1) if m else slug})
    return posts

# ── Claude API 호출 ───────────────────────────────────────────

def generate_post(topic, existing_posts):
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    today = datetime.date.today().isoformat()
    existing_titles = (
        "\n".join(f"- {p['title']}" for p in existing_posts)
        if existing_posts else "없음"
    )
    series_line = f'series: "{topic["series"]}"' if topic["series"] else ""

    prompt = f"""당신은 기술 블로그 포스트 작성 전문가입니다.

다음 조건에 맞는 Gatsby 블로그 포스트를 작성해주세요.

**주제 카테고리**: {topic["name"]}
**오늘 날짜**: {today}
**기존 포스트 목록 (중복 금지)**:
{existing_titles}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
출력 형식 (이 형식만 출력, 다른 설명 일절 없이):

---
title: "이모지 포함 제목"
description: "SEO 최적화된 설명 (150자 이내)"
date: {today}
update: {today}
tags:
  - 태그1
  - 태그2
  - 태그3
{series_line}
---

본문...

SLUG: slug-name-here
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**본문 작성 원칙**:

1. **독자 이해 최우선**: 처음 접하는 사람이 읽고 진짜 이해할 수 있게 작성
   - 개념 → 왜 필요한지 → 동작 원리 → 실전 예시 → 정리 순서
   - 구체적인 예시와 비유로 추상 개념을 쉽게 설명
2. **분량**: 최소 2,500단어 이상 (애드센스 기준 충분한 전문 콘텐츠)
3. **언어**: 한국어, 설명체 구어체 ("~다", "~이다")
4. **전문성**: 이직 포트폴리오로도 쓸 수 있는 깊이 있는 내용
5. **개인 색깔**: 보안 자동화·SOAR·Python에 관심 있는 엔지니어 관점 자연스럽게 녹이기
   - 업무 환경/회사 디테일은 절대 노출 금지

**참고문헌** (반드시 포함):
- 각주 형식 [^1], [^2] 사용
- 공신력 있는 1차 출처만: 공식 문서, Gartner, IBM, NIST, RFC, MDN, CISA 등

**Mermaid 다이어그램** (1~2개 필수):
- %%{{init: {{"theme": "base"}}}}%% 설정 블록 사용
- 줄바꿈: <br/> (\\n 절대 사용 금지)
- 노드 레이블: 따옴표로 감쌀 것 (예: A["레이블<br/>줄바꿈"])
- 엣지 레이블: 따옴표 필수 (예: -->|"레이블"|)
- themeVariables 전체 지정 금지 → 노드별 style 개별 지정
- 색상 팔레트 (역할별 구분, 개별 style 명령으로):
    입력/시작: #3498db  |  중립/수신: #7f8c8d  |  핵심 플랫폼: #2c3e50
    처리: #e67e22       |  조회/자동화: #9b59b6 |  대응/경고: #e74c3c
    완료/정상: #27ae60  |  외부 시스템: #1abc9c

**Bold 규칙**:
- **text**가 처럼 ** 닫힘 직후 한글 조사 금지
- 반드시 **text가** 처럼 조사를 bold 안에 포함

**SLUG 규칙**:
- 영문 소문자, 숫자, 하이픈만 사용 (예: how-nat-works)
- 기존 포스트 슬러그와 중복 금지
- 맨 마지막 줄에 SLUG: slug-name 형식으로 출력"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=8096,
        messages=[{"role": "user", "content": prompt}],
    )
    return message.content[0].text

# ── 파싱 및 저장 ──────────────────────────────────────────────

def parse_post(raw_text):
    """생성된 텍스트에서 SLUG 줄과 마크다운 본문 분리"""
    lines = raw_text.strip().split("\n")
    slug = None
    content_lines = []

    for line in lines:
        if line.strip().startswith("SLUG:"):
            slug = line.replace("SLUG:", "").strip()
        else:
            content_lines.append(line)

    content = "\n".join(content_lines).strip()

    # SLUG가 없으면 title에서 자동 생성
    if not slug:
        m = re.search(r'^title:\s*"(.+)"', content, re.MULTILINE)
        if m:
            title = m.group(1)
            slug = re.sub(r"[^\w\s-]", "", title.lower())
            slug = re.sub(r"[\s_]+", "-", slug).strip("-")
        if not slug:
            slug = f"post-{datetime.date.today().isoformat()}"

    return slug, content


def save_post(category, slug, content):
    post_dir = os.path.join(POSTS_DIR, category, slug)
    os.makedirs(post_dir, exist_ok=True)
    post_path = os.path.join(post_dir, "index.md")
    with open(post_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)
    return post_path

# ── Git push ──────────────────────────────────────────────────

def git_push(post_path, category, slug):
    subprocess.run(
        ["git", "config", "user.name", "github-actions[bot]"],
        cwd=REPO_ROOT, check=True
    )
    subprocess.run(
        ["git", "config", "user.email", "github-actions[bot]@users.noreply.github.com"],
        cwd=REPO_ROOT, check=True
    )

    files_to_add = [post_path, STATE_FILE]
    subprocess.run(["git", "add"] + files_to_add, cwd=REPO_ROOT, check=True)

    today = datetime.date.today().isoformat()
    commit_msg = f"post: [{category}] {slug} ({today})"
    result = subprocess.run(
        ["git", "commit", "-m", commit_msg],
        cwd=REPO_ROOT, capture_output=True, text=True
    )
    if result.returncode != 0:
        if "nothing to commit" in result.stdout or "nothing to commit" in result.stderr:
            print("[!] 커밋할 변경사항 없음 — 건너뜁니다.")
            return
        raise subprocess.CalledProcessError(result.returncode, "git commit", result.stderr)

    subprocess.run(["git", "push"], cwd=REPO_ROOT, check=True)

# ── 메인 ──────────────────────────────────────────────────────

def main():
    state = load_state()
    topic, new_state = get_topic(state)

    print(f"[*] 이번 주 주제: {topic['name']} (카테고리: {topic['category']})")

    existing_posts = get_existing_posts(topic["category"])
    print(f"[*] 기존 포스트 수: {len(existing_posts)}")

    print("[*] Claude API 호출 중...")
    raw_text = generate_post(topic, existing_posts)

    slug, content = parse_post(raw_text)
    print(f"[*] 생성된 슬러그: {slug}")

    post_path = save_post(topic["category"], slug, content)
    print(f"[*] 파일 저장: {post_path}")

    save_state(new_state)

    git_push(post_path, topic["category"], slug)
    print("[*] 완료!")


if __name__ == "__main__":
    main()
