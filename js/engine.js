// Motor de regras: transforma as respostas em pontos por traço.
// Regra: as mesmas respostas sempre geram o mesmo resultado (nada aleatório).
"use strict";

const Engine = (() => {
  // Maior pontuação que cada traço consegue fazer no questionário inteiro.
  // Serve para normalizar: sem isso, traços com mais opções apareceriam demais.
  function maximos(perguntas) {
    const max = {};
    for (const q of perguntas) {
      const melhor = {};
      for (const o of q.opcoes) {
        for (const [t, p] of Object.entries(o.tracos)) {
          melhor[t] = Math.max(melhor[t] || 0, p);
        }
      }
      for (const [t, p] of Object.entries(melhor)) max[t] = (max[t] || 0) + p;
    }
    return max;
  }

  // respostas: índice da opção escolhida em cada pergunta, na ordem do questionário.
  function pontuar(dados, respostas) {
    const perguntas = dados.perguntas;
    if (respostas.length !== perguntas.length) {
      throw new Error(`Esperava ${perguntas.length} respostas, recebi ${respostas.length}.`);
    }
    const max = maximos(perguntas);
    const pontos = {};
    const pista = {}; // a resposta que mais pesou em cada traço, para o mentalista citar

    perguntas.forEach((q, i) => {
      const opcao = q.opcoes[respostas[i]];
      if (!opcao) throw new Error(`Resposta inválida na pergunta ${q.id}.`);
      for (const [t, p] of Object.entries(opcao.tracos)) {
        pontos[t] = (pontos[t] || 0) + p;
        if (!pista[t] || p > pista[t].peso) pista[t] = { peso: p, pergunta: q.id, resposta: opcao.texto };
      }
    });

    const ordemFixa = Object.keys(dados.tracos); // desempate estável
    const ranking = ordemFixa
      .map((t) => ({ traco: t, pontos: pontos[t] || 0, forca: (pontos[t] || 0) / (max[t] || 1), pista: pista[t] || null }))
      .sort((a, b) => b.forca - a.forca || ordemFixa.indexOf(a.traco) - ordemFixa.indexOf(b.traco));

    return { ranking, top: ranking.slice(0, 3) };
  }

  return { pontuar, maximos };
})();

if (typeof module !== "undefined") module.exports = Engine;
