import { readFile, writeFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';

const root = new URL('.', import.meta.url);
const meta = JSON.parse(await readFile(new URL('meta.json', root), 'utf8'));
const source = (await readFile(new URL('article.mdx', root), 'utf8'))
  .replaceAll('/blog/vacuum-fabric-pvc-midsole-production-dy-1124-vac/', './images/');

const { default: Article } = await evaluate(source, {
  ...runtime,
  baseUrl: import.meta.url,
});

const body = renderToStaticMarkup(React.createElement(Article));
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${meta.title} | Draft Preview</title>
  <style>
    :root { color-scheme: light; --ink:#0f172a; --body:#334155; --blue:#1e3a8a; --orange:#ea580c; --line:#e2e8f0; --soft:#f8fafc; }
    * { box-sizing:border-box; }
    body { margin:0; color:var(--body); background:#fff; font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; letter-spacing:0; }
    header { border-bottom:1px solid var(--line); background:#fff; }
    .nav { width:min(1120px,calc(100% - 40px)); min-height:70px; margin:auto; display:flex; align-items:center; justify-content:space-between; gap:24px; }
    .brand { color:var(--ink); font-size:20px; font-weight:800; }
    .brand span { color:var(--orange); }
    .draft { padding:6px 10px; border:1px solid #fed7aa; color:#9a3412; background:#fff7ed; border-radius:4px; font-size:12px; font-weight:700; text-transform:uppercase; }
    main { width:min(900px,calc(100% - 40px)); margin:0 auto; padding:52px 0 72px; }
    .breadcrumb { color:#64748b; font-size:14px; margin-bottom:24px; }
    h1 { margin:0; max-width:850px; color:var(--ink); font-size:clamp(36px,5vw,58px); line-height:1.08; letter-spacing:0; }
    .dek { max-width:760px; margin:22px 0 18px; color:#475569; font-size:20px; line-height:1.65; }
    .meta { color:#64748b; font-size:14px; margin-bottom:44px; }
    article { font-size:18px; line-height:1.8; }
    article h2 { clear:both; margin:52px 0 16px; color:var(--ink); font-size:30px; line-height:1.25; letter-spacing:0; }
    article h3 { margin:34px 0 10px; color:var(--blue); font-size:22px; line-height:1.35; letter-spacing:0; }
    article p { margin:0 0 22px; }
    article a { color:var(--blue); font-weight:600; text-decoration:none; }
    article a:hover { text-decoration:underline; }
    article strong { color:var(--ink); }
    article img { display:block; width:100%; height:auto; margin:30px 0 38px; border-radius:6px; }
    article blockquote { margin:28px 0; padding:17px 20px; border-left:4px solid var(--orange); background:var(--soft); color:#475569; }
    article blockquote p { margin:0; }
    article table { width:100%; border-collapse:collapse; margin:26px 0 38px; font-size:15px; line-height:1.55; }
    article th { color:var(--ink); background:#f1f5f9; text-align:left; }
    article th, article td { padding:12px 13px; border:1px solid var(--line); vertical-align:top; }
    article li { margin:8px 0; }
    article li::marker { color:var(--orange); }
    .cta { margin-top:58px; padding:30px; border-top:3px solid var(--orange); background:#f8fafc; }
    .cta h2 { margin:0 0 8px; font-size:26px; }
    .cta p { margin:0; }
    footer { padding:28px 20px; color:#64748b; background:#0f172a; text-align:center; font-size:13px; }
    @media (max-width:700px) {
      .nav, main { width:min(100% - 28px,900px); }
      main { padding-top:34px; }
      h1 { font-size:36px; }
      .dek { font-size:18px; }
      article { font-size:17px; }
      article h2 { font-size:26px; }
      article table { display:block; overflow-x:auto; white-space:normal; }
      article th, article td { min-width:145px; }
    }
  </style>
</head>
<body>
  <header><div class="nav"><div class="brand">DEYU <span>MACHINERY</span></div><div class="draft">Draft preview</div></div></header>
  <main>
    <div class="breadcrumb">Home / Blog / Footwear Materials</div>
    <h1>${meta.title}</h1>
    <p class="dek">${meta.description}</p>
    <div class="meta">Draft for review · Technical Guide · 12 min read</div>
    <article>${body}</article>
    <section class="cta"><h2>Evaluate Vacuum Fabric PVC Midsole Production</h2><p>Send Deyu your sample, fabric, PVC compound, size range and target output for a practical moulding assessment.</p></section>
  </main>
  <footer>Wenzhou Deyu Machinery Co., Ltd. · Article review preview</footer>
</body>
</html>`;

await writeFile(new URL('preview.html', root), html);
console.log('Created preview.html');
