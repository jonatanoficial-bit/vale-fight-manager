# Vale Fight Manager — Parte 1

Primeiro vertical slice jogável do simulador de gestão de carreiras de boxe e MMA. Esta entrega trabalha com atletas, eventos e organizações fictícios e salva a carreira no `localStorage` do navegador.

## Incluído

- onboarding de empresário e academia, com foco de modalidade e dificuldade;
- primeiro atleta, scouting e contratação com impacto no caixa;
- central com treino, mídia, agenda, notícias e avanço de semana;
- luta regional com preparação, liquidação de custos e recompensa;
- upgrades persistentes de academia;
- livro-caixa e indicadores financeiros;
- layout responsivo para desktop e smartphone em paisagem;
- manifesto PWA e uso do logo fornecido pelo projeto.

## Como executar

Não há dependências de produção. Abra `index.html` em um navegador moderno ou sirva a pasta localmente:

```powershell
node scripts/serve.mjs
```

Depois acesse `http://localhost:4173`.

## Verificação

```powershell
npm run verify
```

O comando garante a presença dos artefatos essenciais da entrega. Os comportamentos centrais são executados diretamente no navegador.

## Limites desta parte

Ainda não há motor de luta 2D, cloud save, ranking independente, negociações completas, assets oficiais/licenciados ou entidades reais. Esses módulos devem entrar como lotes próprios, com regras, testes e verificação de direitos.

## Créditos de asset

`assets/vale-fight-manager-logo.png` foi fornecido pelo proprietário do projeto no briefing. Os demais visuais são compostos com CSS e conteúdo fictício.
