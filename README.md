# Vale Fight Manager — MVP Fases 1 a 13 + Evoluções 14 e 15

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
- Centro de Treinamento: atleta selecionável, foco de camp e calendário semanal editável antes de cada avanço;
- cinco atributos persistentes (striking, grappling, cardio, defesa e QI de luta) que influenciam a simulação tática;
- fadiga, preparo, risco de lesão, recuperação médica e bloqueio de novos cards enquanto o atleta não está liberado;
- migração automática dos saves anteriores para a Fase 6.
- Hub de Prospecção: filtros de mercado, lista curta e dossiês pagos que são resolvidos pelo calendário antes de liberar uma negociação.
- Equipe técnica: seis especialistas fictícios contratáveis, com assinatura, folha semanal e efeitos reais em treino, recuperação, alcance de marca e inteligência de mercado.
- Patrocínios autorais: requisitos de fãs e reputação, pagamento de entrada, receita semanal, prazo de contrato e bônus efetivo nos eventos próprios.
- Migração automática dos saves anteriores para as Fases 7, 8 e 9.
- Competições por convite: critérios verificáveis de OVR, reputação e pontos, taxa de inscrição, rota marcada no calendário e recompensa após a Fight Night.
- Mundo vivo ampliado: caixa estratégica, decisões de imprensa, rivalidades reativas, eventos monitorados e radar global de agenda.
- Cada decisão e competição atualiza caixa, fãs, reputação, moral, rivalidade, ranking e histórico de campanha; saves anteriores migram automaticamente para as Fases 10 e 11.
- Fight Night em transmissão: arena superior inspirada no octógono VALE fornecido, dois tokens de lutadores em movimento, barras de saúde e energia, avanço automático por round, escolhas de corner apenas nos intervalos e botão para jogar a toalha.
- Encerramentos verificáveis por nocaute técnico, finalização, interrupção do corner ou decisão; decisões exibem três scorecards e todos os resultados mostram o avatar do vencedor.
- Mapa mundial de circuitos autorais, pontos de competição, cidades e tabela de força dos circuitos. A arquitetura reserva a integração de marcas licenciadas, sem usar logos de terceiros nesta versão.
- Três slots manuais de carreira, autosave local e shell PWA offline com service worker.
- Temporada mundial jogável: pontos independentes por circuito, metas de elegibilidade, campeões autorais, rota de cinturão, desafio com custo de deslocamento e conquista persistente no histórico da carreira.
- Legado de campeão: defesas de título com desafiante definido, perda de cinturão, unificação entre dois títulos compatíveis e placar persistente de defesas, unificações e noites de título.

## Roadmap

O plano do MVP teve **13 lotes no total**, todos concluídos. Esta versão também entrega as **Evoluções 14 e 15**: temporada mundial, rota de cinturão, defesas e unificação. A visão das próximas evoluções está em [FUTURE_VISION.md](FUTURE_VISION.md).

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

Ainda não há animação 2D quadro a quadro, cloud save, áudio, defesas de título recorrentes, renovação/rescisão avançadas, venda de ingressos individual por setor ou entidades reais. A Fight Night é uma simulação automatizada de gestão; o ranking e os circuitos são independentes e construídos apenas com conteúdo fictício.

## Créditos de asset

`assets/vale-fight-manager-logo.png` e `assets/vale-octagon-arena.png` foram fornecidos pelo proprietário do projeto no briefing. Os retratos em `assets/fighters/` foram gerados por IA para representar personagens fictícios e não representam pessoas reais. As bandeiras são geradas por códigos ISO 3166-1 alpha-2 usados no catálogo local.
