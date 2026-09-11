# Genesis — Leitor RSS

Leitor RSS/Atom pessoal e mínimo: adicionar feeds, listar itens e marcar como lido. Sem conta e sem backend de sync — a lista de fontes e o estado de leitura ficam no `localStorage` do navegador.

## Rodar localmente

```bash
npm install
npm run dev -- --port 4317 --hostname 127.0.0.1
```

Abra [http://127.0.0.1:4317](http://127.0.0.1:4317).

## Como usar

1. Cole a URL de um feed RSS ou Atom e clique em **Adicionar**.
2. Veja a timeline (ou filtre por fonte).
3. Marque itens como lidos / não lidos. Abrir o link também marca como lido.

Feed de teste: `https://hnrss.org/frontpage`

## Stack

Next.js, TypeScript, Tailwind, shadcn/ui, `rss-parser` (fetch no servidor para contornar CORS).
