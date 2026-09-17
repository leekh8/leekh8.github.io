/**
 * 빌드 산출물(public/)의 색인 관련 계약을 검사한다. CI의 build job에서 실행한다.
 *
 * 왜 소스가 아니라 public/ 을 읽는가
 *   2026-09-17에 시리즈 페이지 18개와 /series/, /tags/, /search/ 가 전부 canonical을
 *   홈으로 찍고 있었다. Google은 그것을 "이 페이지는 홈의 복제본"으로 읽고 색인에서 빼며,
 *   그 페이지에 걸린 링크도 함께 힘을 잃는다. 홈 HTML에는 최신 10편만 들어가므로
 *   나머지 40편으로 가는 길이 통째로 끊겨 있었다. 2026년 발행 34편이 검색에 한 건도
 *   안 잡힌 원인이다.
 *
 *   그런데 소스에는 <SEO url={...} /> 한 줄뿐이라 눈으로 봐서는 멀쩡했다. 결함은
 *   helmet과 gatsby-ssr를 거쳐 나온 HTML에만 있었다. 실제로 배포되는 것을 검사해야 한다.
 *
 * 왜 셸 grep이 아닌가
 *   처음에는 워크플로우 안에 grep으로 짰다가 두 번 틀렸다.
 *   (1) grep이 한글 섞인 HTML을 바이너리로 판단해 "binary file matches"만 출력하고
 *       매치 내용을 안 준다. 그래서 전 페이지가 "canonical 없음"으로 잡혔다.
 *   (2) HTML에서 &는 &amp;로 이스케이프되는데 파일 경로에는 &로 있다.
 *       시리즈 이름에 &가 들어간 한 건이 영원히 불일치로 남는다.
 *   HTML을 줄 단위 텍스트 도구로 다루면 이런 식으로 샌다.
 */
const fs = require("fs")
const path = require("path")

const { siteUrl } = require("../blog-config")

const PUBLIC_DIR = path.join(__dirname, "..", "public")

// 페이지가 이보다 적게 나오면 빌드가 제대로 안 된 것이다. 0건 검사하고 "불일치 0건"으로
// 통과하는 길을 막는다. 막는 장치는 막지 않는 쪽으로 고장난다.
const MIN_PAGES = 50
const MIN_SITEMAP_URLS = 50

function decodeEntities(s) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&#x0*27;/gi, "'")
    .replace(/&amp;/g, "&") // 반드시 마지막. 먼저 풀면 &amp;lt; 같은 이중 인코딩이 깨진다
}

function* walkHtml(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walkHtml(full)
    } else if (entry.name === "index.html") {
      yield full
    }
  }
}

/** public/ 기준 상대 경로를 사이트 URL로. public/a/b/index.html -> <site>/a/b/ */
function urlOf(file) {
  const rel = path.relative(PUBLIC_DIR, file).split(path.sep).join("/")
  const dir = rel.slice(0, rel.length - "index.html".length)
  return dir === "" ? siteUrl : `${siteUrl}/${dir}`
}

function checkCanonicals() {
  const problems = []
  let checked = 0

  for (const file of walkHtml(PUBLIC_DIR)) {
    const html = fs.readFileSync(file, "utf8")

    // meta refresh 리다이렉트 페이지는 일부러 옮겨갈 주소를 가리킨다
    if (/http-equiv=["']refresh["']/i.test(html)) continue

    checked += 1
    const want = urlOf(file)
    const m = html.match(/rel="canonical"\s+href="([^"]*)"/)

    if (!m) {
      problems.push(`${file}: canonical 태그가 없습니다`)
      continue
    }
    const got = decodeEntities(m[1])
    if (got !== want) {
      problems.push(`${file}: canonical=${got} (기대: ${want})`)
    }
  }
  return { checked, problems }
}

function checkSitemap() {
  const sitemap = path.join(PUBLIC_DIR, "sitemap-0.xml")
  if (!fs.existsSync(sitemap)) {
    return { checked: 0, problems: ["sitemap-0.xml 이 없습니다"] }
  }
  const xml = fs.readFileSync(sitemap, "utf8")
  const locs = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map(m =>
    decodeEntities(m[1])
  )

  const problems = []
  for (const loc of locs) {
    if (!loc.startsWith(siteUrl)) {
      problems.push(`sitemap에 다른 호스트가 있습니다: ${loc}`)
      continue
    }
    // sitemap은 경로를 퍼센트 인코딩해서 싣는다(XML 사이트맵 규약대로다).
    // 파일 경로는 원본 UTF-8이라 그대로 비교하면 한글이 든 주소가 전부 "파일 없음"이
    // 된다. 실제로 시리즈 12개와 한글 슬러그가 그렇게 잡혔다.
    let rel
    try {
      rel = decodeURIComponent(loc.slice(siteUrl.length)).replace(/^\//, "")
    } catch (e) {
      problems.push(`sitemap URL을 해석할 수 없습니다: ${loc}`)
      continue
    }
    const file = path.join(PUBLIC_DIR, rel, "index.html")
    if (!fs.existsSync(file)) {
      problems.push(`sitemap에 있으나 파일이 없습니다: ${loc}`)
    }
  }
  return { checked: locs.length, problems }
}

function report(name, { checked, problems }, min) {
  console.log(`\n== ${name}: ${checked}건 검사, 문제 ${problems.length}건`)
  for (const p of problems) console.log(`::error::${p}`)
  if (checked < min) {
    console.log(
      `::error::검사 대상이 ${checked}건뿐입니다(최소 ${min}). 빌드가 제대로 안 됐거나 경로 규칙이 바뀌었습니다`
    )
    return false
  }
  return problems.length === 0
}

const canonical = checkCanonicals()
const sitemap = checkSitemap()

// 두 검사를 모두 돌린 뒤에 판정한다. && 로 묶으면 앞이 실패할 때 뒤가 실행되지 않아
// 한 번에 하나씩만 보게 되고, 고치고 밀어 넣는 왕복이 그만큼 늘어난다.
const canonicalOk = report("canonical 자기참조", canonical, MIN_PAGES)
const sitemapOk = report("sitemap 실재 여부", sitemap, MIN_SITEMAP_URLS)
const ok = canonicalOk && sitemapOk

process.exit(ok ? 0 : 1)
