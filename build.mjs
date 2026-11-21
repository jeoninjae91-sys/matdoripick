// 맛도리픽 프로필 링크용 상품 모음 페이지 생성. 사용: node site/build.mjs  → site/index.html + site/img/
// 상품·가격·링크는 episodes.mjs의 lineup에서 가져온다. 공개일·영상 ID는 아래 SCHEDULE(업로드예약표.md와 같게 유지).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { lineup } from '../episodes.mjs';
import { singles } from '../singles.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const SCHEDULE = {
  3: ['2026-11-16', 'eAawlJUrzTY'], 2: ['2026-11-17', 'OyIMaW7NRLo'], 4: ['2026-11-18', 'ALXY29nKp6w'],
  1: ['2026-11-19', 'VdjwVOM2urc'], 6: ['2026-11-20', 'iwC2_vFRS2c'], 5: ['2026-11-21', '53KEh0mbDnI'],
  7: ['2026-11-22', 'vFgZ0PnvnSU'],
};
// 단일 상품 편: 편 번호 → [공개일, 공개 시각, 영상 ID(올린 뒤 채움, 없으면 null)]
const SINGLE_SCHEDULE = {
  1: ['2026-11-19', '12:00', 'hfFEHyW_Zw8'], 2: ['2026-11-20', '12:00', 'BYSeRMQ9gcs'], 3: ['2026-11-21', '12:00', 'BVogtYARHms'],
  4: ['2026-11-22', '12:00', 'BtnOBv7Qa7w'], 5: ['2026-11-23', '12:00', '2Ezf7hszCh0'], 7: ['2026-11-24', '12:00', 'ysvNcgxU9fE'],
  // 6(삼립호빵)은 쿠팡 일시품절로 보류
};
// 대결 A(제철 단일 편, 원본은 대결/A/aNN-…): 유튜브에 올린 뒤 한 줄씩 추가. src는 음식채널 폴더 기준 사진 경로.
const EXTRA = [
  { n: 201, id: 'a01', title: '요즘 식품 검색 2위, 겨울 별미', date: '2026-11-19', time: '21:00', vid: 'lWYMob97O44', priceDate: '11/19',
    src: '../../대결/A/a01-gwamegi/real/p1/1.jpg',
    product: { short: '구룡포 햇과메기 세트', name: '구룡포 햇과메기 야채세트, 270g, 1팩', price: 27900, link: 'https://link.coupang.com/a/iMCBAvh8Ng' } },
  { n: 203, id: 'a03', title: '김장 대신 호텔 김치 4kg', date: '2026-11-20', time: '08:00', vid: 'MflhQdas-JA', priceDate: '11/19',
    src: '../../대결/A/a03-kimchi/real/p1/1.jpg',
    product: { short: '조선호텔 포기김치', name: '조선호텔 포기김치 프레시, 4kg, 1개', price: 36920, link: 'https://link.coupang.com/a/iMDiI5wRa0' } },
  { n: 206, id: 'a06', title: '한 개 천 원도 안 하는 대봉시', date: '2026-11-20', time: '21:00', vid: 'wAmwtQPCoPA', priceDate: '11/20',
    src: '../../대결/A/a06-persimmon/real/p1/1.jpg',
    product: { short: '새벽경매 대봉시 5kg', name: '새벽경매 후숙하면 정말 맛있는 대봉시, 5kg(15~18입), 1개', price: 12900, link: 'https://link.coupang.com/a/iMFoqV9LZk' } },
  { n: 204, id: 'a04', title: '2kg에 만 원대, 제철 홍가리비', date: '2026-11-20', time: '22:00', vid: 'Dt_huldAcDo', priceDate: '11/20',
    src: '../../대결/A/a04-scallop/real/p1/2.jpg',
    product: { short: '남해안 홍가리비', name: '남해안 산지직송 생물 홍가리비 (냉장), 2kg, 1개', price: 10790, link: 'https://link.coupang.com/a/iMDkmMZUTA' } },
  { n: 207, id: 'a07', title: '밥도둑 곱창돌김 50장', date: '2026-11-21', time: '21:00', vid: 'z16160w9zWc', priceDate: '11/21',
    src: '../../대결/A/a07-gim/real/p1/2.jpg',
    product: { short: '곱창돌김 50장', name: '곱창돌김, 2.6g, 50개입, 1개', price: 19070, link: 'https://link.coupang.com/a/iMFlfojkgS' } },
  { n: 208, id: 'a08', title: '한 개 2천 원, 아이스 군고구마', date: '2026-11-21', time: '22:00', vid: 'kiggNnNzU-A', priceDate: '11/21',
    src: '../../대결/A/a08-goguma/real/p1/2.jpg',
    product: { short: '아이스 군고구마 8개', name: '고구마공장 아이스 군고구마 (냉동), 120g, 8개', price: 16200, link: 'https://link.coupang.com/a/iN88edg4xo' } },
  { n: 209, id: 'a09', title: '2kg에 12,990원, 제주 감귤', date: '2026-11-22', time: '21:00', vid: '7g960MdBtp4', priceDate: '11/22',
    src: '../../대결/A/a09-gyul/real/p1/1.jpg',
    product: { short: '올레길 감귤 2kg', name: '올레길 AI 당도선별 11brix 감귤, 2kg(로열과), 1개', price: 12990, link: 'https://link.coupang.com/a/iQ0HiBuXqn' } },
  { n: 211, id: 'a11', title: '과메기 세트 2천 원 내렸어요', date: '2026-11-22', time: '22:00', vid: '-d9K3Mzbqi8', priceDate: '11/22 와우할인',
    src: '../../대결/A/a11-gwamegi2/real/p1/1.jpg',
    product: { short: '구룡포 햇과메기 세트', name: '구룡포 햇과메기 야채세트, 270g, 1팩', price: 25900, link: 'https://link.coupang.com/a/iMCBAvh8Ng' } },
];
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const won = (n) => n.toLocaleString('ko-KR') + '원';

fs.mkdirSync(path.join(here, 'img'), { recursive: true });
const eps = lineup.filter((e) => SCHEDULE[e.n]).map((e) => {
  const [date, vid] = SCHEDULE[e.n];
  const products = e.products.map((p, i) => {
    // 그 상품을 소개하는 대사의 첫 사진을 썸네일로 (자르기 표시는 뗀다)
    const src = e.lines[i + 1][1][0].split('@')[0];
    const out = `img/ep${String(e.n).padStart(2, '0')}-${i + 1}.jpg`;
    const dst = path.join(here, out);
    if (!fs.existsSync(dst)) {
      execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi', '-i', 'color=white:s=360x360', '-i', path.join(root, e.slug, src),
        '-filter_complex', '[1:v]scale=360:360:force_original_aspect_ratio=decrease[p];[0:v][p]overlay=(W-w)/2:(H-h)/2:format=auto,format=yuvj420p',
        '-frames:v', '1', '-q:v', '4', dst]);
    }
    return { ...p, img: out };
  });
  return { n: e.n, title: e.title, date, time: '19:00', vid, priceDate: e.priceDate, products };
}).concat(singles.filter((e) => SINGLE_SCHEDULE[e.n]).map((e) => {
  const [date, time, vid] = SINGLE_SCHEDULE[e.n];
  const out = `img/s${String(e.n).padStart(2, '0')}.jpg`;
  const dst = path.join(here, out);
  if (!fs.existsSync(dst)) {
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi', '-i', 'color=white:s=360x360', '-i', path.join(root, e.slug, e.pack.split('@')[0]),
      '-filter_complex', '[1:v]scale=360:360:force_original_aspect_ratio=decrease[p];[0:v][p]overlay=(W-w)/2:(H-h)/2:format=auto,format=yuvj420p',
      '-frames:v', '1', '-q:v', '4', dst]);
  }
  return { n: 100 + e.n, title: e.title, date, time, vid, priceDate: '11/18', products: [{ ...e.product, img: out }] };
})).concat(EXTRA.map((e) => {
  const out = `img/${e.id}.jpg`;
  const dst = path.join(here, out);
  if (!fs.existsSync(dst)) {
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi', '-i', 'color=white:s=360x360', '-i', path.join(root, e.src),
      '-filter_complex', '[1:v]scale=360:360:force_original_aspect_ratio=decrease[p];[0:v][p]overlay=(W-w)/2:(H-h)/2:format=auto,format=yuvj420p',
      '-frames:v', '1', '-q:v', '4', dst]);
  }
  return { n: e.n, title: e.title, date: e.date, time: e.time, vid: e.vid, priceDate: e.priceDate, products: [{ ...e.product, img: out }] };
})).sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1));

const sections = eps.map((e) => `
<section class="ep" data-pub="${e.date}T${e.time}:00+09:00">
  <h2>${esc(e.title)}</h2>
  <p class="meta">${Number(e.date.slice(5, 7))}월 ${Number(e.date.slice(8))}일 영상${e.vid ? ` · <a href="https://youtube.com/shorts/${e.vid}">영상 다시 보기</a>` : ''}</p>
  <ol>${e.products.map((p) => `
    <li><a class="card" href="${p.link}" target="_blank" rel="sponsored nofollow noopener">
      <img src="${p.img}" alt="${esc(p.short)}" width="96" height="96" loading="lazy">
      <span class="txt"><b>${esc(p.short)}</b><small>${esc(p.name)}</small>
      <span class="price">${won(p.price)} <i>${e.priceDate} 확인</i></span></span>
      <span class="go">쿠팡에서 보기</span></a></li>`).join('')}
  </ol>
</section>`).join('\n');

const html = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>맛도리픽 · 영상 속 상품 링크</title>
<meta name="description" content="맛도리픽 쇼츠에 나온 쿠팡 먹거리 상품 링크 모음입니다.">
<meta name="robots" content="noindex">
<style>
:root{--bg:#fffaf3;--card:#fff;--ink:#231a12;--sub:#75685c;--line:#eadfd2;--acc:#d6401f}
@media (prefers-color-scheme:dark){:root{--bg:#17120e;--card:#221b15;--ink:#f6efe7;--sub:#b3a595;--line:#3a2f25;--acc:#ff7a52}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 -apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif}
main{max-width:560px;margin:0 auto;padding:20px 16px 48px}
h1{font-size:24px;margin:8px 0 4px}h2{font-size:19px;margin:28px 0 2px}
.lead{color:var(--sub);margin:0 0 12px}.meta{color:var(--sub);font-size:13px;margin:0 0 8px}.meta a{color:inherit}
.notice{font-size:13px;color:var(--sub);border:1px solid var(--line);border-radius:10px;padding:10px 12px;background:var(--card)}
ol{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.card{display:grid;grid-template-columns:96px 1fr;gap:4px 12px;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:10px;color:inherit;text-decoration:none}
.card img{grid-row:span 2;border-radius:10px;background:#fff;object-fit:contain}
.txt{display:grid;gap:2px;min-width:0}.txt b{font-size:16px}.txt small{color:var(--sub);font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.price{font-weight:700;font-variant-numeric:tabular-nums}.price i{font-style:normal;font-weight:400;font-size:12px;color:var(--sub)}
.go{justify-self:start;background:var(--acc);color:#fff;font-size:14px;font-weight:700;border-radius:999px;padding:6px 14px}
footer{margin-top:32px;font-size:12px;color:var(--sub)}
</style></head><body><main>
<h1>맛도리픽</h1>
<p class="lead">영상에 나온 상품을 여기서 바로 확인하세요.</p>
<p class="notice">이 페이지는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다. 가격은 표시된 날짜에 확인한 것이며 바뀔 수 있습니다.</p>
${sections}
<footer>상품 사진 출처: 쿠팡 판매 페이지 · 유튜브 <a href="https://www.youtube.com/@today.matdoripick" style="color:inherit">@today.matdoripick</a></footer>
</main>
<script>
// 아직 공개 전인 영상의 상품은 숨긴다
for (const s of document.querySelectorAll('.ep')) if (new Date(s.dataset.pub) > new Date()) s.hidden = true;
</script>
<script>
// 방문·쿠팡 버튼 클릭 수 세기 (링크통계 Worker, 개인 정보 저장 없음)
(()=>{const E='https://linkstats.oneul-mwo-ipji-weather.workers.dev/hit?s=matdoripick';
const b=(t,k)=>{const u=E+'&t='+t+'&k='+encodeURIComponent(k);try{navigator.sendBeacon(u)}catch(e){fetch(u,{mode:'no-cors',keepalive:true})}};
const p=new URLSearchParams(location.search).get('from');let r='direct';try{if(document.referrer)r=new URL(document.referrer).hostname}catch(e){}
b('view',p?'from:'+p:r);
document.addEventListener('click',e=>{const a=e.target.closest('a.card');if(a)b('click',(a.querySelector('b')||a).textContent.trim())});})();
</script>
</body></html>
`;
fs.writeFileSync(path.join(here, 'index.html'), html);
console.log(`index.html 저장: ${eps.length}편, 상품 ${eps.reduce((a, e) => a + e.products.length, 0)}개`);
