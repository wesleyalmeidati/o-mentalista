// Monta a leitura a partir dos traços mais fortes.
// Cada frase sai com a técnica usada, para a tela "Como o truque funciona?".
"use strict";

const Reading = (() => {
  // Semente derivada das respostas: mesmas respostas, mesmas frases.
  function semente(respostas) {
    return respostas.reduce((s, r, i) => (s * 31 + (r + 1) * (i + 7)) % 100003, 17);
  }

  const escolher = (lista, s, k = 0) => lista[(s + k * 7) % lista.length];

  function montar(frases, respostas, resultado) {
    const s = semente(respostas);
    const leitura = [];
    const add = (secao, f) => leitura.push({ secao, texto: f.texto, tecnica: f.tecnica });

    add("abertura", escolher(frases.abertura, s));

    resultado.top.forEach((item, i) => {
      const banco = frases.tracos[item.traco];
      const mania = { traco: item.traco, frases: [] };
      mania.frases.push({ texto: escolher(banco.mania, s, i).texto, tecnica: "traco" });
      if (item.pista) {
        const modelo = frases.pistas[i % frases.pistas.length];
        mania.frases.push({ texto: modelo.replace("{resposta}", item.pista.resposta), tecnica: "pista" });
      }
      mania.frases.push({ texto: escolher(banco.palpite, s, i).texto, tecnica: "palpite" });
      leitura.push({ secao: "mania", ...mania });
    });

    // Combinação: o primeiro par do top 3 que tenha frase especial.
    const top = resultado.top.map((t) => t.traco);
    const combo = frases.combos.find((c) => c.tracos.every((t) => top.includes(t)));
    if (combo) add("combo", combo);

    add("universal", escolher(frases.universais, s));
    add("final", escolher(frases.finais, s));
    return leitura;
  }

  return { montar, semente };
})();

if (typeof module !== "undefined") module.exports = Reading;
