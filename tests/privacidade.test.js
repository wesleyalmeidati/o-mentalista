// Guarda da LGPD: o site não pode coletar, guardar nem enviar dados.
// Rodar: node tests/privacidade.test.js
"use strict";
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const raiz = path.join(__dirname, "..");
const ler = (f) => fs.readFileSync(path.join(raiz, f), "utf8");
const js = fs.readdirSync(path.join(raiz, "js")).map((f) => ["js/" + f, ler("js/" + f)]);
const paginas = ["index.html", "privacidade.html"].map((f) => [f, ler(f)]);

// 1. Nenhum armazenamento no navegador nem envio de dados no código.
const proibidos = [
  /localStorage/, /sessionStorage/, /indexedDB/, /document\.cookie/,
  /navigator\.sendBeacon/, /XMLHttpRequest/, /WebSocket/, /navigator\.geolocation/,
];
for (const [f, txt] of js) {
  for (const p of proibidos) assert.ok(!p.test(txt), `${f} usa ${p}: isso trata dado e exige revisar a política`);
  // fetch só de arquivos do próprio site (caminho relativo).
  for (const m of txt.matchAll(/fetch\(\s*["'`]([^"'`]+)/g)) {
    assert.ok(!/^(https?:)?\/\//.test(m[1]), `${f} busca recurso externo: ${m[1]}`);
  }
}

// 2. Páginas sem script, estilo, fonte, imagem ou iframe de terceiros, e sem formulário.
for (const [f, html] of paginas) {
  assert.ok(!/<(script|link|img|iframe|source|video|audio)[^>]+(src|href)=["'](https?:)?\/\//i.test(html),
    `${f} carrega recurso de terceiros`);
  assert.ok(!/<form/i.test(html), `${f} tem formulário`);
  assert.ok(/http-equiv="Content-Security-Policy"[^>]*default-src 'self'/.test(html), `${f} sem a política de segurança (CSP)`);
}

// 3. O jogo aponta para a política de privacidade, e ela existe.
assert.ok(/href="privacidade\.html"/.test(paginas[0][1]), "index.html sem link para a política");
assert.ok(/LGPD/.test(paginas[1][1]), "política sem referência à LGPD");

console.log("ok: privacidade (LGPD)");
