// Navegação entre as telas Início → Questionário → Leitura.
// Nada é guardado: as respostas vivem só nesta variável e somem ao fechar a página.
"use strict";

(() => {
  const $ = (id) => document.getElementById(id);
  const semAnimacao = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esperar = (ms) => new Promise((r) => setTimeout(r, semAnimacao ? 0 : ms));

  let perguntas = null;
  let frases = null;
  let respostas = [];
  let atual = 0;
  let geracao = 0; // cancela a animação da leitura se a pessoa clicar em "Jogar de novo"

  // ---------- telas ----------
  function mostrar(idTela, idFoco) {
    for (const t of document.querySelectorAll(".tela")) t.hidden = t.id !== idTela;
    window.scrollTo(0, 0);
    $(idFoco).focus({ preventScroll: true });
  }

  // ---------- carga ----------
  async function carregar() {
    try {
      const [q, f] = await Promise.all([
        fetch("data/questions.json").then((r) => r.json()),
        fetch("data/phrases.json").then((r) => r.json()),
      ]);
      perguntas = q;
      frases = f;
      $("btn-comecar").disabled = false;
      $("btn-comecar").textContent = "Começar";
    } catch (e) {
      $("btn-comecar").textContent = "Indisponível";
      $("erro-carga").hidden = false;
      $("erro-carga").textContent =
        "Não consegui carregar as perguntas. Se você abriu o arquivo direto do computador, rode um servidor local (veja o README).";
    }
  }

  // ---------- questionário ----------
  function comecar() {
    respostas = [];
    atual = 0;
    $("interjeicao").textContent = "";
    renderPergunta();
    mostrar("tela-perguntas", "pergunta-texto");
  }

  function renderPergunta() {
    const q = perguntas.perguntas[atual];
    const total = perguntas.perguntas.length;
    $("progresso-texto").textContent = `Pergunta ${atual + 1} de ${total}`;
    $("progresso-barra").style.width = `${(atual / total) * 100}%`;
    $("pergunta-area").textContent = perguntas.areas[q.area];
    $("pergunta-texto").textContent = q.texto;
    $("btn-voltar").hidden = atual === 0;

    const caixa = $("opcoes");
    caixa.replaceChildren();
    q.opcoes.forEach((o, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "opcao";
      b.textContent = o.texto;
      if (respostas[atual] === i) b.classList.add("escolhida");
      b.addEventListener("click", () => responder(i));
      caixa.append(b);
    });
  }

  function responder(i) {
    const q = perguntas.perguntas[atual];
    respostas[atual] = i;
    const fala = frases.interjeicoes[q.id];
    $("interjeicao").textContent = fala ? fala.texto : "";
    if (atual + 1 < perguntas.perguntas.length) {
      atual++;
      renderPergunta();
      $("pergunta-texto").focus({ preventScroll: true });
    } else {
      revelar();
    }
  }

  function voltar() {
    if (atual === 0) return;
    atual--;
    $("interjeicao").textContent = "";
    renderPergunta();
    $("pergunta-texto").focus({ preventScroll: true });
  }

  // ---------- leitura ----------
  function paragrafo(texto, tecnica, classe) {
    const p = document.createElement("p");
    p.className = `frase ${classe || ""}`.trim();
    p.dataset.tecnica = tecnica;
    const span = document.createElement("span");
    span.textContent = texto;
    const tag = document.createElement("small");
    tag.className = "tag-tecnica";
    tag.textContent = frases.tecnicas[tecnica].nome;
    p.append(span, tag);
    return p;
  }

  function bloco(item) {
    if (item.secao !== "mania") {
      const classe = { abertura: "teatral", final: "teatral final", combo: "destaque", universal: "" }[item.secao];
      return paragrafo(item.texto, item.tecnica, classe);
    }
    const art = document.createElement("article");
    art.className = "mania";
    const h = document.createElement("h3");
    h.textContent = perguntas.tracos[item.traco];
    art.append(h, ...item.frases.map((f) => paragrafo(f.texto, f.tecnica)));
    return art;
  }

  async function revelar() {
    const minhaGeracao = ++geracao;
    const resultado = Engine.pontuar(perguntas, respostas);
    const leitura = Reading.montar(frases, respostas, resultado);

    $("leitura").replaceChildren();
    $("leitura").classList.remove("revelada");
    $("acoes").hidden = true;
    $("truque").hidden = true;
    $("btn-truque").setAttribute("aria-expanded", "false");
    mostrar("tela-leitura", "titulo-leitura");

    $("pensando").textContent = "Hm… deixe-me ver…";
    await esperar(1400);
    if (minhaGeracao !== geracao) return;
    $("pensando").textContent = "";

    for (const item of leitura) {
      const el = bloco(item);
      el.classList.add("surgindo");
      $("leitura").append(el);
      await esperar(item.secao === "mania" ? 1100 : 700);
      if (minhaGeracao !== geracao) return;
    }

    montarTruque(leitura);
    $("acoes").hidden = false;
  }

  function montarTruque(leitura) {
    const usadas = new Set(leitura.flatMap((i) => (i.frases || [i]).map((f) => f.tecnica)));
    const dl = $("truque-tecnicas");
    dl.replaceChildren();
    for (const [chave, t] of Object.entries(frases.tecnicas)) {
      if (!usadas.has(chave)) continue;
      const dt = document.createElement("dt");
      dt.textContent = t.nome;
      const dd = document.createElement("dd");
      dd.textContent = t.explicacao;
      dl.append(dt, dd);
    }
  }

  function alternarTruque() {
    const abrir = $("truque").hidden;
    $("truque").hidden = !abrir;
    $("leitura").classList.toggle("revelada", abrir);
    $("btn-truque").setAttribute("aria-expanded", String(abrir));
    $("btn-truque").textContent = abrir ? "Esconder o truque" : "Como o truque funciona?";
    if (abrir) $("truque").scrollIntoView({ behavior: semAnimacao ? "auto" : "smooth", block: "start" });
  }

  function jogarDeNovo() {
    geracao++;
    respostas = [];
    mostrar("tela-inicio", "titulo-inicio");
  }

  // ---------- ligações ----------
  $("btn-comecar").addEventListener("click", comecar);
  $("btn-voltar").addEventListener("click", voltar);
  $("btn-truque").addEventListener("click", alternarTruque);
  $("btn-novo").addEventListener("click", jogarDeNovo);
  carregar();
})();
