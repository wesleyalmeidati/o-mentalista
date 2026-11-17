// Testes do motor (Fase 2). Rodar: node tests/motor.test.js
"use strict";
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const Engine = require("../js/engine.js");
const Reading = require("../js/reading.js");

const ler = (f) => JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", f), "utf8"));
const perguntas = ler("questions.json");
const frases = ler("phrases.json");
const n = perguntas.perguntas.length;

function leitura(respostas) {
  return Reading.montar(frases, respostas, Engine.pontuar(perguntas, respostas));
}

// 1. Mesmas respostas, mesma leitura.
const exemplo = [1, 2, 1, 3, 1, 2, 1, 0, 1, 1, 2, 0, 2, 0];
assert.deepStrictEqual(leitura(exemplo), leitura([...exemplo]));

// 2. Toda combinação de "sempre a opção k" gera leitura completa e com técnica conhecida.
for (let k = 0; k < 4; k++) {
  const l = leitura(Array(n).fill(k));
  const manias = l.filter((p) => p.secao === "mania");
  assert.strictEqual(manias.length, 3, "3 manias");
  for (const p of l.flatMap((p) => p.frases || [p])) {
    assert.ok(frases.tecnicas[p.tecnica], `técnica desconhecida: ${p.tecnica}`);
    assert.ok(!p.texto.includes("{resposta}"), "modelo de pista sem preencher");
  }
}

// 3. Todo traço tem frases, e todo traço consegue chegar ao top 3.
const noTop = new Set();
for (const t of Object.keys(perguntas.tracos)) {
  assert.ok(frases.tracos[t]?.mania?.length && frases.tracos[t]?.palpite?.length, `frases de ${t}`);
}
for (let tentativa = 0; tentativa < 5000; tentativa++) {
  const r = Array.from({ length: n }, (_, i) => (tentativa * 7 + i * i * 3 + (tentativa >> i % 5)) % 4);
  Engine.pontuar(perguntas, r).top.forEach((x) => noTop.add(x.traco));
}
assert.strictEqual(noTop.size, Object.keys(perguntas.tracos).length, `traços que nunca aparecem: ${Object.keys(perguntas.tracos).filter((t) => !noTop.has(t))}`);

// 4. Todo palpite está escrito como palpite.
for (const t of Object.values(frases.tracos)) {
  for (const p of t.palpite) assert.match(p.texto, /^(Meu palpite|Arrisco)/, p.texto);
}

// 5. Resposta faltando dá erro claro.
assert.throws(() => Engine.pontuar(perguntas, [0, 1]), /Esperava 14 respostas/);

console.log("ok: todos os testes do motor passaram\n");
for (const p of leitura(exemplo)) {
  if (p.frases) p.frases.forEach((f) => console.log(`  [${f.tecnica}] ${f.texto}`));
  else console.log(`[${p.tecnica}] ${p.texto}`);
}
