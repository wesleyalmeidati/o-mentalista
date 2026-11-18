# The Mentalist

Um jogo de entretenimento que faz uma "leitura" divertida das suas manias, no estilo de um mentalista de ficção. Você responde 14 perguntas de múltipla escolha e o mentalista, um narrador original, faz três palpites confiantes e teatrais sobre você. No fim, ele revela como o truque funciona.

**Jogar:** https://wesleyalmeidati.github.io/o-mentalista/

> **Aviso:** isto é um jogo de entretenimento inspirado em mentalismo de ficção. Não é avaliação psicológica, diagnóstico nem conselho.

## Princípios

- **É um jogo.** Os "porquês" são palpites do mentalista, nunca conclusões.
- **Sem temas sensíveis.** Nada sobre saúde, traumas, relacionamentos íntimos, sexualidade, religião, política ou finanças pessoais.
- **Só múltipla escolha.** Não há campo de texto livre.
- **Zero coleta de dados.** Tudo roda no navegador: sem backend, banco, analytics, cookies ou fontes de terceiros. As respostas somem ao fechar a página.
- **O truque é revelado.** A leitura usa leitura fria e o efeito Forer, e o próprio jogo explica isso.
- **Inspirado, não copiado.** O nome homenageia a série *The Mentalist*, mas o projeto não usa imagens, logos, trilha, falas ou personagens dela. É um projeto de fã, sem fins comerciais e sem vínculo com os detentores dos direitos.

## Como rodar

Não há build. Como o site carrega arquivos JSON, ele precisa de um servidor local simples (abrir o `index.html` direto do disco bloqueia o `fetch`):

```bash
python -m http.server 8000
# abra http://localhost:8000
```

Em produção, o site fica no GitHub Pages: https://wesleyalmeidati.github.io/o-mentalista/

## Estrutura

```
index.html          telas do jogo
privacidade.html    política de privacidade (LGPD)
css/style.css       tema escuro, celular primeiro
js/app.js           navegação entre telas
js/engine.js        motor de regras (respostas → pontos por traço)
js/reading.js       monta a leitura a partir dos traços
data/questions.json 14 perguntas em 7 áreas
data/phrases.json   banco de frases por traço
docs/estudo.md      anotações de estudo
tests/              testes do motor e guarda da LGPD
```

Testes: `node tests/motor.test.js` e `node tests/privacidade.test.js`.

## Privacidade (LGPD)

O jogo foi feito para não tratar dados pessoais, em linha com a LGPD (Lei 13.709/2018). A [política de privacidade](privacidade.html) explica isso para quem joga. As garantias técnicas:

- **Nada sai do navegador:** sem cookies, `localStorage`, analytics, formulários ou recursos de terceiros.
- **Política de segurança (CSP)** nas duas páginas: o navegador só carrega e só se conecta ao próprio site.
- **`no-referrer`:** links externos não recebem o endereço de origem.
- **Guarda automática:** `tests/privacidade.test.js` falha se alguém acrescentar armazenamento, envio de dados, script externo ou formulário. Se um dia o jogo precisar tratar dados, a política tem que ser revista antes.
- **Hospedagem:** o GitHub Pages registra o IP dos acessos por conta própria; a política informa isso e aponta para a declaração de privacidade do GitHub.

## Licença

MIT. Veja [LICENSE](LICENSE).
