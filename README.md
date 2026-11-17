# The Mentalist

Um jogo de entretenimento que faz uma "leitura" divertida das suas manias, no estilo de um mentalista de ficção. Você responde 14 perguntas de múltipla escolha e o mentalista, um narrador original, faz três palpites confiantes e teatrais sobre você. No fim, ele revela como o truque funciona.

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

Em produção, o site fica no GitHub Pages.

## Estrutura

```
index.html          telas do jogo
css/style.css       tema escuro, celular primeiro
js/app.js           navegação entre telas
js/engine.js        motor de regras (respostas → pontos por traço)
js/reading.js       monta a leitura a partir dos traços
data/questions.json 14 perguntas em 7 áreas
data/phrases.json   banco de frases por traço
docs/estudo.md      anotações de estudo
```

## Licença

MIT. Veja [LICENSE](LICENSE).
