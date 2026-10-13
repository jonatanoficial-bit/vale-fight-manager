# Vale Fight Manager — Fases 1 a 5

Vertical slice jogável do simulador de gestão de carreiras de boxe e MMA. Esta entrega trabalha com atletas, eventos e organizações fictícios e salva a carreira no `localStorage` do navegador.

## Incluído

- onboarding de empresário e academia, com foco de modalidade e dificuldade;
- primeiro atleta, scouting e contratação com impacto no caixa;
- central com treino, mídia, agenda, notícias e avanço de semana;
- luta regional com preparação, liquidação de custos e recompensa;
- upgrades persistentes de academia;
- livro-caixa e indicadores financeiros;
- layout responsivo para desktop e smartphone em paisagem;
- manifesto PWA e uso do logo fornecido pelo projeto.
- rankings independentes de MMA e boxe, com posições, pontuação e rota competitiva;
- calendário de eventos autônomos que se resolve ao avançar as semanas;
- migração automática do save da Parte 1, sem perda da carreira existente.
- Fight Night tático de três rounds: seis decisões por troca, saúde, energia, momentum e log do combate;
- resultado de luta aplicado ao cartel, caixa, fãs, reputação e ranking — não é uma tela decorativa;
- retratos cinematográficos de personagens fictícios criados por IA, com bandeiras nacionais persistentes no dossiê de cada atleta;
- arena octogonal fornecida no briefing integrada à tela de Fight Night;
- mesa de contratos: proposta ajustável, leitura do agente, fatores de aceitação e resposta que só se resolve ao enviar a oferta;
- contratos ativos, histórico, folha semanal e migração automática do save para a Fase 4.
- centro de eventos VALE: escolha de arena, data, atleta principal e campanha de promoção;
- reserva, marketing, card principal, preparação no calendário e transição direta para a Fight Night;
- liquidação persistente de bilheteria, mídia, produção, público, fãs e reputação após a luta principal;
- migração automática dos saves anteriores para a Fase 5.

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

## Limites atuais

Ainda não há animação 2D quadro a quadro, cloud save, áudio, patrocínios, renovação/rescisão avançadas, venda de ingressos individual por setor ou entidades reais. A Fight Night é uma simulação tática por turnos; o ranking e os resultados são independentes e construídos apenas com conteúdo fictício.

## Créditos de asset

`assets/vale-fight-manager-logo.png` e `assets/vale-octagon-arena.png` foram fornecidos pelo proprietário do projeto no briefing. Os retratos em `assets/fighters/` foram gerados por IA para representar personagens fictícios e não representam pessoas reais. As bandeiras são geradas por códigos ISO 3166-1 alpha-2 usados no catálogo local.
